/* ============================================================
   THEME TOGGLE
   ============================================================ */
(function initTheme() {
  const saved = localStorage.getItem('lapchoice-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (prefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  // Attach click to every .theme-toggle on any page
  document.querySelectorAll('.theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('lapchoice-theme', next);

      // Update icon
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    });

    // Set correct icon on load
    const icon = btn.querySelector('i');
    if (icon) {
      const current = document.documentElement.getAttribute('data-theme');
      icon.className = current === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  });
})();

/* ============================================================
   MOBILE HAMBURGER
   ============================================================ */
document.querySelectorAll('.hamburger').forEach(function (btn) {
  btn.addEventListener('click', function () {
    const nav = this.closest('.site-header').querySelector('.site-nav');
    nav.classList.toggle('open');
  });
});

// Close mobile nav when a link is clicked
document.querySelectorAll('.site-nav a').forEach(function (link) {
  link.addEventListener('click', function () {
    const nav = this.closest('.site-nav');
    if (nav) nav.classList.remove('open');
  });
});

/* ============================================================
   QUIZ LOGIC  (only runs on quiz.html)
   ============================================================ */
(function initQuiz() {
  const questions = document.querySelectorAll('.question-card');
  if (questions.length === 0) return; // not on quiz page

  const TOTAL_QUESTIONS = questions.length;
  let currentQuestion = 0;
  let answers = [null, null, null, null];

  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');
  const submitBtn = document.getElementById('btn-submit');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const progressPct = document.getElementById('progress-pct');

  /* ---- select option ---- */
  document.querySelectorAll('.option-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const card = this.closest('.question-card');
      card.querySelectorAll('.option-btn').forEach(function (b) {
        b.classList.remove('selected');
      });
      this.classList.add('selected');

      const index = parseInt(card.dataset.question, 10);
      answers[index] = this.dataset.value;
      updateButtons();
    });
  });

  /* ---- update nav buttons ---- */
  function updateButtons() {
    if (!prevBtn || !nextBtn || !submitBtn) return;

    prevBtn.disabled = currentQuestion === 0;

    if (currentQuestion === TOTAL_QUESTIONS - 1) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'inline-flex';
      submitBtn.disabled = answers[currentQuestion] === null;
    } else {
      nextBtn.style.display = 'inline-flex';
      submitBtn.style.display = 'none';
      nextBtn.disabled = answers[currentQuestion] === null;
    }

    // Progress
    const answered = answers.filter(function (a) { return a !== null; }).length;
    const pct = Math.round((answered / TOTAL_QUESTIONS) * 100);
    if (progressFill) progressFill.style.width = pct + '%';
    if (progressPct) progressPct.textContent = pct + '%';
    if (progressText) progressText.textContent = 'Вопрос ' + (currentQuestion + 1) + ' из ' + TOTAL_QUESTIONS;
  }

  /* ---- next / prev ---- */
  window.nextQuestion = function () {
    if (answers[currentQuestion] === null) return;
    if (currentQuestion < TOTAL_QUESTIONS - 1) {
      showQuestion(currentQuestion + 1);
    }
  };

  window.prevQuestion = function () {
    if (currentQuestion > 0) {
      showQuestion(currentQuestion - 1);
    }
  };

  function showQuestion(index) {
    questions.forEach(function (c) { c.classList.remove('active'); });
    questions[index].classList.add('active');
    currentQuestion = index;
    updateButtons();
  }

  /* ---- determine result ---- */
  function determineResult() {
    var goal = answers[0], budget = answers[1], weight = answers[2], priority = answers[3];
    var study = 0, gaming = 0, creative = 0;

    if (goal === 'study') study += 3;
    if (goal === 'gaming') gaming += 3;
    if (goal === 'creative') creative += 3;
    if (goal === 'work') { study += 2; creative += 1; }

    if (budget === 'low') study += 1;
    if (budget === 'mid') { study += 1; creative += 2; }
    if (budget === 'high') { gaming += 2; creative += 2; }

    if (weight === 'portable') study += 2;
    if (weight === 'medium') { study += 1; creative += 1; }
    if (weight === 'desktop') gaming += 2;

    if (priority === 'battery') study += 2;
    if (priority === 'performance') gaming += 2;
    if (priority === 'screen') creative += 2;
    if (priority === 'price') study += 1;

    if (gaming >= study && gaming >= creative) return 'gaming';
    if (creative >= study && creative >= gaming) return 'creative';
    return 'study';
  }

  /* ---- recommendations ---- */
  var recommendations = {
    study: {
      headerClass: 'study',
      icon: 'fa-graduation-cap',
      title: 'Для учёбы и офиса',
      subtitle: 'Лёгкий, автономный, надёжный — ваш идеальный компаньон',
      model: 'Acer Swift 3 (SF314-43)',
      price: '≈ 48 000 – 58 000 ₽',
      specs: [
        { icon: 'fa-microchip', label: 'Процессор', value: 'AMD Ryzen 5 5500U' },
        { icon: 'fa-memory', label: 'ОЗУ', value: '8 ГБ DDR4' },
        { icon: 'fa-hard-drive', label: 'SSD', value: '512 ГБ NVMe' },
        { icon: 'fa-desktop', label: 'Экран', value: '14″ IPS Full HD' },
        { icon: 'fa-battery-full', label: 'Батарея', value: 'до 12 часов' },
        { icon: 'fa-weight-scale', label: 'Вес', value: '1.19 кг' }
      ],
      desc: 'Acer Swift 3 — один из лучших ультрабуков для студентов и офисных работников. Лёгкий корпус, отличная автономность и достаточная производительность для учёбы, работы с документами, видеозвонков и браузера с десятком вкладок. Если нужен вариант дешевле, посмотрите Lenovo IdeaPad 3 (≈ 35 000 ₽).'
    },
    gaming: {
      headerClass: 'gaming',
      icon: 'fa-gamepad',
      title: 'Для игр и развлечений',
      subtitle: 'Мощная видеокарта и крутой экран для максимального FPS',
      model: 'Lenovo Legion 5 (15ACH6H)',
      price: '≈ 82 000 – 105 000 ₽',
      specs: [
        { icon: 'fa-microchip', label: 'Процессор', value: 'AMD Ryzen 7 5800H' },
        { icon: 'fa-memory', label: 'ОЗУ', value: '16 ГБ DDR4' },
        { icon: 'fa-hard-drive', label: 'SSD', value: '512 ГБ NVMe' },
        { icon: 'fa-desktop', label: 'Экран', value: '15.6″ IPS 165 Hz' },
        { icon: 'fa-bolt', label: 'Видеокарта', value: 'RTX 3060 6 ГБ' },
        { icon: 'fa-weight-scale', label: 'Вес', value: '2.4 кг' }
      ],
      desc: 'Lenovo Legion 5 — золотой стандарт среди игровых ноутбуков среднего класса. Видеокарта RTX 3060 тянет все современные игры на высоких настройках, а 165 Гц экран обеспечивает плавную картинку. Отличная система охлаждения. Батарея держит 4–5 часов, но для игр рекомендуем играть от розетки.'
    },
    creative: {
      headerClass: 'creative',
      icon: 'fa-palette',
      title: 'Для творчества и дизайна',
      subtitle: 'Яркий экран и мощное железо для фото, видео и графики',
      model: 'Apple MacBook Air 15″ (M2)',
      price: '≈ 105 000 – 135 000 ₽',
      specs: [
        { icon: 'fa-microchip', label: 'Процессор', value: 'Apple M2 (8 ядер)' },
        { icon: 'fa-memory', label: 'ОЗУ', value: '8 ГБ (унифицированная)' },
        { icon: 'fa-hard-drive', label: 'SSD', value: '256 ГБ' },
        { icon: 'fa-desktop', label: 'Экран', value: '15.3″ Liquid Retina' },
        { icon: 'fa-battery-full', label: 'Батарея', value: 'до 18 часов' },
        { icon: 'fa-weight-scale', label: 'Вес', value: '1.51 кг' }
      ],
      desc: 'MacBook Air M2 — мечта фотографа, видеомонтажёра и дизайнера. Невероятно яркий и точный экран (P3, 500 нит), бесшумная работа без вентилятора и рекордная автономность. Для серьёзного видеомонтажа в 4K рекомендуем версию с 16 ГБ ОЗУ. Альтернатива на Windows: ASUS VivoBook Pro 15 OLED (≈ 90 000 ₽).'
    }
  };

  /* ---- show result ---- */
  window.showResult = function () {
    var category = determineResult();
    var rec = recommendations[category];

    questions.forEach(function (c) { c.classList.remove('active'); });

    var quizNav = document.querySelector('.quiz-nav');
    var progressWrapper = document.querySelector('.progress-wrapper');
    if (quizNav) quizNav.style.display = 'none';
    if (progressWrapper) progressWrapper.style.display = 'none';

    var header = document.getElementById('result-header');
    if (header) {
      header.className = 'result-header ' + rec.headerClass;
      var iconEl = document.getElementById('result-icon');
      if (iconEl) iconEl.className = 'fas ' + rec.icon;

      var titleEl = document.getElementById('result-title');
      if (titleEl) titleEl.textContent = rec.title;

      var subEl = document.getElementById('result-subtitle');
      if (subEl) subEl.textContent = rec.subtitle;
    }

    var modelNameEl = document.getElementById('model-name');
    if (modelNameEl) modelNameEl.textContent = rec.model;

    var modelPriceEl = document.getElementById('model-price');
    if (modelPriceEl) modelPriceEl.textContent = rec.price;

    var descEl = document.getElementById('result-desc');
    if (descEl) descEl.textContent = rec.desc;

    var specsGrid = document.getElementById('specs-grid');
    if (specsGrid) {
      specsGrid.innerHTML = rec.specs.map(function (s) {
        return '<div class="spec-item">'
          + '<i class="fas ' + s.icon + '"></i>'
          + '<div class="spec-label">' + s.label + '</div>'
          + '<div class="spec-value">' + s.value + '</div>'
          + '</div>';
      }).join('');
    }

    var resultCard = document.getElementById('result-card');
    if (resultCard) resultCard.classList.add('active');
  };

  /* ---- restart ---- */
  window.restartQuiz = function () {
    answers = [null, null, null, null];
    currentQuestion = 0;

    document.querySelectorAll('.option-btn').forEach(function (b) {
      b.classList.remove('selected');
    });

    questions.forEach(function (c) { c.classList.remove('active'); });
    questions[0].classList.add('active');

    var quizNav = document.querySelector('.quiz-nav');
    var progressWrapper = document.querySelector('.progress-wrapper');
    if (quizNav) quizNav.style.display = 'flex';
    if (progressWrapper) progressWrapper.style.display = 'block';

    var resultCard = document.getElementById('result-card');
    if (resultCard) resultCard.classList.remove('active');

    updateButtons();
  };

  // Init buttons
  updateButtons();
})();