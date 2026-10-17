/**
 * English 12 Quiz App - Main Application Script
 * Single Page Application for English 12 (Global Success - Units 1-2-3)
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. APPLICATION STATE
  // ==========================================================================
  const state = {
    token: localStorage.getItem('quiz_token') || null,
    user: null,
    quizzes: [],
    completedQuizzes: JSON.parse(localStorage.getItem('quiz_completed_map') || '{}'),
    activeQuiz: null,
    currentQuestionIndex: 0,
    userAnswers: {}, // { [questionId]: selectedOptionIndex }
    timer: {
      intervalId: null,
      totalSeconds: 900, // 15 mins default
      remainingSeconds: 900,
      startedAt: null
    },
    submissionResult: null,
    reviewFilter: 'all', // 'all' | 'wrong' | 'correct'
    isSubmitting: false
  };

  try {
    const cachedUser = localStorage.getItem('quiz_user');
    if (cachedUser) {
      state.user = JSON.parse(cachedUser);
    }
  } catch (e) {
    state.user = null;
  }

  // ==========================================================================
  // 2. DOM ELEMENT REFERENCES
  // ==========================================================================
  const DOM = {
    // Views
    viewLogin: document.getElementById('view-login'),
    viewQuizzes: document.getElementById('view-quizzes'),
    viewQuizTaking: document.getElementById('view-quiz-taking'),
    viewResults: document.getElementById('view-results'),

    // Login Elements
    loginForm: document.getElementById('login-form'),
    studentNameInput: document.getElementById('student-name'),
    accessCodeInput: document.getElementById('access-code'),
    nameError: document.getElementById('name-error'),
    codeError: document.getElementById('code-error'),
    loginAlert: document.getElementById('login-alert'),
    loginAlertMsg: document.getElementById('login-alert-msg'),
    btnLogin: document.getElementById('btn-login'),
    btnLoginText: document.querySelector('#btn-login .btn-text'),
    btnLoginSpinner: document.querySelector('#btn-login .btn-spinner'),

    // Quizzes Nav & List
    navUserName: document.getElementById('nav-user-name'),
    btnLogout: document.getElementById('btn-logout'),
    welcomeMessage: document.getElementById('welcome-message'),
    statsCompletedCount: document.getElementById('stats-completed-count'),
    statsAvgScore: document.getElementById('stats-avg-score'),
    quizzesGrid: document.getElementById('quizzes-grid'),

    // Quiz Taking Elements
    btnQuitQuiz: document.getElementById('btn-quit-quiz'),
    takingQuizTitle: document.getElementById('taking-quiz-title'),
    takingQuizUnit: document.getElementById('taking-quiz-unit'),
    questionCounterBadge: document.getElementById('question-counter-badge'),
    timerBox: document.getElementById('timer-box'),
    timerDisplay: document.getElementById('timer-display'),
    timerProgressBar: document.getElementById('timer-progress-bar'),
    btnSubmitTop: document.getElementById('btn-submit-top'),
    questionCard: document.getElementById('question-card'),
    qTypeBadge: document.getElementById('q-type-badge'),
    qCurrentNum: document.getElementById('q-current-num'),
    qTotalNum: document.getElementById('q-total-num'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    btnPrevQ: document.getElementById('btn-prev-q'),
    btnNextQ: document.getElementById('btn-next-q'),
    btnFinishQuiz: document.getElementById('btn-finish-quiz'),
    questionDots: document.getElementById('question-dots'),

    // Results Elements
    resultIcon: document.getElementById('result-icon'),
    resultQuizTitle: document.getElementById('result-quiz-title'),
    scoreCircleFill: document.getElementById('score-circle-fill'),
    scoreNumber: document.getElementById('score-number'),
    scorePercentage: document.getElementById('score-percentage'),
    gradeBadge: document.getElementById('grade-badge'),
    gradeText: document.getElementById('grade-text'),
    resCorrectCount: document.getElementById('res-correct-count'),
    resTimeSpent: document.getElementById('res-time-spent'),
    resAccuracy: document.getElementById('res-accuracy'),
    btnBackQuizzes: document.getElementById('btn-back-quizzes'),
    btnRetryQuiz: document.getElementById('btn-retry-quiz'),
    reviewList: document.getElementById('review-list'),

    // Modals & Toasts
    confirmModal: document.getElementById('confirm-modal'),
    confirmModalTitle: document.getElementById('confirm-modal-title'),
    confirmModalDesc: document.getElementById('confirm-modal-desc'),
    btnModalCancel: document.getElementById('btn-modal-cancel'),
    btnModalConfirm: document.getElementById('btn-modal-confirm'),
    toastContainer: document.getElementById('toast-container'),

    // Canvases
    particlesCanvas: document.getElementById('particles-canvas'),
    confettiCanvas: document.getElementById('confetti-canvas')
  };

  // ==========================================================================
  // 3. SOUND SYNTHESIZER (Web Audio API)
  // ==========================================================================
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    return audioCtx;
  }

  function playSound(type) {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'select') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.14);
        osc.start(now);
        osc.stop(now + 0.14);
      } else if (type === 'complete') {
        // Joyful chime
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.frequency.setValueAtTime(freq, now + idx * 0.1);
          g.gain.setValueAtTime(0.18, now + idx * 0.1);
          g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);
          o.start(now + idx * 0.1);
          o.stop(now + idx * 0.1 + 0.35);
        });
      }
    } catch (e) {
      // Audio not permitted or failed, ignore silently
    }
  }

  // ==========================================================================
  // 4. FLOATING PARTICLES CANVAS ANIMATION
  // ==========================================================================
  function initParticlesBackground() {
    const canvas = DOM.particlesCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(width > 768 ? 45 : 22, 50);

    const colors = [
      'rgba(168, 85, 247, ',  // purple
      'rgba(56, 189, 248, ',  // cyan
      'rgba(236, 72, 153, ',  // pink
      'rgba(99, 102, 241, '   // indigo
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1.2,
        colorPrefix: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.45 + 0.15,
        speedX: (Math.random() - 0.5) * 0.45,
        speedY: (Math.random() - 0.5) * 0.45 - 0.2, // slight upward drift
        glow: Math.random() * 15 + 5
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around borders
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.colorPrefix + p.alpha + ')';
        ctx.shadowBlur = p.glow;
        ctx.shadowColor = p.colorPrefix + '0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  // ==========================================================================
  // 5. CONFETTI CELEBRATION ENGINE
  // ==========================================================================
  let confettiAnimId = null;
  function triggerConfetti(durationMs = 4000) {
    const canvas = DOM.confettiCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const confettiPieces = [];
    const count = 120;
    const colors = ['#f43f5e', '#ec4899', '#a855f7', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#fbbf24'];

    for (let i = 0; i < count; i++) {
      confettiPieces.push({
        x: Math.random() * width,
        y: -20 - Math.random() * 80,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        speedX: (Math.random() - 0.5) * 4,
        speedY: Math.random() * 3 + 2.5,
        wobble: Math.random() * 10,
        wobbleSpeed: Math.random() * 0.1 + 0.05,
        opacity: 1
      });
    }

    const startTime = Date.now();
    if (confettiAnimId) cancelAnimationFrame(confettiAnimId);

    function renderConfetti() {
      ctx.clearRect(0, 0, width, height);
      const elapsed = Date.now() - startTime;
      let stillActive = false;

      for (let i = 0; i < confettiPieces.length; i++) {
        const p = confettiPieces[i];
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.wobble) * 1.5;
        p.wobble += p.wobbleSpeed;
        p.rotation += p.rotationSpeed;

        if (elapsed > durationMs - 1000) {
          p.opacity = Math.max(0, 1 - (elapsed - (durationMs - 1000)) / 1000);
        }

        if (p.y < height + 40 && p.opacity > 0) {
          stillActive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          ctx.restore();
        }
      }

      if (stillActive && elapsed < durationMs + 1000) {
        confettiAnimId = requestAnimationFrame(renderConfetti);
      } else {
        ctx.clearRect(0, 0, width, height);
        confettiAnimId = null;
      }
    }

    renderConfetti();
  }

  // ==========================================================================
  // 6. TOAST NOTIFICATION SYSTEM
  // ==========================================================================
  function showToast(message, type = 'info', duration = 3500) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: '💡'
    };

    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || '💡'}</span>
      <span class="toast-msg">${escapeHtml(message)}</span>
    `;

    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, duration);
  }

  // Utility to escape HTML strings safely
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ==========================================================================
  // 7. VIEW MANAGEMENT & NAVIGATION
  // ==========================================================================
  function showView(viewId) {
    const views = [DOM.viewLogin, DOM.viewQuizzes, DOM.viewQuizTaking, DOM.viewResults];

    views.forEach((v) => {
      if (v.id === viewId) {
        v.classList.remove('hidden-view');
        v.classList.add('active-view');
      } else {
        v.classList.remove('active-view');
        v.classList.add('hidden-view');
      }
    });

    // Scroll to top on view change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ==========================================================================
  // 8. API CLIENT HELPER
  // ==========================================================================
  async function apiRequest(endpoint, options = {}) {
    const headers = Object.assign(
      {
        'Content-Type': 'application/json'
      },
      options.headers || {}
    );

    if (state.token) {
      headers['x-auth-token'] = state.token;
    }

    try {
      const res = await fetch(endpoint, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined
      });

      // Capture header auth token if updated by backend
      const resToken = res.headers.get('x-auth-token');
      if (resToken) {
        state.token = resToken;
        localStorage.setItem('quiz_token', resToken);
      }

      let data = null;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = { message: text };
        }
      }

      return {
        ok: res.ok,
        status: res.status,
        headers: res.headers,
        data
      };
    } catch (err) {
      console.warn('API fetch error for:', endpoint, err);
      return {
        ok: false,
        status: 0,
        headers: null,
        data: null,
        error: err
      };
    }
  }

  // ==========================================================================
  // 9. FALLBACK MOCK DATA (High quality English 12 Units 1-2-3)
  // Ensures full functionality if backend is launching or for offline demo
  // ==========================================================================
  const MOCK_QUIZZES = [
    {
      id: 'quiz-unit-1',
      title: 'Đề 01: Unit 1 - Life Stories We Admire',
      unit: 'Unit 1: Life Stories',
      description: 'Kiểm tra 15 phút về tiểu sử danh nhân, ngữ pháp thì Quá khứ đơn vs Quá khứ tiếp diễn, và trọng âm từ 2-3 âm tiết.',
      difficulty: 'Dễ',
      questionCount: 10,
      timeLimit: 900 // 15 mins
    },
    {
      id: 'quiz-unit-2',
      title: 'Đề 02: Unit 2 - A Multicultural World',
      unit: 'Unit 2: Multicultural',
      description: 'Đề kiểm tra trọng tâm về bản sắc văn hóa, đa văn hóa toàn cầu, mạo từ a/an/the và tìm lỗi sai câu.',
      difficulty: 'Vừa',
      questionCount: 10,
      timeLimit: 900
    },
    {
      id: 'quiz-unit-3',
      title: 'Đề 03: Unit 3 - Green Living & Sustainability',
      unit: 'Unit 3: Green Living',
      description: 'Chủ đề sống xanh, bảo vệ môi trường, mệnh đề quan hệ và từ đồng nghĩa/trái nghĩa phổ biến trong SGK.',
      difficulty: 'Vừa',
      questionCount: 10,
      timeLimit: 900
    },
    {
      id: 'quiz-unit-review',
      title: 'Đề 04: Ôn Tập Tổng Hợp Units 1-2-3',
      unit: 'Review 1 (Units 1-3)',
      description: 'Tổng hợp 10 câu hỏi chuẩn cấu trúc trắc nghiệm THPT: Trọng âm, Tìm lỗi sai, Đồng/Trái nghĩa và Ngữ pháp tổng hợp.',
      difficulty: 'Vừa',
      questionCount: 10,
      timeLimit: 900
    }
  ];

  const MOCK_QUESTIONS = {
    'quiz-unit-1': [
      {
        id: 1,
        type: 'stress',
        question: 'Mark the letter A, B, C, or D to indicate the word that differs from the other three in the position of primary stress.',
        options: ['A. admire', 'B. inspire', 'C. achieve', 'D. practice'],
        correctAnswer: 3,
        explanation: "'practice' có trọng âm rơi vào âm tiết thứ 1 (/ˈpræktɪs/), các từ còn lại có trọng âm rơi vào âm tiết thứ 2 (adˈmire, inˈspire, aˈchieve)."
      },
      {
        id: 2,
        type: 'stress',
        question: 'Mark the letter A, B, C, or D to indicate the word that differs from the other three in the position of primary stress.',
        options: ['A. biography', 'B. dedication', 'C. generosity', 'D. creativity'],
        correctAnswer: 0,
        explanation: "'biography' có trọng âm rơi vào âm tiết thứ 2 (/baɪˈɒɡrəfi/), các từ còn lại trọng âm rơi vào âm tiết thứ 3 hoặc 4 trước đuôi -tion/-ty."
      },
      {
        id: 3,
        type: 'grammar',
        question: 'While Thomas Edison _______ on the incandescent light bulb, he carried out thousands of experiments.',
        options: ['A. works', 'B. was working', 'C. worked', 'D. is working'],
        correctAnswer: 1,
        explanation: "Hành động đang diễn ra trong quá khứ đi với liên từ 'While' chia thì Quá khứ tiếp diễn (was working)."
      },
      {
        id: 4,
        type: 'grammar',
        question: 'Nguyen Hue was a brilliant military leader _______ led the Tay Son army to stunning victories.',
        options: ['A. who', 'B. which', 'C. whom', 'D. whose'],
        correctAnswer: 0,
        explanation: "Đại từ quan hệ 'who' làm chủ ngữ thay thế cho danh từ chỉ người 'military leader'."
      },
      {
        id: 5,
        type: 'synonym',
        question: 'Steve Jobs was considered an <u>influential</u> figure who revolutionized modern digital technology.',
        options: ['A. insignificant', 'B. powerful', 'C. helpless', 'D. ordinary'],
        correctAnswer: 1,
        explanation: "'influential' có nghĩa là có sức ảnh hưởng lớn, đồng nghĩa với 'powerful' (có tầm ảnh hưởng/quyền năng)."
      },
      {
        id: 6,
        type: 'synonym',
        question: 'His remarkable achievements were made possible thanks to his relentless <u>perseverance</u>.',
        options: ['A. laziness', 'B. determination', 'C. weakness', 'D. cowardice'],
        correctAnswer: 1,
        explanation: "'perseverance' mang nghĩa sự kiên trì, bền bỉ, đồng nghĩa với 'determination' (sự quyết tâm)."
      },
      {
        id: 7,
        type: 'error',
        question: 'Find the underlined part that needs correction: When Isaac Newton <u>was sitting</u> (A) under an apple tree, an apple <u>falls</u> (B) on his head and <u>made</u> (C) him think about <u>gravity</u> (D).',
        options: ['A. was sitting', 'B. falls', 'C. made', 'D. gravity'],
        correctAnswer: 1,
        explanation: "Cần sửa 'falls' thành 'fell' vì chuỗi sự việc đã xảy ra và kết thúc trong quá khứ (past simple)."
      },
      {
        id: 8,
        type: 'error',
        question: 'Find the underlined part that needs correction: The young athlete <u>devoted</u> (A) all his life <u>to help</u> (B) disabled children <u>achieve</u> (C) their dreams in <u>sports</u> (D).',
        options: ['A. devoted', 'B. to help', 'C. achieve', 'D. sports'],
        correctAnswer: 1,
        explanation: "Cấu trúc 'devote something to + V-ing'. Do đó cần sửa 'to help' thành 'to helping'."
      },
      {
        id: 9,
        type: 'grammar',
        question: 'Marie Curie made great _______ to the field of physics and chemistry with her discovery of radium and polonium.',
        options: ['A. contributions', 'B. contributors', 'C. contribute', 'D. contributive'],
        correctAnswer: 0,
        explanation: "Cụm cố định: 'make contributions to' (có những đóng góp to lớn cho cái gì)."
      },
      {
        id: 10,
        type: 'grammar',
        question: 'When the teacher entered the classroom yesterday, the students _______ passionately about Uncle Ho’s life.',
        options: ['A. discussed', 'B. were discussing', 'C. have discussed', 'D. discuss'],
        correctAnswer: 1,
        explanation: "Hành động đang diễn ra (were discussing) thì có một hành động khác xen vào (entered)."
      }
    ],

    'quiz-unit-2': [
      {
        id: 1,
        type: 'stress',
        question: 'Mark the letter A, B, C, or D to indicate the word that differs in the position of primary stress.',
        options: ['A. culture', 'B. custom', 'C. diverse', 'D. festive'],
        correctAnswer: 2,
        explanation: "'diverse' có trọng âm rơi vào âm tiết thứ 2 (/daɪˈvɜːs/), các từ còn lại rơi vào âm tiết thứ 1."
      },
      {
        id: 2,
        type: 'stress',
        question: 'Mark the letter A, B, C, or D to indicate the word that differs in the position of primary stress.',
        options: ['A. multicultural', 'B. assimilation', 'C. characteristic', 'D. traditional'],
        correctAnswer: 3,
        explanation: "'traditional' có trọng âm rơi vào âm tiết thứ 2 (/trəˈdɪʃənl/), các từ còn lại có trọng âm chính rơi vào âm tiết 4 hoặc 5."
      },
      {
        id: 3,
        type: 'grammar',
        question: 'Vietnam is _______ country rich in ethnic diversity, with 54 distinct groups living harmoniously.',
        options: ['A. a', 'B. an', 'C. the', 'D. Ø (no article)'],
        correctAnswer: 0,
        explanation: "'country' là danh từ đếm được số ít, nhắc đến lần đầu tiên với ý nghĩa 'một quốc gia', bắt đầu bằng phụ âm nên dùng mạo từ 'a'."
      },
      {
        id: 4,
        type: 'grammar',
        question: 'Many immigrants struggle to maintain their cultural _______ when adapting to a new society.',
        options: ['A. identify', 'B. identity', 'C. identically', 'D. identification'],
        correctAnswer: 1,
        explanation: "Cụm danh từ 'cultural identity' (bản sắc văn hóa) là cụm từ trọng tâm của Unit 2."
      },
      {
        id: 5,
        type: 'synonym',
        question: 'Food festivals are great opportunities for people to <u>experience</u> culinary customs from around the globe.',
        options: ['A. taste and learn', 'B. avoid', 'C. ignore', 'D. destroy'],
        correctAnswer: 0,
        explanation: "'experience' mang nghĩa trải nghiệm, thưởng thức, đồng nghĩa với 'taste and learn'."
      },
      {
        id: 6,
        type: 'synonym',
        question: 'It is important to <u>preserve</u> tangible and intangible cultural heritages for future generations.',
        options: ['A. damage', 'B. protect', 'C. abandon', 'D. pollute'],
        correctAnswer: 1,
        explanation: "'preserve' nghĩa là bảo tồn, gìn giữ, đồng nghĩa với 'protect' (bảo vệ)."
      },
      {
        id: 7,
        type: 'error',
        question: 'Find the underlined part that needs correction: <u>The</u> (A) United States is known <u>for</u> (B) its multicultural society, where people <u>from</u> (C) different backgrounds share <u>an</u> (D) same rights.',
        options: ['A. The', 'B. for', 'C. from', 'D. an'],
        correctAnswer: 3,
        explanation: "Với từ 'same', ta luôn dùng mạo từ xác định 'the same' (the same rights), không dùng 'an same'."
      },
      {
        id: 8,
        type: 'error',
        question: 'Find the underlined part that needs correction: Participating <u>in</u> (A) traditional festivals <u>help</u> (B) teenagers gain a deeper <u>appreciation</u> (C) of their ancestral <u>roots</u> (D).',
        options: ['A. in', 'B. help', 'C. appreciation', 'D. roots'],
        correctAnswer: 1,
        explanation: "Chủ ngữ là danh động từ 'Participating in traditional festivals' là số ít, động từ cần chia 'helps'."
      },
      {
        id: 9,
        type: 'grammar',
        question: 'Cultural diversity fosters creativity and enhances mutual _______ among people from different countries.',
        options: ['A. understand', 'B. understanding', 'C. understandable', 'D. understandably'],
        correctAnswer: 1,
        explanation: "Sau tính từ 'mutual' cần một danh từ: 'mutual understanding' (sự thấu hiểu lẫn nhau)."
      },
      {
        id: 10,
        type: 'grammar',
        question: 'London is considered one of _______ most multicultural cities in the world.',
        options: ['A. a', 'B. an', 'C. the', 'D. Ø'],
        correctAnswer: 2,
        explanation: "So sánh nhất 'most multicultural cities' yêu cầu mạo từ 'the'."
      }
    ],

    'quiz-unit-3': [
      {
        id: 1,
        type: 'stress',
        question: 'Mark the letter A, B, C, or D to indicate the word that differs in the position of primary stress.',
        options: ['A. eco-friendly', 'B. renewable', 'C. energy', 'D. biodegradable'],
        correctAnswer: 2,
        explanation: "'energy' có trọng âm rơi vào âm tiết thứ 1 (/ˈenədʒi/), trong khi renewable rơi vào âm 2, biodegradable rơi vào âm 4."
      },
      {
        id: 2,
        type: 'stress',
        question: 'Mark the letter A, B, C, or D to indicate the word that differs in the position of primary stress.',
        options: ['A. compost', 'B. pollute', 'C. conserve', 'D. emit'],
        correctAnswer: 0,
        explanation: "'compost' có trọng âm rơi vào âm tiết thứ 1 (/ˈkɒmpɒst/), các từ còn lại có trọng âm rơi vào âm tiết thứ 2."
      },
      {
        id: 3,
        type: 'grammar',
        question: 'Solar and wind energy are _______ sources of power that do not deplete natural resources.',
        options: ['A. renewable', 'B. non-renewable', 'C. fossil', 'D. harmful'],
        correctAnswer: 0,
        explanation: "'renewable energy' là năng lượng tái tạo (như năng lượng mặt trời và gió)."
      },
      {
        id: 4,
        type: 'grammar',
        question: 'The carbon footprint of an individual can be significantly reduced _______ public transport is used regularly.',
        options: ['A. if', 'B. unless', 'C. although', 'D. despite'],
        correctAnswer: 0,
        explanation: "Mệnh đề điều kiện loại 1 thể hiện nguyên nhân kết quả: 'if' (nếu)."
      },
      {
        id: 5,
        type: 'synonym',
        question: 'We should strive to <u>eliminate</u> single-use plastic bags from our daily shopping habits.',
        options: ['A. get rid of', 'B. produce', 'C. encourage', 'D. maintain'],
        correctAnswer: 0,
        explanation: "'eliminate' nghĩa là loại bỏ, trừ khử, đồng nghĩa với 'get rid of'."
      },
      {
        id: 6,
        type: 'synonym',
        question: 'The newly built apartment complex was certified as <u>sustainable</u> and energy-efficient.',
        options: ['A. destructive', 'B. eco-friendly', 'C. excessive', 'D. fragile'],
        correctAnswer: 1,
        explanation: "'sustainable' (bền vững, thân thiện với môi trường) đồng nghĩa với 'eco-friendly'."
      },
      {
        id: 7,
        type: 'error',
        question: 'Find the underlined part that needs correction: Organic food <u>which</u> (A) is grown without chemicals <u>are</u> (B) becoming more <u>popular</u> (C) among health-conscious <u>consumers</u> (D).',
        options: ['A. which', 'B. are', 'C. popular', 'D. consumers'],
        correctAnswer: 1,
        explanation: "Chủ ngữ là 'Organic food' (danh từ không đếm được) nên động từ to be phải là 'is', không dùng 'are'."
      },
      {
        id: 8,
        type: 'error',
        question: 'Find the underlined part that needs correction: If more people <u>commute</u> (A) by bicycle, the level of <u>air pollution</u> (B) in big cities <u>decreased</u> (C) <u>rapidly</u> (D).',
        options: ['A. commute', 'B. air pollution', 'C. decreased', 'D. rapidly'],
        correctAnswer: 2,
        explanation: "Câu điều kiện loại 1: Mệnh đề chính dùng 'will decrease' thay vì 'decreased'."
      },
      {
        id: 9,
        type: 'grammar',
        question: 'Recycling plastic bottles and paper helps cut _______ on household waste sent to landfills.',
        options: ['A. down', 'B. out', 'C. up', 'D. off'],
        correctAnswer: 0,
        explanation: "Cụm động từ cố định 'cut down on' có nghĩa là cắt giảm (tiêu thụ, rác thải)."
      },
      {
        id: 10,
        type: 'grammar',
        question: 'Trees absorb carbon dioxide and release oxygen, _______ is vital for human respiration.',
        options: ['A. which', 'B. that', 'C. what', 'D. whom'],
        correctAnswer: 0,
        explanation: "Mệnh đề quan hệ không xác định đứng sau dấu phẩy bổ nghĩa cho cả mệnh đề phía trước dùng 'which'."
      }
    ],

    'quiz-unit-review': [
      {
        id: 1,
        type: 'stress',
        question: 'Mark the letter A, B, C, or D to indicate the word that differs in the position of primary stress.',
        options: ['A. preserve', 'B. impact', 'C. admire', 'D. inspired'],
        correctAnswer: 1,
        explanation: "Danh từ 'impact' có trọng âm ở âm tiết thứ 1 (/ˈɪmpækt/), các từ còn lại trọng âm ở âm tiết thứ 2."
      },
      {
        id: 2,
        type: 'stress',
        question: 'Mark the letter A, B, C, or D to indicate the word that differs in the position of primary stress.',
        options: ['A. volunteer', 'B. understand', 'C. recommend', 'D. contribute'],
        correctAnswer: 3,
        explanation: "'contribute' có trọng âm rơi vào âm tiết thứ 2 (/kənˈtrɪbjuːt/), các từ còn lại có trọng âm rơi vào âm tiết thứ 3."
      },
      {
        id: 3,
        type: 'grammar',
        question: 'While the students _______ trees in the school garden, it began to rain heavily.',
        options: ['A. were planting', 'B. planted', 'C. have planted', 'D. are planting'],
        correctAnswer: 0,
        explanation: "Hành động kéo dài trong quá khứ đi với While dùng Quá khứ tiếp diễn (were planting)."
      },
      {
        id: 4,
        type: 'grammar',
        question: 'General Vo Nguyen Giap was a national hero _______ dedication to Vietnam’s independence inspired millions.',
        options: ['A. whose', 'B. who', 'C. whom', 'D. which'],
        correctAnswer: 0,
        explanation: "Đại từ sở hữu 'whose' đứng trước danh từ 'dedication' để chỉ sự cống hiến của vị đại tướng."
      },
      {
        id: 5,
        type: 'synonym',
        question: 'Vietnamese traditional costumes <u>reflect</u> the distinct identity and soul of the nation.',
        options: ['A. show clearly', 'B. hide away', 'C. discard', 'D. misunderstand'],
        correctAnswer: 0,
        explanation: "'reflect' mang nghĩa phản ánh rõ nét, tương đương với 'show clearly'."
      },
      {
        id: 6,
        type: 'synonym',
        question: 'Using refillable water bottles is an <u>effortless</u> way to minimize plastic waste.',
        options: ['A. easy', 'B. painful', 'C. expensive', 'D. complicated'],
        correctAnswer: 0,
        explanation: "'effortless' có nghĩa là dễ dàng, không tốn nhiều sức, đồng nghĩa với 'easy'."
      },
      {
        id: 7,
        type: 'error',
        question: 'Find the underlined part that needs correction: The museum exhibits <u>artifacts</u> (A) from diverse ethnic groups, <u>which</u> (B) displays a vivid picture of <u>cultural</u> (C) <u>richness</u> (D).',
        options: ['A. artifacts', 'B. which', 'C. cultural', 'D. richness'],
        correctAnswer: 1,
        explanation: "'artifacts' là danh từ số nhiều, đại từ 'which' thay thế cho nó thì động từ phải là 'display' (bỏ -s)."
      },
      {
        id: 8,
        type: 'error',
        question: 'Find the underlined part that needs correction: When my grandmother was young, she <u>used to walked</u> (A) five miles <u>to school</u> (B) every single day, <u>regardless of</u> (C) the weather <u>conditions</u> (D).',
        options: ['A. used to walked', 'B. to school', 'C. regardless of', 'D. conditions'],
        correctAnswer: 0,
        explanation: "Cấu trúc chỉ thói quen trong quá khứ là 'used to + V(bare)'. Cần sửa 'used to walked' thành 'used to walk'."
      },
      {
        id: 9,
        type: 'grammar',
        question: 'Living a green lifestyle not only protects the environment but _______ saves money on energy bills.',
        options: ['A. also', 'B. too', 'C. either', 'D. as well as'],
        correctAnswer: 0,
        explanation: "Cấu trúc tương quan 'not only ... but also ...' (không những mà còn)."
      },
      {
        id: 10,
        type: 'grammar',
        question: 'Tet is _______ most significant traditional festival of Vietnamese people around the globe.',
        options: ['A. the', 'B. a', 'C. an', 'D. Ø'],
        correctAnswer: 0,
        explanation: "Cụm so sánh nhất 'the most significant' luôn có mạo từ 'the'."
      }
    ]
  };

  // ==========================================================================
  // 10. LOGIN LOGIC
  // ==========================================================================
  function initLogin() {
    DOM.loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      playSound('click');

      const name = DOM.studentNameInput.value.trim();
      const code = DOM.accessCodeInput.value.trim().toUpperCase();

      // Clear errors
      DOM.nameError.textContent = '';
      DOM.codeError.textContent = '';
      DOM.loginAlert.classList.add('hidden');

      let hasError = false;
      if (!name) {
        DOM.nameError.textContent = 'Vui lòng nhập họ và tên học sinh.';
        hasError = true;
      } else if (name.length < 2) {
        DOM.nameError.textContent = 'Họ và tên cần ít nhất 2 ký tự.';
        hasError = true;
      }

      if (!code) {
        DOM.codeError.textContent = 'Vui lòng nhập mã truy cập bài thi.';
        hasError = true;
      }

      if (hasError) return;

      // Set loading state
      setLoginLoading(true);

      const res = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: { name, code }
      });

      setLoginLoading(false);

      if (res.ok) {
        const token =
          (res.headers && res.headers.get('x-auth-token')) ||
          (res.data && (res.data.token || res.data.authToken)) ||
          'token_' + Math.random().toString(36).substring(2);

        const userData = (res.data && res.data.user) || { name, code };

        state.token = token;
        state.user = userData;
        localStorage.setItem('quiz_token', token);
        localStorage.setItem('quiz_user', JSON.stringify(userData));

        showToast(`Xin chào ${name}! Đăng nhập thành công.`, 'success');
        onLoginSuccess();
      } else {
        // Fallback for standalone demo: if code is provided, allow student entry with mock session
        if (res.status === 404 || res.status === 0) {
          const mockToken = 'mock_token_' + Date.now();
          const mockUser = { name, code };
          state.token = mockToken;
          state.user = mockUser;
          localStorage.setItem('quiz_token', mockToken);
          localStorage.setItem('quiz_user', JSON.stringify(mockUser));
          showToast(`Đăng nhập thành công với mã: ${code}`, 'success');
          onLoginSuccess();
        } else {
          const errorMsg =
            (res.data && (res.data.message || res.data.error)) ||
            'Mã truy cập không hợp lệ hoặc đã hết lượt sử dụng.';
          DOM.loginAlertMsg.textContent = errorMsg;
          DOM.loginAlert.classList.remove('hidden');
        }
      }
    });
  }

  function setLoginLoading(isLoading) {
    if (isLoading) {
      DOM.btnLogin.disabled = true;
      DOM.btnLoginSpinner.classList.remove('hidden');
      DOM.btnLoginText.textContent = 'Đang kiểm tra...';
    } else {
      DOM.btnLogin.disabled = false;
      DOM.btnLoginSpinner.classList.add('hidden');
      DOM.btnLoginText.textContent = 'Vào Làm Bài Thi';
    }
  }

  function onLoginSuccess() {
    DOM.navUserName.textContent = state.user.name || 'Học sinh';
    DOM.welcomeMessage.textContent = `Chào mừng ${state.user.name}! Sẵn sàng thử sức với các bài kiểm tra 15 phút?`;
    showView('view-quizzes');
    loadQuizzes();
  }

  // ==========================================================================
  // 11. QUIZZES LIST & DASHBOARD
  // ==========================================================================
  async function loadQuizzes() {
    DOM.quizzesGrid.innerHTML = `
      <div class="grid-loading">
        <div class="loader-spinner"></div>
        <p style="margin-top: 14px;">Đang tải danh sách đề thi...</p>
      </div>
    `;

    const res = await apiRequest('/api/quizzes');
    let quizzes = [];

    if (res.ok && Array.isArray(res.data)) {
      quizzes = res.data;
    } else {
      quizzes = MOCK_QUIZZES;
    }

    state.quizzes = quizzes;
    renderQuizzesGrid(quizzes);
    updateDashboardStats();
  }

  function updateDashboardStats() {
    const total = state.quizzes.length || 4;
    const completedMap = state.completedQuizzes;
    const completedKeys = Object.keys(completedMap);
    const completedCount = completedKeys.length;

    DOM.statsCompletedCount.textContent = `${completedCount}/${total}`;

    if (completedCount > 0) {
      let sum = 0;
      completedKeys.forEach((key) => {
        sum += completedMap[key].score || 0;
      });
      const avg = (sum / completedCount).toFixed(1);
      DOM.statsAvgScore.textContent = `${avg}/10`;
    } else {
      DOM.statsAvgScore.textContent = '--';
    }
  }

  function renderQuizzesGrid(quizzes) {
    DOM.quizzesGrid.innerHTML = '';

    if (!quizzes || quizzes.length === 0) {
      DOM.quizzesGrid.innerHTML = `<div class="grid-loading"><p>Chưa có đề thi nào được tạo.</p></div>`;
      return;
    }

    quizzes.forEach((quiz) => {
      const card = document.createElement('div');
      card.className = 'quiz-card glass-card';

      const isCompleted = !!state.completedQuizzes[quiz.id];
      const completedData = state.completedQuizzes[quiz.id] || {};

      const diffClass =
        quiz.difficulty === 'Dễ' || quiz.difficulty === 'easy'
          ? 'diff-easy'
          : quiz.difficulty === 'Vừa' || quiz.difficulty === 'medium'
          ? 'diff-medium'
          : 'diff-hard';

      const diffLabel = quiz.difficulty || 'Vừa';
      const qCount = quiz.questionCount || 10;
      const timeMin = Math.round((quiz.timeLimit || 900) / 60);

      card.innerHTML = `
        <div>
          <div class="card-top">
            <div class="quiz-card-badge-wrap">
              <span class="diff-badge ${diffClass}">${escapeHtml(diffLabel)}</span>
              <span class="unit-tag">${escapeHtml(quiz.unit || 'English 12')}</span>
            </div>
            <span style="font-size: 1.5rem;">📖</span>
          </div>

          <h4 class="quiz-card-title">${escapeHtml(quiz.title)}</h4>
          <p class="quiz-card-desc">${escapeHtml(quiz.description || 'Bài kiểm tra 15 phút ôn tập kiến thức trọng tâm.')}</p>
        </div>

        <div>
          ${
            isCompleted
              ? `
            <div class="completed-ribbon">
              <span class="completed-badge-text">
                <span>✓</span> Đã hoàn thành
              </span>
              <span class="completed-score-text">${completedData.score || 0}/10 điểm</span>
            </div>
          `
              : ''
          }

          <div class="quiz-card-meta">
            <div class="meta-item">
              <span>❓</span>
              <span>${qCount} câu hỏi</span>
            </div>
            <div class="meta-item">
              <span>⏱️</span>
              <span>${timeMin} phút</span>
            </div>
            <div class="meta-item">
              <span>🎯</span>
              <span>100% trắc nghiệm</span>
            </div>
          </div>

          <button class="btn ${isCompleted ? 'btn-glass' : 'btn-primary btn-glow'} btn-block btn-start-quiz" data-quiz-id="${quiz.id}">
            <span>${isCompleted ? '🔄 Làm Lại Đề Này' : '🚀 Bắt Đầu Làm Bài'}</span>
          </button>
        </div>
      `;

      // Event listener to start quiz
      card.querySelector('.btn-start-quiz').addEventListener('click', (e) => {
        e.stopPropagation();
        playSound('click');
        startQuiz(quiz.id);
      });

      card.addEventListener('click', () => {
        playSound('click');
        startQuiz(quiz.id);
      });

      DOM.quizzesGrid.appendChild(card);
    });
  }

  // ==========================================================================
  // 12. QUIZ TAKING & TIMER LOGIC
  // ==========================================================================
  async function startQuiz(quizId) {
    // Show loading
    showToast('Đang tải đề thi...', 'info', 1500);

    const res = await apiRequest(`/api/quiz/${quizId}`);
    let quizData = null;

    if (res.ok && res.data) {
      quizData = res.data;
    } else {
      // Find from mock data
      const meta = MOCK_QUIZZES.find((q) => q.id === quizId) || MOCK_QUIZZES[0];
      const questions = MOCK_QUESTIONS[quizId] || MOCK_QUESTIONS['quiz-unit-review'];
      quizData = {
        id: meta.id,
        title: meta.title,
        unit: meta.unit,
        timeLimit: meta.timeLimit || 900,
        questions: questions
      };
    }

    state.activeQuiz = quizData;
    state.currentQuestionIndex = 0;
    state.userAnswers = {};
    state.isSubmitting = false;

    // Reset and initialize timer
    const totalSec = quizData.timeLimit > 60 ? quizData.timeLimit : (quizData.timeLimit || 15) * 60;
    state.timer.totalSeconds = totalSec;
    state.timer.remainingSeconds = totalSec;
    state.timer.startedAt = Date.now();

    // UI Updates
    DOM.takingQuizTitle.textContent = quizData.title;
    DOM.takingQuizUnit.textContent = quizData.unit || 'English 12';
    DOM.qTotalNum.textContent = `/ ${quizData.questions.length}`;

    renderQuestionDots();
    renderCurrentQuestion();
    startTimer();
    showView('view-quiz-taking');
  }

  function startTimer() {
    clearInterval(state.timer.intervalId);
    updateTimerDisplay();

    state.timer.intervalId = setInterval(() => {
      state.timer.remainingSeconds--;

      if (state.timer.remainingSeconds <= 0) {
        clearInterval(state.timer.intervalId);
        state.timer.remainingSeconds = 0;
        updateTimerDisplay();
        showToast('Hết giờ làm bài! Hệ thống đang tự động nộp bài thi của bạn.', 'warning', 3000);
        submitQuiz(true); // force auto-submit
      } else {
        updateTimerDisplay();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const sec = state.timer.remainingSeconds;
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    DOM.timerDisplay.textContent = formatted;

    // Calculate percentage remaining for the progress bar
    const pct = Math.max(0, Math.min(100, (sec / state.timer.totalSeconds) * 100));
    DOM.timerProgressBar.style.width = `${pct}%`;

    // Warning / Danger classes
    if (sec <= 60) {
      DOM.timerBox.className = 'timer-container glass-card-sm timer-danger';
      DOM.timerProgressBar.className = 'timer-progress-fill danger';
    } else if (sec <= 180) {
      DOM.timerBox.className = 'timer-container glass-card-sm timer-warning';
      DOM.timerProgressBar.className = 'timer-progress-fill warning';
    } else {
      DOM.timerBox.className = 'timer-container glass-card-sm';
      DOM.timerProgressBar.className = 'timer-progress-fill';
    }
  }

  function stopTimer() {
    clearInterval(state.timer.intervalId);
  }

  function renderQuestionDots() {
    const questions = state.activeQuiz.questions;
    DOM.questionDots.innerHTML = '';

    questions.forEach((q, idx) => {
      const dot = document.createElement('div');
      dot.className = 'q-dot unanswered';
      dot.textContent = idx + 1;
      dot.dataset.index = idx;

      dot.addEventListener('click', () => {
        playSound('click');
        goToQuestion(idx);
      });

      DOM.questionDots.appendChild(dot);
    });

    updateQuestionDotsStatus();
  }

  function updateQuestionDotsStatus() {
    const dots = DOM.questionDots.querySelectorAll('.q-dot');
    const questions = state.activeQuiz.questions;

    dots.forEach((dot, idx) => {
      const q = questions[idx];
      const hasAnswer = state.userAnswers[q.id] !== undefined;

      dot.className = 'q-dot';

      if (idx === state.currentQuestionIndex) {
        dot.classList.add('current');
      } else if (hasAnswer) {
        dot.classList.add('answered');
      } else {
        dot.classList.add('unanswered');
      }
    });
  }

  function renderCurrentQuestion() {
    const questions = state.activeQuiz.questions;
    const idx = state.currentQuestionIndex;
    const q = questions[idx];

    // Animation trigger
    DOM.questionCard.style.animation = 'none';
    void DOM.questionCard.offsetHeight; // trigger reflow
    DOM.questionCard.style.animation = 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

    // Update Counter
    DOM.qCurrentNum.textContent = `Câu ${idx + 1}`;
    DOM.questionCounterBadge.textContent = `Câu ${idx + 1}/${questions.length}`;

    // Update Question Type Badge
    const typeMap = {
      stress: { label: '🔊 Trọng âm', class: 'badge-stress' },
      error: { label: '❌ Tìm lỗi sai', class: 'badge-error' },
      synonym: { label: '🔄 Đồng/Trái nghĩa', class: 'badge-synonym' },
      grammar: { label: '📝 Ngữ pháp', class: 'badge-grammar' }
    };

    const typeInfo = typeMap[q.type] || { label: '📝 Câu hỏi', class: 'badge-grammar' };
    DOM.qTypeBadge.className = `q-badge ${typeInfo.class}`;
    DOM.qTypeBadge.textContent = typeInfo.label;

    // Render Question Text (safe HTML parsing for <u> and <b>)
    DOM.questionText.innerHTML = q.question;

    // Render Options
    DOM.optionsContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    q.options.forEach((optText, optIdx) => {
      const optionCard = document.createElement('div');
      const isSelected = state.userAnswers[q.id] === optIdx;

      optionCard.className = `option-card ${isSelected ? 'selected' : ''}`;

      // Clean prefix if it already has "A. "
      let cleanText = optText;
      if (/^[A-D]\.\s*/i.test(cleanText)) {
        cleanText = cleanText.replace(/^[A-D]\.\s*/i, '');
      }

      optionCard.innerHTML = `
        <span class="option-letter">${letters[optIdx]}</span>
        <span class="option-text">${escapeHtml(cleanText)}</span>
      `;

      optionCard.addEventListener('click', () => {
        playSound('select');
        selectAnswer(q.id, optIdx);
      });

      DOM.optionsContainer.appendChild(optionCard);
    });

    // Navigation buttons state
    DOM.btnPrevQ.disabled = idx === 0;

    const isLast = idx === questions.length - 1;
    if (isLast) {
      DOM.btnNextQ.classList.add('hidden');
      DOM.btnFinishQuiz.classList.remove('hidden');
    } else {
      DOM.btnNextQ.classList.remove('hidden');
      DOM.btnFinishQuiz.classList.add('hidden');
    }

    updateQuestionDotsStatus();
  }

  function selectAnswer(questionId, optionIndex) {
    state.userAnswers[questionId] = optionIndex;
    renderCurrentQuestion();

    // Check if all questions are answered; if so, highlight submit button
    const totalQ = state.activeQuiz.questions.length;
    const answeredCount = Object.keys(state.userAnswers).length;
    if (answeredCount === totalQ) {
      DOM.btnSubmitTop.style.animation = 'pulse 1.5s infinite';
    }
  }

  function goToQuestion(idx) {
    if (idx < 0 || idx >= state.activeQuiz.questions.length) return;
    state.currentQuestionIndex = idx;
    renderCurrentQuestion();
  }

  // ==========================================================================
  // 13. QUIZ SUBMISSION & CONFIRM DIALOG
  // ==========================================================================
  function confirmAndSubmitQuiz() {
    const totalQ = state.activeQuiz.questions.length;
    const answeredCount = Object.keys(state.userAnswers).length;
    const remaining = totalQ - answeredCount;

    if (remaining > 0) {
      showConfirmModal(
        '⚠️ Còn Câu Chưa Trả Lời',
        `Bạn vẫn còn ${remaining} câu hỏi chưa hoàn thành. Bạn có chắc chắn muốn nộp bài thi ngay bây giờ?`,
        () => submitQuiz(false)
      );
    } else {
      showConfirmModal(
        '📤 Xác Nhận Nộp Bài',
        'Bạn đã hoàn thành tất cả các câu hỏi! Bạn có chắc chắn muốn nộp bài để xem điểm số và lời giải chi tiết?',
        () => submitQuiz(false)
      );
    }
  }

  async function submitQuiz(autoSubmitted = false) {
    if (state.isSubmitting) return;
    state.isSubmitting = true;
    stopTimer();

    const quizId = state.activeQuiz.id;
    const timeSpent = state.timer.totalSeconds - state.timer.remainingSeconds;

    showToast('Đang chấm điểm bài thi...', 'info', 2000);

    const payload = {
      answers: state.userAnswers,
      timeSpent: timeSpent
    };

    const res = await apiRequest(`/api/quiz/${quizId}/submit`, {
      method: 'POST',
      body: payload
    });

    let resultData = null;

    if (res.ok && res.data) {
      resultData = res.data;
    } else {
      // Client-side evaluation fallback
      resultData = calculateClientResults(state.activeQuiz, state.userAnswers, timeSpent);
    }

    // Save completed status
    state.completedQuizzes[quizId] = {
      score: resultData.score,
      percentage: resultData.percentage,
      timeSpent: timeSpent,
      completedAt: new Date().toISOString()
    };
    localStorage.setItem('quiz_completed_map', JSON.stringify(state.completedQuizzes));

    state.submissionResult = resultData;
    state.isSubmitting = false;

    playSound('complete');
    showResultsView(resultData);
  }

  function calculateClientResults(quiz, userAnswers, timeSpent) {
    let correctCount = 0;
    const questions = quiz.questions;
    const review = [];

    questions.forEach((q) => {
      const userChoice = userAnswers[q.id];
      const isCorrect = userChoice === q.correctAnswer;
      if (isCorrect) correctCount++;

      review.push({
        id: q.id,
        question: q.question,
        type: q.type,
        options: q.options,
        userAnswer: userChoice !== undefined ? userChoice : -1,
        correctAnswer: q.correctAnswer,
        isCorrect: isCorrect,
        explanation: q.explanation || 'Không có giải thích chi tiết.'
      });
    });

    const total = questions.length;
    const percentage = Math.round((correctCount / total) * 100);
    const score = Number(((correctCount / total) * 10).toFixed(1));

    let grade = 'Cần cố gắng';
    if (percentage >= 90) grade = 'Xuất sắc';
    else if (percentage >= 80) grade = 'Giỏi';
    else if (percentage >= 65) grade = 'Khá';
    else if (percentage >= 50) grade = 'Trung bình';

    return {
      score,
      total,
      correctCount,
      percentage,
      grade,
      timeSpent,
      review
    };
  }

  // ==========================================================================
  // 14. RESULTS VIEW & ANIMATION
  // ==========================================================================
  function showResultsView(results) {
    showView('view-results');

    DOM.resultQuizTitle.textContent = state.activeQuiz.title;

    // Format time spent
    const min = Math.floor(results.timeSpent / 60);
    const sec = results.timeSpent % 60;
    DOM.resTimeSpent.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;

    const total = results.total || (results.review ? results.review.length : 10);
    const correct = results.correctCount !== undefined ? results.correctCount : Math.round((results.score / 10) * total);
    const percentage = results.percentage !== undefined ? results.percentage : Math.round((results.score / 10) * 100);

    DOM.resCorrectCount.textContent = `${correct}/${total}`;
    DOM.resAccuracy.textContent = `${percentage}%`;

    // Grade styling and labels
    const grade = results.grade || getGradeByPercentage(percentage);
    DOM.gradeText.textContent = grade;

    const gradeConfig = {
      'Xuất sắc': { class: 'grade-excellent', icon: '🌟', celebration: '🏆' },
      Giỏi: { class: 'grade-good', icon: '🎖️', celebration: '🎉' },
      Khá: { class: 'grade-fair', icon: '👍', celebration: '👏' },
      'Trung bình': { class: 'grade-average', icon: '⚖️', celebration: '📚' },
      'Cần cố gắng': { class: 'grade-tryhard', icon: '💪', celebration: '🎯' }
    };

    const cfg = gradeConfig[grade] || gradeConfig['Trung bình'];
    DOM.gradeBadge.className = `grade-badge ${cfg.class}`;
    DOM.gradeBadge.querySelector('.grade-icon').textContent = cfg.icon;
    DOM.resultIcon.textContent = cfg.celebration;

    // Trigger SVG Speedometer Circle Animation
    // Total stroke circumference is 2 * PI * 82 = 515.22
    const circumference = 2 * Math.PI * 82;
    const targetOffset = circumference - (percentage / 100) * circumference;

    // Reset initial
    DOM.scoreCircleFill.style.strokeDashoffset = circumference;
    setTimeout(() => {
      DOM.scoreCircleFill.style.strokeDashoffset = targetOffset;
    }, 150);

    // Number Count-Up Animation
    animateCountUp(DOM.scoreNumber, 0, results.score, 1200, 1);
    animateCountUp(DOM.scorePercentage, 0, percentage, 1200, 0, '%');

    // Confetti on high scores (>= 80%)
    if (percentage >= 80) {
      setTimeout(() => {
        triggerConfetti(4500);
      }, 400);
    }

    // Render Review questions
    renderReviewSection(results.review || []);
  }

  function getGradeByPercentage(pct) {
    if (pct >= 90) return 'Xuất sắc';
    if (pct >= 80) return 'Giỏi';
    if (pct >= 65) return 'Khá';
    if (pct >= 50) return 'Trung bình';
    return 'Cần cố gắng';
  }

  function animateCountUp(element, start, end, duration, decimals = 1, suffix = '') {
    const startTime = performance.now();
    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * ease;
      element.textContent = current.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = Number(end).toFixed(decimals) + suffix;
      }
    }
    requestAnimationFrame(update);
  }

  function renderReviewSection(reviewItems) {
    DOM.reviewList.innerHTML = '';

    if (!reviewItems || reviewItems.length === 0) {
      DOM.reviewList.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Không có dữ liệu xem lại.</p>';
      return;
    }

    const letters = ['A', 'B', 'C', 'D'];

    reviewItems.forEach((item, idx) => {
      // Filter logic
      if (state.reviewFilter === 'wrong' && item.isCorrect) return;
      if (state.reviewFilter === 'correct' && !item.isCorrect) return;

      const card = document.createElement('div');
      card.className = `review-item ${item.isCorrect ? 'is-correct' : 'is-wrong'}`;

      const typeMap = {
        stress: '🔊 Trọng âm',
        error: '❌ Tìm lỗi sai',
        synonym: '🔄 Đồng/Trái nghĩa',
        grammar: '📝 Ngữ pháp'
      };

      const typeLabel = typeMap[item.type] || '📝 Câu hỏi';

      let optionsHtml = '';
      if (Array.isArray(item.options)) {
        item.options.forEach((opt, optIdx) => {
          let optClass = 'review-opt';
          let statusIcon = '';

          const isUserChoice = item.userAnswer === optIdx;
          const isCorrectChoice = item.correctAnswer === optIdx;

          if (isCorrectChoice) {
            optClass += ' opt-correct';
            statusIcon = ' <span style="margin-left:auto; font-weight:700;">(Đáp án đúng ✔️)</span>';
          } else if (isUserChoice && !item.isCorrect) {
            optClass += ' opt-user-wrong';
            statusIcon = ' <span style="margin-left:auto; font-weight:700;">(Bạn đã chọn ❌)</span>';
          }

          optionsHtml += `
            <div class="${optClass}">
              <strong style="width: 24px;">${letters[optIdx]}.</strong>
              <span>${escapeHtml(opt.replace(/^[A-D]\.\s*/i, ''))}</span>
              ${statusIcon}
            </div>
          `;
        });
      }

      card.innerHTML = `
        <div class="review-item-header">
          <div style="display: flex; gap: 8px; align-items: center;">
            <span class="q-badge" style="background: rgba(255,255,255,0.1); font-size: 0.78rem;">${typeLabel}</span>
            <strong style="font-size: 0.95rem;">Câu ${idx + 1}</strong>
          </div>
          <span class="review-status-badge ${item.isCorrect ? 'status-badge-correct' : 'status-badge-wrong'}">
            ${item.isCorrect ? '✓ Chính xác' : '✕ Chưa đúng'}
          </span>
        </div>

        <div class="review-q-text">${item.question}</div>
        <div class="review-answers-grid">${optionsHtml}</div>

        <div class="review-explanation">
          <div class="explanation-title">
            <span>💡</span>
            <span>Giải thích chi tiết:</span>
          </div>
          <p>${escapeHtml(item.explanation)}</p>
        </div>
      `;

      DOM.reviewList.appendChild(card);
    });
  }

  // ==========================================================================
  // 15. MODAL DIALOG CONTROLLER
  // ==========================================================================
  let confirmCallback = null;

  function showConfirmModal(title, description, onConfirm) {
    DOM.confirmModalTitle.textContent = title;
    DOM.confirmModalDesc.textContent = description;
    confirmCallback = onConfirm;
    DOM.confirmModal.classList.remove('hidden');
  }

  function hideConfirmModal() {
    DOM.confirmModal.classList.add('hidden');
    confirmCallback = null;
  }

  // ==========================================================================
  // 16. EVENT LISTENERS SETUP
  // ==========================================================================
  function setupEventListeners() {
    // Logout
    DOM.btnLogout.addEventListener('click', () => {
      playSound('click');
      state.token = null;
      state.user = null;
      localStorage.removeItem('quiz_token');
      localStorage.removeItem('quiz_user');
      showToast('Đã đăng xuất thành công.', 'info');
      showView('view-login');
    });

    // Quiz Navigation Buttons
    DOM.btnPrevQ.addEventListener('click', () => {
      playSound('click');
      goToQuestion(state.currentQuestionIndex - 1);
    });

    DOM.btnNextQ.addEventListener('click', () => {
      playSound('click');
      goToQuestion(state.currentQuestionIndex + 1);
    });

    // Submit actions
    DOM.btnFinishQuiz.addEventListener('click', () => {
      playSound('click');
      confirmAndSubmitQuiz();
    });

    DOM.btnSubmitTop.addEventListener('click', () => {
      playSound('click');
      confirmAndSubmitQuiz();
    });

    // Quit active quiz button
    DOM.btnQuitQuiz.addEventListener('click', () => {
      playSound('click');
      showConfirmModal(
        '🚪 Rời Khỏi Bài Thi?',
        'Tiến trình làm bài hiện tại sẽ không được lưu. Bạn có chắc chắn muốn quay lại danh sách đề thi?',
        () => {
          stopTimer();
          showView('view-quizzes');
          loadQuizzes();
        }
      );
    });

    // Results screen actions
    DOM.btnBackQuizzes.addEventListener('click', () => {
      playSound('click');
      showView('view-quizzes');
      loadQuizzes();
    });

    DOM.btnRetryQuiz.addEventListener('click', () => {
      playSound('click');
      if (state.activeQuiz) {
        startQuiz(state.activeQuiz.id);
      } else {
        showView('view-quizzes');
      }
    });

    // Review Filters
    document.querySelectorAll('.review-filters .filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        playSound('click');
        document.querySelectorAll('.review-filters .filter-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.reviewFilter = btn.dataset.filter;
        if (state.submissionResult && state.submissionResult.review) {
          renderReviewSection(state.submissionResult.review);
        }
      });
    });

    // Modal buttons
    DOM.btnModalCancel.addEventListener('click', () => {
      playSound('click');
      hideConfirmModal();
    });

    DOM.btnModalConfirm.addEventListener('click', () => {
      playSound('click');
      if (confirmCallback) confirmCallback();
      hideConfirmModal();
    });

    // Dismiss modal on backdrop click
    DOM.confirmModal.addEventListener('click', (e) => {
      if (e.target === DOM.confirmModal) {
        hideConfirmModal();
      }
    });

    // Keyboard Shortcuts (Arrow keys & numbers 1-4 for A,B,C,D)
    window.addEventListener('keydown', (e) => {
      if (DOM.viewQuizTaking.classList.contains('active-view')) {
        if (e.key === 'ArrowRight' && state.currentQuestionIndex < state.activeQuiz.questions.length - 1) {
          goToQuestion(state.currentQuestionIndex + 1);
        } else if (e.key === 'ArrowLeft' && state.currentQuestionIndex > 0) {
          goToQuestion(state.currentQuestionIndex - 1);
        } else if (['1', '2', '3', '4'].includes(e.key)) {
          const optIdx = parseInt(e.key, 10) - 1;
          const q = state.activeQuiz.questions[state.currentQuestionIndex];
          if (q) {
            selectAnswer(q.id, optIdx);
          }
        }
      }
    });
  }

  // ==========================================================================
  // 17. INITIALIZATION ON PAGE LOAD
  // ==========================================================================
  async function initApp() {
    initParticlesBackground();
    initLogin();
    setupEventListeners();

    // Check existing authentication
    if (state.token && state.user) {
      DOM.navUserName.textContent = state.user.name || 'Học sinh';
      DOM.welcomeMessage.textContent = `Chào mừng ${state.user.name}! Sẵn sàng thử sức với các bài kiểm tra 15 phút?`;

      // Verify token with server
      const verifyRes = await apiRequest('/api/auth/verify');
      if (verifyRes.ok) {
        showView('view-quizzes');
        loadQuizzes();
      } else if (verifyRes.status === 401 || verifyRes.status === 403) {
        // Token expired/invalid
        state.token = null;
        state.user = null;
        localStorage.removeItem('quiz_token');
        localStorage.removeItem('quiz_user');
        showView('view-login');
      } else {
        // Offline or demo mode, proceed to quizzes
        showView('view-quizzes');
        loadQuizzes();
      }
    } else {
      showView('view-login');
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
