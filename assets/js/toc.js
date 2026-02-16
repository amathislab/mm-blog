// Notion-style floating TOC: mini indicators collapse, hover to expand
(function () {
  var article = document.querySelector('d-article');
  var tocSidebar = document.getElementById('toc-sidebar');
  if (!article || !tocSidebar) return;

  var headings = Array.prototype.slice.call(article.querySelectorAll('h2, h3'));
  if (headings.length < 2) {
    tocSidebar.style.display = 'none';
    return;
  }

  // Build data
  var tocItems = [];
  headings.forEach(function (heading) {
    if (!heading.id) {
      heading.id = heading.textContent.trim().toLowerCase()
        .replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    }
    tocItems.push({
      el: heading,
      text: heading.textContent.trim(),
      level: heading.tagName.toLowerCase()
    });
  });

  // Generate mini indicators (collapsed view)
  var miniHtml = '<div class="toc-mini">';
  tocItems.forEach(function (_, i) {
    miniHtml += '<div class="toc-mini-bar toc-mini-dim" data-idx="' + i + '"></div>';
  });
  miniHtml += '</div>';

  // Generate full list (expanded view)
  var listHtml = '<div class="toc-list">';
  tocItems.forEach(function (item, i) {
    var indentClass = item.level === 'h3' ? ' toc-list-indent' : '';
    listHtml += '<div class="toc-list-item' + indentClass + '" data-idx="' + i + '" title="' +
      item.text.replace(/"/g, '&quot;') + '">' + item.text + '</div>';
  });
  listHtml += '</div>';

  tocSidebar.innerHTML = miniHtml + listHtml;

  // References
  var miniBars = tocSidebar.querySelectorAll('.toc-mini-bar');
  var listItems = tocSidebar.querySelectorAll('.toc-list-item');

  // Show/hide trigger
  var trigger = document.querySelector('d-byline') || article;
  var ticking = false;
  var lastActiveIndex = -1;

  function highlightActive(idx) {
    miniBars.forEach(function (bar, i) {
      bar.classList.toggle('toc-mini-dim', i !== idx);
    });
    listItems.forEach(function (item, i) {
      item.classList.toggle('toc-list-active', i === idx);
    });
  }

  function update() {
    // Visibility
    var triggerBottom = trigger.getBoundingClientRect().bottom;
    tocSidebar.classList.toggle('visible', triggerBottom < 0);

    // Scroll spy
    var activeIndex = 0;
    for (var i = 0; i < tocItems.length; i++) {
      if (tocItems[i].el.getBoundingClientRect().top <= 120) {
        activeIndex = i;
      }
    }

    if (activeIndex !== lastActiveIndex) {
      highlightActive(activeIndex);
      lastActiveIndex = activeIndex;
    }

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();

  // Click to navigate
  tocSidebar.addEventListener('click', function (e) {
    var idx = e.target.dataset.idx;
    if (idx !== undefined) {
      var target = tocItems[parseInt(idx)].el;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 80,
        behavior: 'smooth'
      });
    }
  });
})();
