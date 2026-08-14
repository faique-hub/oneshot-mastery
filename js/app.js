(function () {
  'use strict';

  // =========================
  // 1. CATEGORIES
  // =========================

  const categories = [
    { id: 'note', label: 'Notes', badge: 'badge-note', folder: 'notes' },
    { id: 'revision', label: 'Revision Notes', badge: 'badge-short', folder: 'revision-notes' },
    { id: 'toppers_notes', label: 'Toppers Notes', badge: 'badge-mind', folder: 'toppers-notes' },
    { id: 'important', label: 'Important Questions', badge: 'badge-pyq', folder: 'important-questions' },
    { id: 'value_based', label: 'Value Based Questions', badge: 'badge-note', folder: 'value-based-questions' },
    { id: 'competency', label: 'Competency Based Questions', badge: 'badge-short', folder: 'competency-based-questions' },
    { id: 'repeated', label: 'Most Repeated Questions', badge: 'badge-mind', folder: 'most-repeated-questions' },
    { id: 'case_study', label: 'Case Study Based Questions', badge: 'badge-pyq', folder: 'case-study-based-questions' },
    { id: 'assertion_reason', label: 'Assertion & Reason', badge: 'badge-note', folder: 'assertion-reason' },
    { id: 'toppers_answers', label: 'Toppers Answer Sheets', badge: 'badge-short', folder: 'toppers-answer-sheets' },
    { id: 'mcq', label: 'MCQ Questions', badge: 'badge-mind', folder: 'mcq-questions' },
    { id: 'sample', label: 'Sample Papers', badge: 'badge-pyq', folder: 'sample-papers' },
    { id: 'pyq', label: 'PYQs', badge: 'badge-note', folder: 'pyqs' },
    { id: 'question_bank', label: 'Question Bank', badge: 'badge-short', folder: 'question-bank' }
  ];

  // =========================
  // 2. SUBJECT COLORS
  // =========================

  const subjectColors = [
    '#E8B75E',
    '#7FBF9E',
    '#9C8CFF',
    '#FF6B5E',
    '#6FB3D9',
    '#D98CC0'
  ];

  // =========================
  // 3. WEBSITE DATA
  // =========================

  const files = Array.isArray(window.REVISE_CONTENT)
    ? window.REVISE_CONTENT
    : [];

  let subjects = (window.REVISE_SUBJECTS || []).slice();

  // If subject list is missing, create it from files
  if (subjects.length === 0) {
    const foundSubjects = {};

    files.forEach(function (file) {
      if (!foundSubjects[file.subject]) {
        foundSubjects[file.subject] = true;
        subjects.push(file.subject);
      }
    });
  }

  // Default subjects
  if (subjects.length === 0) {
    subjects = [
      'English',
      'Hindi',
      'Mathematics',
      'Science',
      'Social Science'
    ];
  }

  // Currently selected subject and category
  let currentSubject = subjects[0];
  let currentCategory = 'note';

  // =========================
  // 4. HELPER FUNCTIONS
  // =========================

  // Makes text safe before putting it inside HTML
  function safeText(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Finds category information using category id
  function getCategory(categoryId) {
    return categories.find(function (category) {
      return category.id === categoryId;
    }) || categories[0];
  }

  // Returns category name in capital letters
  function getBadgeText(categoryId) {
    return getCategory(categoryId).label.toUpperCase();
  }

  // Returns PDFs of currently selected subject + category
  function getCurrentFiles() {
    return files.filter(function (file) {
      return (
        file.subject === currentSubject &&
        file.type === currentCategory
      );
    });
  }

  // =========================
  // 5. MAIN RENDER FUNCTION
  // =========================

  function renderWebsite() {
    renderSidebar();
    renderSubjectHeader();
    renderCategories();
    renderCards();
  }

  // =========================
  // 6. SUBJECT HEADER
  // =========================

  function renderSubjectHeader() {
    const title = document.getElementById('subjectTitle');
    const subtitle = document.getElementById('subjectSub');

    const totalSubjectFiles = files.filter(function (file) {
      return file.subject === currentSubject;
    }).length;

    title.textContent = currentSubject;
    subtitle.textContent =
      totalSubjectFiles + ' PDFs saved in this subject';
  }

  // =========================
  // 7. CATEGORY BUTTONS
  // =========================

  function renderCategories() {
    const categoryBox = document.getElementById('categoryTabs');

    categoryBox.innerHTML = '';

    categories.forEach(function (category) {
      const count = files.filter(function (file) {
        return (
          file.subject === currentSubject &&
          file.type === category.id
        );
      }).length;

      const button = document.createElement('div');

      button.className =
        'tab' +
        (currentCategory === category.id ? ' active' : '');

      button.innerHTML =
        safeText(category.label) +
        ' <span class="count">' +
        count +
        '</span>';

      button.onclick = function () {
        currentCategory = category.id;
        renderWebsite();
      };

      categoryBox.appendChild(button);
    });
  }

  // =========================
  // 8. PDF CARDS
  // =========================

  function renderCards() {
    const cardsGrid = document.getElementById('cardsGrid');
    const currentFiles = getCurrentFiles();

    cardsGrid.innerHTML = '';

    // Show empty message if there are no PDFs
    if (currentFiles.length === 0) {
      const category = getCategory(currentCategory);

      cardsGrid.innerHTML =
        '<div class="empty-state">' +
          '<div class="es-icon">📄</div>' +
          '<div class="es-title">No ' +
            safeText(category.label) +
            ' yet</div>' +
          '<div class="es-sub mono">' +
            'Put PDF files in content/' +
            safeText(category.folder) +
            '/' +
            safeText(currentSubject) +
          '</div>' +
        '</div>';

      return;
    }

    // Create one card for every PDF
    currentFiles.forEach(function (file) {
      const card = document.createElement('div');
      const category = getCategory(file.type);

      card.className = 'card file-card';

      card.innerHTML =
        '<div class="card-top">' +
          '<div class="card-title">📄 ' +
            safeText(file.title) +
          '</div>' +
          '<span class="card-badge ' +
            category.badge +
          '">' +
            safeText(getBadgeText(file.type)) +
          '</span>' +
        '</div>' +
        '<div class="card-tag">PDF</div>' +
        '<div class="card-snippet">' +
          safeText(file.filename || file.path) +
        '</div>' +
        '<div class="file-actions">' +
          '<button class="file-btn preview-button">' +
            'Preview / Open' +
          '</button>' +
          '<a class="file-btn" href="' +
            encodeURI(file.path) +
            '" download>' +
            'Download' +
          '</a>' +
        '</div>';

      const previewButton =
        card.querySelector('.preview-button');

      previewButton.onclick = function (event) {
        event.stopPropagation();
        openPdfPreview(file);
      };

      cardsGrid.appendChild(card);
    });
  }

  // =========================
  // 9. SIDEBAR
  // =========================

  function renderSidebar() {
    const subjectList =
      document.getElementById('subjectList');

    subjectList.innerHTML = '';

    subjects.forEach(function (subject, index) {
      const subjectButton =
        document.createElement('div');

      const fileCount = files.filter(function (file) {
        return file.subject === subject;
      }).length;

      subjectButton.className =
        'subject-item' +
        (subject === currentSubject ? ' active' : '');

      subjectButton.innerHTML =
        '<span class="subj-dot" style="background:' +
          subjectColors[index % subjectColors.length] +
        '"></span>' +
        '<span class="subj-name">' +
          safeText(subject) +
        '</span>' +
        '<span class="subj-count">' +
          fileCount +
        '</span>';

      subjectButton.onclick = function () {
        currentSubject = subject;
        currentCategory = 'note';

        renderWebsite();
        closeSidebar();
      };

      subjectList.appendChild(subjectButton);
    });

    document.getElementById('statTotal').textContent =
      files.length;

    document.getElementById('statSubjects').textContent =
      subjects.length;
  }

  // =========================
  // 10. PDF PREVIEW
  // =========================

  function openPdfPreview(file) {
    const modalRoot =
      document.getElementById('modalRoot');

    modalRoot.innerHTML =
      '<div class="overlay" id="previewOverlay">' +
        '<div class="modal view-modal">' +
          '<h2>' +
            safeText(file.title) +
          '</h2>' +
          '<iframe class="preview-frame" src="' +
            encodeURI(file.path) +
          '"></iframe>' +
          '<div class="modal-actions">' +
            '<button class="btn" id="previewClose">' +
              'Close' +
            '</button>' +
            '<a class="btn primary" href="' +
              encodeURI(file.path) +
              '" target="_blank" rel="noopener">' +
              'Open' +
            '</a>' +
            '<a class="btn" href="' +
              encodeURI(file.path) +
              '" download>' +
              'Download' +
            '</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.getElementById('previewClose').onclick =
      closePdfPreview;

    document.getElementById('previewOverlay').onclick =
      function (event) {
        if (event.target.id === 'previewOverlay') {
          closePdfPreview();
        }
      };
  }

  function closePdfPreview() {
    document.getElementById('modalRoot').innerHTML = '';
  }

  // =========================
  // 11. SEARCH
  // =========================

  const searchInput =
    document.getElementById('searchInput');

  const searchResults =
    document.getElementById('searchResults');

  searchInput.addEventListener('input', function () {
    const searchText =
      searchInput.value.trim().toLowerCase();

    // Hide results if search is empty
    if (!searchText) {
      searchResults.style.display = 'none';
      return;
    }

    const matches = files
      .filter(function (file) {
        const searchableText =
          (file.title || '') +
          ' ' +
          (file.subject || '') +
          ' ' +
          (file.filename || '') +
          ' ' +
          getBadgeText(file.type);

        return searchableText
          .toLowerCase()
          .includes(searchText);
      })
      .slice(0, 12);

    if (matches.length === 0) {
      searchResults.innerHTML =
        '<div class="sr-empty">No matches</div>';
    } else {
      searchResults.innerHTML =
        matches.map(function (file, index) {
          return (
            '<div class="sr-item" data-index="' +
              index +
            '">' +
              '<div class="sr-title">' +
                safeText(file.title) +
              '</div>' +
              '<div class="sr-meta">' +
                safeText(file.subject) +
                ' · ' +
                safeText(getCategory(file.type).label) +
              '</div>' +
            '</div>'
          );
        }).join('');
    }

    const resultItems =
      searchResults.querySelectorAll('.sr-item');

    resultItems.forEach(function (item) {
      item.onclick = function () {
        const file =
          matches[Number(item.dataset.index)];

        currentSubject = file.subject;
        currentCategory = file.type;

        searchInput.value = '';
        searchResults.style.display = 'none';

        renderWebsite();
        openPdfPreview(file);
      };
    });

    searchResults.style.display = 'block';
  });

  // Hide search results when clicking outside search box
  document.addEventListener('click', function (event) {
    if (!event.target.closest('.search-wrap')) {
      searchResults.style.display = 'none';
    }
  });

  // =========================
  // 12. MOBILE SIDEBAR
  // =========================

  const sidebar =
    document.getElementById('sidebar');

  const sidebarBackground =
    document.getElementById('sidebarScrim');

  const menuButton =
    document.getElementById('hamburgerBtn');

  const closeButton =
    document.getElementById('sidebarClose');

  menuButton.onclick = function () {
    sidebar.classList.add('open');
    sidebarBackground.classList.add('show');
  };

  closeButton.onclick = closeSidebar;
  sidebarBackground.onclick = closeSidebar;

  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarBackground.classList.remove('show');
  }

  // =========================
  // 13. KEYBOARD
  // =========================

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closePdfPreview();
      closeSidebar();
    }
  });

  // =========================
  // 14. START WEBSITE
  // =========================

  renderWebsite();

})();