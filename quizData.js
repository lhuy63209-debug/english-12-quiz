/**
 * Quiz data for English 12 Global Success (Units 1, 2, 3)
 * Unit 1: Life Stories
 * Unit 2: The Green Movement
 * Unit 3: The Future of Jobs
 */

module.exports = [
  {
    id: 1,
    title: 'Đề kiểm tra 15 phút - Đề 1',
    difficulty: 'easy',
    timeLimit: 900,
    questions: [
      {
        id: 1,
        type: 'stress',
        question: 'Chọn từ có trọng âm khác với các từ còn lại.',
        options: [
          'A. struggle',
          'B. demand',
          'C. talent',
          'D. fossil'
        ],
        answer: 1,
        explanation: "'demand' có trọng âm rơi vào âm tiết thứ hai /dɪˈmɑːnd/, các từ còn lại có trọng âm rơi vào âm tiết thứ nhất: 'struggle' /ˈstrʌɡl/, 'talent' /ˈtælənt/, 'fossil' /ˈfɒsl/."
      },
      {
        id: 2,
        type: 'stress',
        question: 'Chọn từ có trọng âm khác với các từ còn lại.',
        options: [
          'A. endangered',
          'B. devotion',
          'C. emission',
          'D. obstacle'
        ],
        answer: 3,
        explanation: "'obstacle' có trọng âm rơi vào âm tiết thứ nhất /ˈɒbstəkl/, các từ còn lại có trọng âm rơi vào âm tiết thứ hai: 'endangered' /ɪnˈdeɪndʒəd/, 'devotion' /dɪˈvəʊʃn/, 'emission' /ɪˈmɪʃn/."
      },
      {
        id: 3,
        type: 'error',
        question: 'Tìm phần gạch chân cần sửa: When Uncle Ho lived (A) in France, he used to working (B) as a cook\'s helper (C) in a hotel (D).',
        options: [
          'A. lived',
          'B. working',
          'C. as a cook\'s helper',
          'D. in a hotel'
        ],
        answer: 1,
        explanation: "Kiến thức về cấu trúc 'used to': used to + V (nguyên thể) diễn tả thói quen trong quá khứ. Cần sửa 'working' thành 'work'."
      },
      {
        id: 4,
        type: 'error',
        question: 'Tìm phần gạch chân cần sửa: Fossil fuels are burned (A) to produce energy, but tons (B) of greenhouse gases emit (C) into the atmosphere every day (D).',
        options: [
          'A. are burned',
          'B. tons',
          'C. emit',
          'D. every day'
        ],
        answer: 2,
        explanation: "Khí nhà kính không tự phát thải mà phải bị/được thải ra -> Cần dùng thể bị động thì hiện tại đơn. Cần sửa 'emit' thành 'are emitted'."
      },
      {
        id: 5,
        type: 'synonym',
        question: 'Từ "talented" trong câu "Nguyen Ngoc Ky was a talented teacher who inspired thousands of students across the country." gần nghĩa nhất với ___.',
        options: [
          'A. wealthy',
          'B. handsome',
          'C. gifted',
          'D. generous'
        ],
        answer: 2,
        explanation: "'talented' (tài năng, có năng khiếu) đồng nghĩa với 'gifted'."
      },
      {
        id: 6,
        type: 'synonym',
        question: 'Từ "reduce" trong câu "We should reduce our carbon footprint by cycling instead of driving motorbikes." trái nghĩa nhất với ___.',
        options: [
          'A. decrease',
          'B. protect',
          'C. maintain',
          'D. increase'
        ],
        answer: 3,
        explanation: "'reduce' (cắt giảm) trái nghĩa với 'increase' (tăng lên). 'decrease' là từ đồng nghĩa."
      },
      {
        id: 7,
        type: 'grammar',
        question: 'While Stephen Hawking ________ at Cambridge University, he began experiencing symptoms of ALS.',
        options: [
          'A. has studied',
          'B. studied',
          'C. had studied',
          'D. was studying'
        ],
        answer: 3,
        explanation: "Sự phối hợp thì: Một hành động đang xảy ra trong quá khứ (chia Quá khứ tiếp diễn - was studying) thì một hành động khác xen vào (chia Quá khứ đơn - began)."
      },
      {
        id: 8,
        type: 'grammar',
        question: 'Her selfless ________ to helping disabled children won the admiration of the whole community.',
        options: [
          'A. dedication',
          'B. emission',
          'C. automation',
          'D. deforestation'
        ],
        answer: 0,
        explanation: "'dedication to + N/V-ing' nghĩa là sự cống hiến, tận tâm vì điều gì."
      },
      {
        id: 9,
        type: 'grammar',
        question: 'By the time the biography was published, the famous writer ________ away.',
        options: [
          'A. passes',
          'B. had passed',
          'C. was passing',
          'D. has passed'
        ],
        answer: 1,
        explanation: "Cấu trúc: 'By the time + S + V(quá khứ đơn), S + had + V3/ed'. Hành động qua đời (passed away) xảy ra trước thời điểm cuốn tiểu sử được xuất bản."
      },
      {
        id: 10,
        type: 'grammar',
        question: 'Solar and wind power are examples of ________ energy sources that do not harm the planet.',
        options: [
          'A. exhausting',
          'B. artificial',
          'C. renewable',
          'D. ancient'
        ],
        answer: 2,
        explanation: "'renewable energy' là năng lượng tái tạo (như năng lượng mặt trời, gió)."
      },
      {
        id: 11,
        type: 'grammar',
        question: 'Millions of tons of plastic waste ________ into the oceans every year, threatening marine life.',
        options: [
          'A. throw',
          'B. are thrown',
          'C. threw',
          'D. are throwing'
        ],
        answer: 1,
        explanation: "Chủ ngữ 'plastic waste' (rác thải nhựa) chịu tác động của hành động và có trạng từ 'every year' -> Chia câu bị động ở thì hiện tại đơn: 'are thrown'."
      },
      {
        id: 12,
        type: 'grammar',
        question: 'Deforestation has destroyed the natural ________ of many rare wildlife species.',
        options: [
          'A. competence',
          'B. biography',
          'C. qualification',
          'D. habitat'
        ],
        answer: 3,
        explanation: "'natural habitat' nghĩa là môi trường sống tự nhiên của các loài động thực vật hoang dã."
      },
      {
        id: 13,
        type: 'grammar',
        question: 'It ________ that global temperatures will continue to rise unless countries cut emissions.',
        options: [
          'A. is reported',
          'B. reports',
          'C. was reporting',
          'D. will report'
        ],
        answer: 0,
        explanation: "Cấu trúc bị động khách quan (impersonal passive): 'It is reported that + S + V' (Người ta báo cáo rằng...)."
      },
      {
        id: 14,
        type: 'grammar',
        question: 'Many companies are investing heavily in ________ (AI) to improve customer service.',
        options: [
          'A. automated qualification',
          'B. ancient history',
          'C. artificial intelligence',
          'D. autonomous conservation'
        ],
        answer: 2,
        explanation: "'artificial intelligence' (viết tắt là AI) nghĩa là trí tuệ nhân tạo."
      },
      {
        id: 15,
        type: 'grammar',
        question: 'Look at those dark clouds! It ________ rain very soon.',
        options: [
          'A. will',
          'B. was to',
          'C. is raining',
          'D. is going to'
        ],
        answer: 3,
        explanation: "Dùng 'be going to' khi đưa ra dự đoán dựa trên căn cứ, dấu hiệu trực quan ở hiện tại ('Look at those dark clouds!')."
      },
      {
        id: 16,
        type: 'grammar',
        question: 'Thanks to modern communication technology, ________ has become a popular trend allowing people to work from home.',
        options: [
          'A. remote work',
          'B. fossil fuel',
          'C. past achievement',
          'D. greenhouse effect'
        ],
        answer: 0,
        explanation: "'remote work' nghĩa là làm việc từ xa (làm việc tại nhà không cần tới trụ sở công ty)."
      },
      {
        id: 17,
        type: 'grammar',
        question: 'If you learn how to code, you ________ more job opportunities in the tech industry.',
        options: [
          'A. have',
          'B. will have',
          'C. would have',
          'D. had had'
        ],
        answer: 1,
        explanation: "Câu điều kiện loại 1 diễn tả sự việc có thể xảy ra ở hiện tại hoặc tương lai: If + S + V(hiện tại đơn), S + will + V(nguyên thể)."
      },
      {
        id: 18,
        type: 'grammar',
        question: 'Despite facing poverty and illness, she managed to ________ every obstacle in her path.',
        options: [
          'A. recycle',
          'B. pollute',
          'C. overcome',
          'D. exhaust'
        ],
        answer: 2,
        explanation: "'overcome an obstacle' là cụm kết hợp từ cố định nghĩa là vượt qua chướng ngại vật/trở ngại."
      },
      {
        id: 19,
        type: 'grammar',
        question: 'Strict laws must ________ to prevent companies from dumping untreated chemical waste.',
        options: [
          'A. introduce',
          'B. be introduced',
          'C. have introduced',
          'D. introducing'
        ],
        answer: 1,
        explanation: "Thể bị động với động từ khuyết thiếu: 'modal verb + be + V3/ed' (must be introduced - phải được ban hành)."
      },
      {
        id: 20,
        type: 'grammar',
        question: 'To succeed in the future job market, graduates need a diverse ________ that combines tech skills and soft skills.',
        options: [
          'A. carbon footprint',
          'B. life story',
          'C. fossil fuel',
          'D. skill set'
        ],
        answer: 3,
        explanation: "'skill set' nghĩa là tập hợp kỹ năng, bộ kỹ năng chuyên môn và kỹ năng mềm."
      }
    ]
  },
  {
    id: 2,
    title: 'Đề kiểm tra 15 phút - Đề 2',
    difficulty: 'easy',
    timeLimit: 900,
    questions: [
      {
        id: 1,
        type: 'stress',
        question: 'Chọn từ có trọng âm khác với các từ còn lại.',
        options: [
          'A. adapt',
          'B. achieve',
          'C. footprint',
          'D. inspire'
        ],
        answer: 2,
        explanation: "'footprint' có trọng âm rơi vào âm tiết thứ nhất /ˈfʊtprɪnt/, các từ còn lại có trọng âm rơi vào âm tiết thứ hai: 'adapt' /əˈdæpt/, 'achieve' /əˈtʃiːv/, 'inspire' /ɪnˈspaɪə/."
      },
      {
        id: 2,
        type: 'stress',
        question: 'Chọn từ có trọng âm khác với các từ còn lại.',
        options: [
          'A. habitat',
          'B. competence',
          'C. qualify',
          'D. distinguished'
        ],
        answer: 3,
        explanation: "'distinguished' có trọng âm rơi vào âm tiết thứ hai /dɪˈstɪŋɡwɪʃt/, các từ còn lại có trọng âm rơi vào âm tiết thứ nhất: 'habitat' /ˈhæbɪtæt/, 'competence' /ˈkɒmpɪtəns/, 'qualify' /ˈkwɒlɪfaɪ/."
      },
      {
        id: 3,
        type: 'error',
        question: 'Tìm phần gạch chân cần sửa: By the time (A) Thomas Edison was (B) twenty-five, he invented (C) several useful (D) devices.',
        options: [
          'A. By the time',
          'B. was',
          'C. invented',
          'D. useful'
        ],
        answer: 2,
        explanation: "Cấu trúc: 'By the time + S + V(quá khứ đơn), S + had + V3/ed'. Việc sáng chế ra các thiết bị xảy ra trước mốc năm ông 25 tuổi. Sửa 'invented' thành 'had invented'."
      },
      {
        id: 4,
        type: 'error',
        question: 'Tìm phần gạch chân cần sửa: If young people will develop (A) strong digital skills (B), they will easily find (C) high-paying jobs in the era (D) of AI.',
        options: [
          'A. will develop',
          'B. digital skills',
          'C. will easily find',
          'D. era'
        ],
        answer: 0,
        explanation: "Trong mệnh đề điều kiện 'If' của câu điều kiện loại 1, ta dùng thì hiện tại đơn chứ không dùng 'will'. Sửa 'will develop' thành 'develop'."
      },
      {
        id: 5,
        type: 'synonym',
        question: 'Cụm từ "eco-friendly" trong câu "Consumers are encouraged to buy eco-friendly products made from recycled materials." gần nghĩa nhất với ___.',
        options: [
          'A. harmful to nature',
          'B. environmentally friendly',
          'C. extremely expensive',
          'D. difficult to clean'
        ],
        answer: 1,
        explanation: "'eco-friendly' (thân thiện với môi trường) đồng nghĩa với 'environmentally friendly'."
      },
      {
        id: 6,
        type: 'synonym',
        question: 'Từ "adapt" trong câu "Workers must adapt to technological changes to stay competitive." trái nghĩa nhất với ___.',
        options: [
          'A. adjust',
          'B. conform',
          'C. accommodate',
          'D. resist'
        ],
        answer: 3,
        explanation: "'adapt' (thích nghi, thích ứng) trái nghĩa với 'resist' (phản kháng, chống lại). Các từ 'adjust', 'conform' là từ đồng nghĩa/gần nghĩa."
      },
      {
        id: 7,
        type: 'grammar',
        question: 'My grandfather ________ a small radio every evening, but now he watches news on his smartphone.',
        options: [
          'A. is used to listen to',
          'B. used to listen to',
          'C. was used to listening',
          'D. uses to listen'
        ],
        answer: 1,
        explanation: "Cấu trúc 'used to + V' diễn tả một thói quen hoặc hành động thường xuyên làm trong quá khứ và nay không còn nữa ('but now he watches news on his smartphone')."
      },
      {
        id: 8,
        type: 'grammar',
        question: 'Winning the Nobel Prize in Physics was arguably Albert Einstein\'s greatest ________.',
        options: [
          'A. emission',
          'B. obstacle',
          'C. achievement',
          'D. unemployment'
        ],
        answer: 2,
        explanation: "'achievement' có nghĩa là thành tựu, thành tích vẻ vang."
      },
      {
        id: 9,
        type: 'grammar',
        question: 'Marie Curie met Pierre Curie while she ________ her research at the Sorbonne.',
        options: [
          'A. was conducting',
          'B. conducted',
          'C. has conducted',
          'D. is conducting'
        ],
        answer: 0,
        explanation: "Hành động tiến hành nghiên cứu đang diễn ra trong quá khứ (chia Quá khứ tiếp diễn: 'was conducting') thì việc gặp gỡ xen vào (chia Quá khứ đơn: 'met')."
      },
      {
        id: 10,
        type: 'grammar',
        question: 'Planting trees and taking public transit are effective ways to reduce your personal ________.',
        options: [
          'A. life cycle',
          'B. qualification',
          'C. freelance',
          'D. carbon footprint'
        ],
        answer: 3,
        explanation: "'carbon footprint' nghĩa là dấu chân carbon (tổng lượng khí nhà kính phát thải do hành vi của một cá nhân tạo ra)."
      },
      {
        id: 11,
        type: 'grammar',
        question: 'The first national park in the United States ________ in 1872 to protect wildlife.',
        options: [
          'A. established',
          'B. was established',
          'C. has established',
          'D. is establishing'
        ],
        answer: 1,
        explanation: "Mốc thời gian 'in 1872' chỉ thời điểm xác định trong quá khứ và chủ ngữ 'vườn quốc gia' mang nghĩa bị động -> Chia Quá khứ đơn bị động: 'was established'."
      },
      {
        id: 12,
        type: 'grammar',
        question: 'Rapid ________ in the Amazon basin has caused severe loss of biodiversity and climate shifts.',
        options: [
          'A. inspiration',
          'B. deforestation',
          'C. perseverance',
          'D. collaboration'
        ],
        answer: 1,
        explanation: "'deforestation' nghĩa là nạn phá rừng, sự tàn phá rừng diện rộng."
      },
      {
        id: 13,
        type: 'grammar',
        question: 'Elephants ________ to be among the most intelligent and social animals on Earth.',
        options: [
          'A. know',
          'B. knowing',
          'C. have known',
          'D. are known'
        ],
        answer: 3,
        explanation: "Cấu trúc bị động khách quan: 'S + be known + to V' (được biết đến là loài động vật...)."
      },
      {
        id: 14,
        type: 'grammar',
        question: 'Factory ________ has replaced repetitive manual labor with robotic assembly lines.',
        options: [
          'A. automation',
          'B. autobiography',
          'C. conservation',
          'D. biodiversity'
        ],
        answer: 0,
        explanation: "'automation' nghĩa là sự tự động hóa trong công nghiệp sản xuất."
      },
      {
        id: 15,
        type: 'grammar',
        question: '"The phone is ringing." - "Don\'t worry, I ________ it."',
        options: [
          'A. am answering',
          'B. am going to answer',
          'C. will answer',
          'D. answered'
        ],
        answer: 2,
        explanation: "Dùng thì tương lai đơn với 'will' để diễn tả quyết định nhất thời, được đưa ra ngay tại thời điểm nói."
      },
      {
        id: 16,
        type: 'grammar',
        question: 'Instead of working for a single employer, David decided to become a ________ graphic designer.',
        options: [
          'A. renewable',
          'B. freelance',
          'C. distinguished',
          'D. gifted'
        ],
        answer: 1,
        explanation: "'freelance' nghĩa là làm nghề tự do, nhận dự án từ nhiều khách hàng thay vì làm cố định cho một nơi."
      },
      {
        id: 17,
        type: 'grammar',
        question: 'If I ________ more free time, I would participate in the local green campaign.',
        options: [
          'A. have',
          'B. will have',
          'C. have had',
          'D. had'
        ],
        answer: 3,
        explanation: "Câu điều kiện loại 2 giả định điều không có thật ở hiện tại: If + S + V(quá khứ đơn), S + would + V."
      },
      {
        id: 18,
        type: 'grammar',
        question: 'Nick Vujicic\'s life story is an incredible source of ________ for millions of people worldwide.',
        options: [
          'A. emission',
          'B. inspiration',
          'C. unemployment',
          'D. fossil fuel'
        ],
        answer: 1,
        explanation: "'source of inspiration' nghĩa là nguồn cảm hứng to lớn."
      },
      {
        id: 19,
        type: 'grammar',
        question: 'The snow leopard is listed as an ________ species due to habitat loss and poaching.',
        options: [
          'A. endangered',
          'B. independent',
          'C. autonomous',
          'D. automated'
        ],
        answer: 0,
        explanation: "'endangered species' nghĩa là loài có nguy cơ tuyệt chủng."
      },
      {
        id: 20,
        type: 'grammar',
        question: 'We ________ a conference on artificial intelligence this Friday morning; all invitations have been sent.',
        options: [
          'A. will attend',
          'B. attended',
          'C. are attending',
          'D. attend'
        ],
        answer: 2,
        explanation: "Thì hiện tại tiếp diễn ('are attending') dùng để diễn đạt kế hoạch hoặc sự sắp xếp cố định chắc chắn sẽ diễn ra trong tương lai gần ('all invitations have been sent')."
      }
    ]
  },
  {
    id: 3,
    title: 'Đề kiểm tra 15 phút - Đề 3',
    difficulty: 'medium',
    timeLimit: 900,
    questions: [
      {
        id: 1,
        type: 'stress',
        question: 'Chọn từ có trọng âm khác với các từ còn lại.',
        options: [
          'A. remarkable',
          'B. biography',
          'C. perseverance',
          'D. autonomous'
        ],
        answer: 2,
        explanation: "'perseverance' có trọng âm rơi vào âm tiết thứ ba /ˌpɜːsəˈvɪərəns/, các từ còn lại có trọng âm rơi vào âm tiết thứ hai: 'remarkable' /rɪˈmɑːkəbl/, 'biography' /baɪˈɒɡrəfi/, 'autonomous' /ɔːˈtɒnəməs/."
      },
      {
        id: 2,
        type: 'stress',
        question: 'Chọn từ có trọng âm khác với các từ còn lại.',
        options: [
          'A. inspiration',
          'B. conservation',
          'C. unemployment',
          'D. qualification'
        ],
        answer: 3,
        explanation: "'qualification' có trọng âm rơi vào âm tiết thứ tư /ˌkwɒlɪfɪˈkeɪʃn/, các từ còn lại có trọng âm rơi vào âm tiết thứ ba: 'inspiration' /ˌɪnspəˈreɪʃn/, 'conservation' /ˌkɒnsəˈveɪʃn/, 'unemployment' /ˌʌnɪmˈplɔɪmənt/."
      },
      {
        id: 3,
        type: 'error',
        question: 'Tìm phần gạch chân cần sửa: It is believed (A) that sustainable agriculture and renewable energy helps (B) reduce the devastating (C) effects of global warming (D).',
        options: [
          'A. is believed',
          'B. helps',
          'C. devastating',
          'D. global warming'
        ],
        answer: 1,
        explanation: "Chủ ngữ trong mệnh đề 'that' gồm hai vế nối bằng 'and' ('sustainable agriculture and renewable energy' - nông nghiệp bền vững và năng lượng tái tạo) là chủ ngữ số nhiều, do đó động từ phải chia số nhiều. Sửa 'helps' thành 'help'."
      },
      {
        id: 4,
        type: 'error',
        question: 'Tìm phần gạch chân cần sửa: If autonomous robots were not invented (A), factories would not have been able (B) to operate so efficiently (C) at the present time (D).',
        options: [
          'A. were not invented',
          'B. would not have been able',
          'C. efficiently',
          'D. at the present time'
        ],
        answer: 1,
        explanation: "Cụm 'at the present time' chỉ kết quả ở hiện tại -> Đây là câu điều kiện trộn (quá khứ - hiện tại) hoặc câu điều kiện loại 2. Mệnh đề chính phải dùng 'would not be able', không dùng 'would not have been able'. Sửa thành 'would not be able'."
      },
      {
        id: 5,
        type: 'synonym',
        question: 'Từ "perseverance" trong câu "Through dedication and perseverance, the young athlete overcame numerous obstacles to win the gold medal." gần nghĩa nhất với ___.',
        options: [
          'A. determination',
          'B. hesitation',
          'C. indifference',
          'D. discouragement'
        ],
        answer: 0,
        explanation: "'perseverance' (sự kiên trì, lòng nhẫn nại) đồng nghĩa với 'determination' (sự quyết tâm). 'hesitation' (sự do dự), 'indifference' (sự thờ ơ)."
      },
      {
        id: 6,
        type: 'synonym',
        question: 'Từ "sustainable" trong câu "Overfishing poses a serious threat to marine life, making current fishing practices barely sustainable." trái nghĩa nhất với ___.',
        options: [
          'A. renewable',
          'B. eco-friendly',
          'C. unviable',
          'D. durable'
        ],
        answer: 2,
        explanation: "'sustainable' (bền vững, có thể duy trì lâu dài) trái nghĩa với 'unviable' (không thể đứng vững/không khả thi để duy trì tiếp)."
      },
      {
        id: 7,
        type: 'grammar',
        question: 'Before he finally published his groundbreaking autobiography, the author ________ on the manuscript for over ten years.',
        options: [
          'A. was working',
          'B. has worked',
          'C. worked',
          'D. had been working'
        ],
        answer: 3,
        explanation: "Hành động viết bản thảo kéo dài liên tục suốt 10 năm ('for over ten years') trước thời điểm xuất bản trong quá khứ ('published') -> Dùng thì Quá khứ hoàn thành tiếp diễn: 'had been working'."
      },
      {
        id: 8,
        type: 'grammar',
        question: 'Despite numerous rejections from publishers, her unwavering ________ eventually led to a breakthrough in her literary career.',
        options: [
          'A. determination',
          'B. degradation',
          'C. hesitation',
          'D. contamination'
        ],
        answer: 0,
        explanation: "'unwavering determination' là cụm kết hợp từ mang nghĩa sự kiên định, lòng quyết tâm không bao giờ lay chuyển."
      },
      {
        id: 9,
        type: 'grammar',
        question: 'After moving from a rural village to London, it took the young scholar nearly six months to get used to ________ in such a bustling environment.',
        options: [
          'A. live',
          'B. living',
          'C. lived',
          'D. life lived'
        ],
        answer: 1,
        explanation: "Cấu trúc 'get used to + V-ing' diễn tả việc dần thích nghi hoặc quen dần với việc làm gì đó."
      },
      {
        id: 10,
        type: 'grammar',
        question: 'The illegal poaching ring is reported ________ by environmental police late last night.',
        options: [
          'A. to uncover',
          'B. having been uncovered',
          'C. to have been uncovered',
          'D. being uncovered'
        ],
        answer: 2,
        explanation: "Cấu trúc bị động khách quan: 'S + be reported + to have been + V3/ed' khi hành động phá án ('late last night') xảy ra trước thời điểm hiện tại ('is reported') và mang nghĩa bị động."
      },
      {
        id: 11,
        type: 'grammar',
        question: 'The government aims to achieve a ________ balance between economic industrial growth and the conservation of natural resources.',
        options: [
          'A. sustainable',
          'B. disposable',
          'C. temporary',
          'D. destructive'
        ],
        answer: 0,
        explanation: "'sustainable balance' nghĩa là sự cân bằng bền vững giữa phát triển kinh tế và bảo tồn tài nguyên."
      },
      {
        id: 12,
        type: 'grammar',
        question: 'Thousands of trees in the nature reserve ________ illegally if ranger patrols had been properly scheduled.',
        options: [
          'A. wouldn\'t cut down',
          'B. hadn\'t been cut down',
          'C. weren\'t cut down',
          'D. wouldn\'t have been cut down'
        ],
        answer: 3,
        explanation: "Mệnh đề chính của câu điều kiện loại 3 ở dạng bị động: 'S + would/wouldn\'t + have been + V3/ed' (đã không bị đốn hạ trái phép)."
      },
      {
        id: 13,
        type: 'grammar',
        question: 'The construction of the giant dam caused irreversible damage to the river basin\'s aquatic ________.',
        options: [
          'A. qualification',
          'B. biodiversity',
          'C. perseverance',
          'D. competence'
        ],
        answer: 1,
        explanation: "'aquatic biodiversity' có nghĩa là sự đa dạng sinh học thủy sinh/dưới nước."
      },
      {
        id: 14,
        type: 'grammar',
        question: 'If Minh ________ digital competence classes during his university years, he wouldn\'t be struggling to adapt to remote work now.',
        options: [
          'A. took',
          'B. has taken',
          'C. had taken',
          'D. would take'
        ],
        answer: 2,
        explanation: "Câu điều kiện trộn (Mixed conditional): Giả định hành động trong quá khứ ('during his university years' -> If + had + V3) dẫn đến kết quả ở hiện tại ('now' -> wouldn't be struggling)."
      },
      {
        id: 15,
        type: 'grammar',
        question: 'As intelligent machines take over mundane tasks, companies must upskill their existing ________ to stay competitive.',
        options: [
          'A. biography',
          'B. emission',
          'C. fossil fuel',
          'D. workforce'
        ],
        answer: 3,
        explanation: "'upskill the existing workforce' nghĩa là bồi dưỡng nâng cao tay nghề cho lực lượng lao động hiện có."
      },
      {
        id: 16,
        type: 'grammar',
        question: 'By this time next decade, millions of routine manual jobs ________ completely by autonomous systems.',
        options: [
          'A. will replace',
          'B. will be replacing',
          'C. will have been replaced',
          'D. have been replaced'
        ],
        answer: 2,
        explanation: "'By this time next decade' chỉ mốc thời gian hoàn thành trong tương lai -> Dùng thì Tương lai hoàn thành ở thể bị động: 'will have been replaced'."
      },
      {
        id: 17,
        type: 'grammar',
        question: 'Throughout his entire political and medical career, Dr. Nelson Mandela was deeply ________ to ending racial segregation and social injustice.',
        options: [
          'A. devoted',
          'B. indifferent',
          'C. renewable',
          'D. autonomous'
        ],
        answer: 0,
        explanation: "'be devoted to + N/V-ing' mang nghĩa hết lòng tận tụy, cống hiến cho lý tưởng/mục tiêu gì."
      },
      {
        id: 18,
        type: 'grammar',
        question: 'The environmental activist strongly objected to ________ as an extremist during the televised climate debate.',
        options: [
          'A. portraying',
          'B. being portrayed',
          'C. be portrayed',
          'D. having portrayed'
        ],
        answer: 1,
        explanation: "'object to + V-ing' (phản đối điều gì); ở thể bị động ta dùng danh động từ bị động: 'being + V3/ed' (bị miêu tả/khắc họa như một kẻ cực đoan)."
      },
      {
        id: 19,
        type: 'grammar',
        question: 'In the era of artificial intelligence, cross-cultural communication and emotional intelligence are considered vital core ________.',
        options: [
          'A. obstacles',
          'B. greenhouse gases',
          'C. competencies',
          'D. autobiographies'
        ],
        answer: 2,
        explanation: "'core competencies' nghĩa là các năng lực cốt lõi cần thiết trong công việc và cuộc sống."
      },
      {
        id: 20,
        type: 'grammar',
        question: '________ any further technical assistance, do not hesitate to contact our customer support team immediately.',
        options: [
          'A. Were you to require',
          'B. Had you required',
          'C. If you required',
          'D. Should you require'
        ],
        answer: 3,
        explanation: "Đảo ngữ của câu điều kiện loại 1: 'Should + S + V(nguyên thể), clause' dùng thay cho 'If you require...' để tăng tính trang trọng."
      }
    ]
  },
  {
    id: 4,
    title: 'Đề kiểm tra 15 phút - Đề 4',
    difficulty: 'medium',
    timeLimit: 900,
    questions: [
      {
        id: 1,
        type: 'stress',
        question: 'Chọn từ có trọng âm khác với các từ còn lại.',
        options: [
          'A. dedicate',
          'B. understand',
          'C. overcome',
          'D. volunteer'
        ],
        answer: 0,
        explanation: "'dedicate' có trọng âm rơi vào âm tiết thứ nhất /ˈdedɪkeɪt/, các từ còn lại có trọng âm rơi vào âm tiết thứ ba: 'understand' /ˌʌndəˈstænd/, 'overcome' /ˌəʊvəˈkʌm/, 'volunteer' /ˌvɒlənˈtɪə/."
      },
      {
        id: 2,
        type: 'stress',
        question: 'Chọn từ có trọng âm khác với các từ còn lại.',
        options: [
          'A. intelligent',
          'B. competitive',
          'C. professional',
          'D. artificial'
        ],
        answer: 3,
        explanation: "'artificial' có trọng âm rơi vào âm tiết thứ ba /ˌɑːtɪˈfɪʃl/, các từ còn lại có trọng âm rơi vào âm tiết thứ hai: 'intelligent' /ɪnˈtelɪdʒənt/, 'competitive' /kəmˈpetətɪv/, 'professional' /prəˈfeʃənl/."
      },
      {
        id: 3,
        type: 'error',
        question: 'Tìm phần gạch chân cần sửa: Despite being (A) a distinguished scientist, he wasn\'t used to speak (B) in front of large crowds (C) without his detailed notes (D).',
        options: [
          'A. being',
          'B. speak',
          'C. large crowds',
          'D. detailed notes'
        ],
        answer: 1,
        explanation: "Cấu trúc 'be used to + V-ing' diễn tả việc quen với cái gì hoặc hành động gì. Cần sửa 'speak' thành 'speaking'."
      },
      {
        id: 4,
        type: 'error',
        question: 'Tìm phần gạch chân cần sửa: The ancient rainforest is said to destroy (A) completely by illegal logging (B) before the government took (C) conservation measures (D).',
        options: [
          'A. to destroy',
          'B. illegal logging',
          'C. took',
          'D. conservation measures'
        ],
        answer: 0,
        explanation: "Hành động khu rừng bị tàn phá xảy ra trước thời điểm hiện tại ('is said') và mang nghĩa bị động -> Cần dùng hoàn thành bị động: 'to have been destroyed'. Sửa 'to destroy' thành 'to have been destroyed'."
      },
      {
        id: 5,
        type: 'synonym',
        question: 'Từ "autonomous" trong câu "Autonomous vehicles are expected to transform the transportation sector by reducing human error." gần nghĩa nhất với ___.',
        options: [
          'A. manually controlled',
          'B. self-driving',
          'C. poorly equipped',
          'D. labor-intensive'
        ],
        answer: 1,
        explanation: "'autonomous' (tự hành, tự động) đối với phương tiện giao thông đồng nghĩa với 'self-driving' (tự lái)."
      },
      {
        id: 6,
        type: 'synonym',
        question: 'Từ "distinguished" trong câu "He was a distinguished surgeon whose revolutionary methods saved thousands of lives." trái nghĩa nhất với ___.',
        options: [
          'A. prominent',
          'B. illustrious',
          'C. celebrated',
          'D. unknown'
        ],
        answer: 3,
        explanation: "'distinguished' (kiệt xuất, lỗi lạc, danh tiếng) trái nghĩa với 'unknown' (vô danh, không ai biết đến). Các từ còn lại là từ đồng nghĩa."
      },
      {
        id: 7,
        type: 'grammar',
        question: 'Hardly ________ his speech about overcoming physical disabilities when the entire auditorium stood up to applaud.',
        options: [
          'A. the speaker had finished',
          'B. had the speaker finished',
          'C. did the speaker finish',
          'D. was the speaker finishing'
        ],
        answer: 1,
        explanation: "Cấu trúc đảo ngữ: 'Hardly + had + S + V3/ed + when + S + V(quá khứ đơn)' (Ngay khi/Vừa mới... thì...)."
      },
      {
        id: 8,
        type: 'grammar',
        question: 'Professor Hoang Tuy was a ________ mathematician whose pioneering work in global optimization earned international acclaim.',
        options: [
          'A. devastating',
          'B. autonomous',
          'C. distinguished',
          'D. disposable'
        ],
        answer: 2,
        explanation: "'distinguished mathematician' nghĩa là nhà toán học kiệt xuất, lỗi lạc."
      },
      {
        id: 9,
        type: 'grammar',
        question: 'When my grandmother was young, there ________ a huge banyan tree at the entrance of our village.',
        options: [
          'A. would be',
          'B. was used to being',
          'C. used to being',
          'D. used to be'
        ],
        answer: 3,
        explanation: "Để diễn tả trạng thái tồn tại trong quá khứ, ta dùng 'used to be', không dùng 'would be' (vì 'would' chỉ dùng cho hành động lặp đi lặp lại trong quá khứ, không dùng cho động từ trạng thái như 'be')."
      },
      {
        id: 10,
        type: 'grammar',
        question: 'Plastic bags ________ up to five hundred years to decompose completely in landfills.',
        options: [
          'A. are thought to take',
          'B. think to take',
          'C. are thought taking',
          'D. have thought to take'
        ],
        answer: 0,
        explanation: "Cấu trúc bị động khách quan chuyển đổi chủ ngữ: 'S + be thought + to V' (Túi nilon được cho là phải mất tới 500 năm để phân hủy hoàn toàn)."
      },
      {
        id: 11,
        type: 'grammar',
        question: 'A new wildlife corridor has been created to prevent the fragmentation of natural ________ and promote genetic diversity.',
        options: [
          'A. qualifications',
          'B. freelance',
          'C. habitats',
          'D. footprints'
        ],
        answer: 2,
        explanation: "'natural habitats' nghĩa là các môi trường sống tự nhiên."
      },
      {
        id: 12,
        type: 'grammar',
        question: 'Several industrial factories along the river were seen ________ toxic chemical waste during the routine inspection.',
        options: [
          'A. discharge',
          'B. to discharge',
          'C. discharged',
          'D. to be discharge'
        ],
        answer: 1,
        explanation: "Thể bị động của động từ giác quan (see): 'S + be seen + to V' (hoặc V-ing khi nhấn mạnh hành động đang diễn ra). Ở đây có phương án 'to discharge'."
      },
      {
        id: 13,
        type: 'grammar',
        question: '________ for his prompt career transition into data science, he would have remained unemployed during the tech crisis.',
        options: [
          'A. Were it not',
          'B. If it were not',
          'C. Should it not be',
          'D. Had it not been'
        ],
        answer: 3,
        explanation: "Cấu trúc đảo ngữ câu điều kiện loại 3: 'Had it not been for + N, S + would have + V3/ed' (Nếu không nhờ có...)."
      },
      {
        id: 14,
        type: 'grammar',
        question: 'In modern corporate settings, seamless cross-departmental ________ is crucial for developing innovative software solutions.',
        options: [
          'A. collaboration',
          'B. deforestation',
          'C. perseverance',
          'D. obstacle'
        ],
        answer: 0,
        explanation: "'cross-departmental collaboration' nghĩa là sự cộng tác/hợp tác chặt chẽ giữa các phòng ban."
      },
      {
        id: 15,
        type: 'grammar',
        question: 'By the end of this year, Dr. Andrew ________ research on autonomous flight algorithms for exactly twenty-five years.',
        options: [
          'A. will be conducting',
          'B. has been conducting',
          'C. will have been conducting',
          'D. is conducting'
        ],
        answer: 2,
        explanation: "Dấu hiệu 'By the end of this year' kết hợp khoảng thời gian 'for exactly twenty-five years' đòi hỏi thì Tương lai hoàn thành tiếp diễn: 'will have been conducting'."
      },
      {
        id: 16,
        type: 'grammar',
        question: 'Unlike a third-person ________ written by an outsider, an autobiography gives readers direct access to the author\'s inner world.',
        options: [
          'A. emission',
          'B. qualification',
          'C. workforce',
          'D. biography'
        ],
        answer: 3,
        explanation: "'biography' là tiểu sử do người khác viết, phân biệt với 'autobiography' là tự truyện do chính nhân vật tự viết."
      },
      {
        id: 17,
        type: 'grammar',
        question: 'Transitioning away from ________ like coal and crude oil is imperative to curb irreversible climate damage.',
        options: [
          'A. remote works',
          'B. fossil fuels',
          'C. life stories',
          'D. skill sets'
        ],
        answer: 1,
        explanation: "'fossil fuels' nghĩa là nhiên liệu hóa thạch (như than đá, dầu thô)."
      },
      {
        id: 18,
        type: 'grammar',
        question: 'Employees who refuse to embrace ________ innovation will inevitably find themselves struggling in the modernized labor market.',
        options: [
          'A. biological',
          'B. historical',
          'C. technological',
          'D. biodegradable'
        ],
        answer: 2,
        explanation: "'technological innovation' nghĩa là sự đổi mới công nghệ."
      },
      {
        id: 19,
        type: 'grammar',
        question: 'The old heating systems in municipal buildings urgently need ________ to reduce harmful greenhouse gas emissions.',
        options: [
          'A. replacing',
          'B. to replace',
          'C. replace',
          'D. replaced'
        ],
        answer: 0,
        explanation: "Cấu trúc mang nghĩa bị động với 'need': 'S(vật) + need + V-ing' hoặc 'need to be V3/ed' (cần được thay thế)."
      },
      {
        id: 20,
        type: 'grammar',
        question: 'If you were truly proficient in artificial intelligence, you ________ that lucrative job offer in Silicon Valley last month.',
        options: [
          'A. wouldn\'t reject',
          'B. hadn\'t rejected',
          'C. won\'t reject',
          'D. wouldn\'t have rejected'
        ],
        answer: 3,
        explanation: "Câu điều kiện trộn: Mệnh đề 'If' giả định bản chất/năng lực ở hiện tại (If you were truly proficient), mệnh đề chính nói về kết quả hành động đã xảy ra trong quá khứ ('last month' -> wouldn't have rejected)."
      }
    ]
  }
];