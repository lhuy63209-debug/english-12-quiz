const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'db.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

// In-memory set for active admin session tokens
const adminTokens = new Set();

// -------------------------------------------------------------
// Database Persistence Helpers
// -------------------------------------------------------------
const defaultDb = {
  accessCodes: [],
  users: [],
  results: [],
  adminPassword: 'admin2024'
};

let db = { ...defaultDb };

/**
 * Generate a random alphanumeric string for access code: 'ENG-' + 6 uppercase chars/digits
 */
function generateCodeString() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ENG-${result}`;
}

/**
 * Generate a unique access code not already present in the database
 */
function generateUniqueAccessCode() {
  let code;
  let attempts = 0;
  do {
    code = generateCodeString();
    attempts++;
    if (attempts > 1000) break;
  } while (db.accessCodes && db.accessCodes.some(c => c.code === code));
  return code;
}

/**
 * Load database from db.json or initialize with defaults
 */
function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      db = JSON.parse(data);
      if (!Array.isArray(db.accessCodes)) db.accessCodes = [];
      if (!Array.isArray(db.users)) db.users = [];
      if (!Array.isArray(db.results)) db.results = [];
      if (!db.adminPassword) db.adminPassword = 'admin2024';
    } else {
      db = {
        accessCodes: [],
        users: [],
        results: [],
        adminPassword: 'admin2024'
      };
    }
  } catch (err) {
    console.error('[DB] Error loading db.json, falling back to defaults:', err.message);
    db = {
      accessCodes: [],
      users: [],
      results: [],
      adminPassword: 'admin2024'
    };
  }

  // Generate 10 default access codes if none exist
  if (!db.accessCodes || db.accessCodes.length === 0) {
    console.log('[Init] Generating 10 default access codes...');
    db.accessCodes = [];
    for (let i = 0; i < 10; i++) {
      const code = generateUniqueAccessCode();
      db.accessCodes.push({
        code,
        used: false,
        usedBy: null,
        createdAt: new Date().toISOString()
      });
    }
    saveDb();
    console.log('[Init] Default access codes generated:');
    db.accessCodes.forEach((c, idx) => {
      console.log(`  [${idx + 1}] ${c.code}`);
    });
  }
}

/**
 * Save database to db.json synchronously with atomic write
 */
function saveDb() {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('[DB] Error saving db.json:', err.message);
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
    } catch (fallbackErr) {
      console.error('[DB] Fallback save failed:', fallbackErr.message);
    }
  }
}

// Initialize DB on startup
loadDb();

// -------------------------------------------------------------
// Quiz Data Loader Helper
// -------------------------------------------------------------
function getQuizData() {
  try {
    const quizDataPath = path.join(__dirname, 'quizData.js');
    if (fs.existsSync(quizDataPath)) {
      // Re-require to reflect any updates to quizData.js dynamically
      delete require.cache[require.resolve('./quizData.js')];
      const data = require('./quizData.js');
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (err) {
    console.warn('[QuizData] Warning: Unable to read ./quizData.js:', err.message);
  }
  return [];
}

// -------------------------------------------------------------
// Middlewares
// -------------------------------------------------------------

// 1. CORS Middleware for all origins
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token, x-admin-token');
  res.setHeader('Access-Control-Expose-Headers', 'x-auth-token, x-admin-token');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// 2. JSON & URL-encoded body parser
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// 3. Simple in-memory rate limiter for API endpoints
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 300; // 300 requests per minute

function rateLimiter(req, res, next) {
  // Only apply rate limiting to /api routes
  if (!req.path.startsWith('/api')) {
    return next();
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const clientData = rateLimitMap.get(clientIp);

  if (!clientData || (now - clientData.startTime) > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(clientIp, { count: 1, startTime: now });
    return next();
  }

  clientData.count++;
  if (clientData.count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.'
    });
  }

  next();
}

app.use(rateLimiter);

// Cleanup stale rate limit map entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now - data.startTime > RATE_LIMIT_WINDOW * 2) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref();

// 4. Static file serving from ./public
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}
app.use(express.static(PUBLIC_DIR));

// -------------------------------------------------------------
// Authentication Middlewares
// -------------------------------------------------------------

/**
 * Student Auth Middleware
 * Validates x-auth-token header (or Bearer token) and ensures user is not blocked
 */
function authMiddleware(req, res, next) {
  const token = req.headers['x-auth-token'] ||
    (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null);

  if (!token) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập: Không tìm thấy token xác thực.' });
  }

  const user = db.users.find(u => u.token === token);
  if (!user) {
    return res.status(401).json({ error: 'Token xác thực không hợp lệ hoặc đã hết hạn.' });
  }

  if (user.blocked) {
    return res.status(403).json({ error: 'Tài khoản của bạn đã bị khóa bởi quản trị viên.' });
  }

  // Update lastActive timestamp
  user.lastActive = new Date().toISOString();
  req.user = user;
  next();
}

/**
 * Admin Auth Middleware
 * Validates x-admin-token header (or Bearer token)
 */
function adminAuthMiddleware(req, res, next) {
  const token = req.headers['x-admin-token'] ||
    (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null);

  if (!token || !adminTokens.has(token)) {
    return res.status(401).json({ error: 'Từ chối truy cập: Token quản trị không hợp lệ hoặc đã hết hạn.' });
  }

  next();
}

// -------------------------------------------------------------
// API Routes: Student Authentication
// -------------------------------------------------------------

/**
 * 1. POST /api/auth/login
 * Body: { code: string, name: string }
 */
app.post('/api/auth/login', (req, res) => {
  const { code, name } = req.body || {};

  if (!code || typeof code !== 'string' || !code.trim()) {
    return res.status(400).json({ error: 'Vui lòng nhập mã truy cập.' });
  }
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Vui lòng nhập họ và tên của học sinh.' });
  }

  const trimmedCode = code.trim().toUpperCase();
  const trimmedName = name.trim();

  // Find access code in db
  const accessCodeObj = db.accessCodes.find(c => c.code.toUpperCase() === trimmedCode);
  if (!accessCodeObj) {
    return res.status(404).json({ error: 'Mã truy cập không tồn tại hoặc không chính xác.' });
  }

  // Check if there is an existing user associated with this code
  let existingUser = db.users.find(u => u.code.toUpperCase() === trimmedCode);

  if (existingUser) {
    // If code found and used by different user name
    if (existingUser.name.toLowerCase() !== trimmedName.toLowerCase()) {
      return res.status(403).json({ error: 'Mã truy cập này đã được sử dụng bởi học sinh khác.' });
    }

    // Check if user is blocked
    if (existingUser.blocked) {
      return res.status(403).json({ error: 'Tài khoản của bạn đã bị khóa bởi quản trị viên.' });
    }

    // Re-login: generate new token, update lastActive
    existingUser.token = uuidv4();
    existingUser.lastActive = new Date().toISOString();
    saveDb();

    return res.json({
      success: true,
      token: existingUser.token,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        code: existingUser.code
      }
    });
  } else {
    // Code not yet bound to a user record, but check if marked used
    if (accessCodeObj.used) {
      if (accessCodeObj.usedBy && accessCodeObj.usedBy.toLowerCase() !== trimmedName.toLowerCase()) {
        return res.status(403).json({ error: 'Mã truy cập này đã được sử dụng bởi học sinh khác.' });
      }
    }

    // Create new user, mark code as used
    const newUser = {
      id: uuidv4(),
      code: accessCodeObj.code,
      name: trimmedName,
      blocked: false,
      approved: true,
      lastActive: new Date().toISOString(),
      token: uuidv4()
    };

    accessCodeObj.used = true;
    accessCodeObj.usedBy = trimmedName;

    db.users.push(newUser);
    saveDb();

    return res.status(201).json({
      success: true,
      token: newUser.token,
      user: {
        id: newUser.id,
        name: newUser.name,
        code: newUser.code
      }
    });
  }
});

/**
 * 2. GET /api/auth/verify
 * Header: x-auth-token
 */
app.get('/api/auth/verify', authMiddleware, (req, res) => {
  saveDb();
  res.json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      code: req.user.code
    }
  });
});

// -------------------------------------------------------------
// API Routes: Quiz Management & Taking
// -------------------------------------------------------------

/**
 * 3. GET /api/quizzes
 * Auth required (x-auth-token)
 * Returns quiz list without questions + completion status
 */
app.get('/api/quizzes', authMiddleware, (req, res) => {
  const quizzes = getQuizData();
  const userResults = db.results.filter(r => r.userId === req.user.id);

  const quizList = quizzes.map(q => {
    // Find latest submission by this user for this quiz
    const matching = userResults.filter(r => String(r.quizId) === String(q.id));
    const latest = matching.length > 0 ? matching[matching.length - 1] : null;

    return {
      id: q.id,
      title: q.title,
      difficulty: q.difficulty || 'medium',
      timeLimit: q.timeLimit || 900,
      questionCount: Array.isArray(q.questions) ? q.questions.length : (q.questionCount || 0),
      completed: !!latest,
      score: latest ? latest.score : null,
      percentage: latest ? latest.percentage : null
    };
  });

  res.json({ quizzes: quizList });
});

/**
 * 4. GET /api/quiz/:id
 * Auth required (x-auth-token)
 * Return quiz with questions WITHOUT answers/explanations
 */
app.get('/api/quiz/:id', authMiddleware, (req, res) => {
  const quizzes = getQuizData();
  const quiz = quizzes.find(q => String(q.id) === String(req.params.id));

  if (!quiz) {
    return res.status(404).json({ error: 'Không tìm thấy đề thi yêu cầu.' });
  }

  const sanitizedQuestions = (quiz.questions || []).map(q => ({
    id: q.id,
    type: q.type,
    question: q.question,
    options: q.options
  }));

  res.json({
    quiz: {
      id: quiz.id,
      title: quiz.title,
      difficulty: quiz.difficulty || 'medium',
      timeLimit: quiz.timeLimit || 900,
      questionCount: sanitizedQuestions.length,
      questions: sanitizedQuestions
    }
  });
});

/**
 * 5. POST /api/quiz/:id/submit
 * Auth required (x-auth-token)
 * Body: { answers: { "1": 0, "2": 2, ... }, timeSpent: number }
 */
app.post('/api/quiz/:id/submit', authMiddleware, (req, res) => {
  const quizzes = getQuizData();
  const quiz = quizzes.find(q => String(q.id) === String(req.params.id));

  if (!quiz) {
    return res.status(404).json({ error: 'Không tìm thấy đề thi yêu cầu.' });
  }

  const { answers, timeSpent } = req.body || {};
  const submittedAnswers = (answers && typeof answers === 'object') ? answers : {};

  const questions = quiz.questions || [];
  const total = questions.length;
  let score = 0;
  const details = [];

  questions.forEach(q => {
    // Answer keys could be numbers or strings
    const rawAnswer = submittedAnswers[q.id] !== undefined
      ? submittedAnswers[q.id]
      : submittedAnswers[String(q.id)];

    const yourAnswer = (rawAnswer !== undefined && rawAnswer !== null && rawAnswer !== '')
      ? Number(rawAnswer)
      : null;

    const isCorrect = yourAnswer !== null && yourAnswer === Number(q.answer);
    if (isCorrect) {
      score++;
    }

    details.push({
      questionId: q.id,
      correct: isCorrect,
      yourAnswer,
      correctAnswer: q.answer,
      explanation: q.explanation || '',
      question: q.question,
      options: q.options
    });
  });

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const parsedTimeSpent = typeof timeSpent === 'number' ? Math.max(0, Math.floor(timeSpent)) : 0;

  const resultRecord = {
    id: uuidv4(),
    userId: req.user.id,
    userName: req.user.name,
    userCode: req.user.code,
    quizId: quiz.id,
    quizTitle: quiz.title,
    score,
    total,
    percentage,
    timeSpent: parsedTimeSpent,
    answers: submittedAnswers,
    submittedAt: new Date().toISOString()
  };

  db.results.push(resultRecord);
  saveDb();

  res.json({
    success: true,
    score,
    total,
    percentage,
    details,
    result: resultRecord
  });
});

// -------------------------------------------------------------
// API Routes: Admin Panel
// -------------------------------------------------------------

/**
 * 6. POST /api/admin/login
 * Body: { password: string }
 */
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Vui lòng cung cấp mật khẩu quản trị.' });
  }

  if (password !== db.adminPassword) {
    return res.status(401).json({ error: 'Mật khẩu quản trị không chính xác.' });
  }

  const token = uuidv4();
  adminTokens.add(token);

  res.json({
    success: true,
    token
  });
});

/**
 * Helper: GET /api/admin/verify
 * Allows admin dashboard to verify stored token
 */
app.get('/api/admin/verify', adminAuthMiddleware, (req, res) => {
  res.json({ success: true, valid: true });
});

/**
 * 7. GET /api/admin/users
 * Admin auth required (x-admin-token)
 */
app.get('/api/admin/users', adminAuthMiddleware, (req, res) => {
  res.json({ users: db.users });
});

/**
 * 8. PATCH /api/admin/users/:id
 * Admin auth required (x-admin-token)
 * Body: { blocked: boolean } or { approved: boolean }
 */
app.patch('/api/admin/users/:id', adminAuthMiddleware, (req, res) => {
  const user = db.users.find(u => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
  }

  if (req.body.blocked !== undefined) {
    user.blocked = Boolean(req.body.blocked);
  }
  if (req.body.approved !== undefined) {
    user.approved = Boolean(req.body.approved);
  }

  saveDb();

  res.json({
    success: true,
    user
  });
});

/**
 * 9. POST /api/admin/codes
 * Admin auth required (x-admin-token)
 * Body: { count: number }
 */
app.post('/api/admin/codes', adminAuthMiddleware, (req, res) => {
  const requestedCount = parseInt(req.body && req.body.count, 10);
  const count = (!isNaN(requestedCount) && requestedCount > 0) ? Math.min(requestedCount, 100) : 1;

  const newCodes = [];
  for (let i = 0; i < count; i++) {
    const code = generateUniqueAccessCode();
    const codeObj = {
      code,
      used: false,
      usedBy: null,
      createdAt: new Date().toISOString()
    };
    db.accessCodes.push(codeObj);
    newCodes.push(codeObj);
  }

  saveDb();

  res.status(201).json({
    success: true,
    codes: newCodes
  });
});

/**
 * 10. GET /api/admin/codes
 * Admin auth required (x-admin-token)
 */
app.get('/api/admin/codes', adminAuthMiddleware, (req, res) => {
  res.json({ codes: db.accessCodes });
});

/**
 * 11. DELETE /api/admin/codes/:code
 * Admin auth required (x-admin-token)
 */
app.delete('/api/admin/codes/:code', adminAuthMiddleware, (req, res) => {
  const targetCode = (req.params.code || '').trim().toUpperCase();
  const index = db.accessCodes.findIndex(c => c.code.toUpperCase() === targetCode);

  if (index === -1) {
    return res.status(404).json({ error: 'Không tìm thấy mã truy cập cần xóa.' });
  }

  const deleted = db.accessCodes.splice(index, 1)[0];
  saveDb();

  res.json({
    success: true,
    message: 'Đã xóa mã truy cập thành công.',
    code: deleted.code
  });
});

/**
 * 12. GET /api/admin/results
 * Admin auth required (x-admin-token)
 */
app.get('/api/admin/results', adminAuthMiddleware, (req, res) => {
  res.json({ results: db.results });
});

/**
 * 13. PATCH /api/admin/password
 * Admin auth required (x-admin-token)
 * Body: { newPassword: string }
 */
app.patch('/api/admin/password', adminAuthMiddleware, (req, res) => {
  const { newPassword } = req.body || {};

  if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 4) {
    return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 4 ký tự.' });
  }

  db.adminPassword = newPassword.trim();
  saveDb();

  res.json({
    success: true,
    message: 'Mật khẩu quản trị viên đã được cập nhật thành công.'
  });
});

// Admin shortcut route for convenience
app.get('/admin', (req, res) => {
  const adminPage = path.join(PUBLIC_DIR, 'admin.html');
  if (fs.existsSync(adminPage)) {
    return res.sendFile(adminPage);
  }
  res.redirect('/admin.html');
});

// Single Page Application Fallback (non-API routes)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint không tồn tại.' });
  }
  const indexPage = path.join(PUBLIC_DIR, 'index.html');
  if (fs.existsSync(indexPage)) {
    return res.sendFile(indexPage);
  }
  next();
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({
    error: 'Đã xảy ra lỗi máy chủ nội bộ.',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// -------------------------------------------------------------
// Start Server
// -------------------------------------------------------------
app.listen(PORT, () => {
  console.log('='.repeat(65));
  console.log(`🚀 English 12 Quiz Server is running on: http://localhost:${PORT}`);
  console.log(`📱 Main Application:   http://localhost:${PORT}/`);
  console.log(`🔑 Admin Dashboard:    http://localhost:${PORT}/admin.html`);
  console.log(`🔒 Admin Password:     ${db.adminPassword}`);
  console.log(`🎫 Access Codes Total: ${db.accessCodes.length} (${db.accessCodes.filter(c => !c.used).length} unused)`);
  console.log(`👥 Registered Users:   ${db.users.length}`);
  console.log(`📝 Quiz Submissions:   ${db.results.length}`);
  console.log('='.repeat(65));
});
