/* ============================================================
   TAAL Indian Kitchen & Bar — Menu JS
   ============================================================ */

(function () {
  'use strict';

  /* ── TAB SWITCHING
  ──────────────────────────────────────────────────── */
  const tabs   = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      /* Update tab states */
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      /* Update panel states */
      panels.forEach(panel => {
        if (panel.id === 'tab-' + target) {
          panel.classList.add('active');
          /* Re-apply active filter when switching tabs */
          applyFilter(activeFilter);
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  /* ── DIETARY FILTERING
  ──────────────────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  let activeFilter = 'all';

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter;

      /* Update button states */
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      applyFilter(activeFilter);
    });
  });

  function applyFilter(filter) {
    /* Only operate on the active panel */
    const activePanel = document.querySelector('.menu-panel.active');
    if (!activePanel) return;

    const items = activePanel.querySelectorAll('.menu-item');

    items.forEach(item => {
      if (filter === 'all') {
        showItem(item);
        return;
      }
      const tags = (item.dataset.tags || '').split(' ').map(t => t.trim()).filter(Boolean);
      if (tags.includes(filter)) {
        showItem(item);
      } else {
        hideItem(item);
      }
    });
  }

  function showItem(el) {
    el.classList.remove('hidden');
  }

  function hideItem(el) {
    el.classList.add('hidden');
  }

  /* ── SPICE LEVEL TOOLTIPS
  ──────────────────────────────────────────────────── */
  const spiceLevels = document.querySelectorAll('.spice-level');
  const labels = { 1: 'Mild', 2: 'Medium', 3: 'Spicy', 4: 'Very Spicy' };

  spiceLevels.forEach(el => {
    const level = parseInt(el.dataset.level || '0');
    if (labels[level]) {
      el.setAttribute('title', labels[level]);
      el.setAttribute('aria-label', `Spice level: ${labels[level]}`);
    }
  });

  /* ── MENU ITEM ENTRANCE ANIMATION
  ──────────────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    const itemObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 50);
          itemObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.menu-item').forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(16px)';
      item.style.transition = 'opacity 0.5s ease, transform 0.5s ease, border-color 0.3s ease, background 0.3s ease';
      itemObserver.observe(item);
    });
  }

  /* ── MOBILE: tap to expand menu item description
  ──────────────────────────────────────────────────── */
  if (window.matchMedia('(max-width: 640px)').matches) {
    document.querySelectorAll('.menu-item-desc').forEach(desc => {
      const parent = desc.closest('.menu-item');
      if (!parent) return;
      desc.style.display = 'none';
      parent.style.cursor = 'pointer';
      parent.addEventListener('click', () => {
        desc.style.display = desc.style.display === 'none' ? '' : 'none';
      });
    });
  }

  /* ── SWIPEABLE MENU TABS + DOT INDICATORS
  ──────────────────────────────────────────────────── */
  const menuTabsContainer = document.querySelector('.menu-tabs');

  /* Build dot row */
  const dotWrap = document.createElement('div');
  dotWrap.className = 'menu-tab-dots';
  Array.from(tabs).forEach((_, i) => {
    const d = document.createElement('span');
    d.className = 'menu-tab-dot' + (i === 0 ? ' active' : '');
    dotWrap.appendChild(d);
  });
  if (menuTabsContainer) menuTabsContainer.insertAdjacentElement('afterend', dotWrap);

  const dots = dotWrap.querySelectorAll('.menu-tab-dot');

  function syncDots() {
    const activeIdx = Array.from(tabs).findIndex(t => t.classList.contains('active'));
    dots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
    if (window.innerWidth <= 768 && tabs[activeIdx]) {
      tabs[activeIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  tabs.forEach(tab => tab.addEventListener('click', syncDots));

  /* Touch swipe handler */
  const menuContentEl = document.querySelector('.menu-content');
  if (menuContentEl) {
    let swipeX = 0;
    let swipeY = 0;

    menuContentEl.addEventListener('touchstart', e => {
      swipeX = e.changedTouches[0].clientX;
      swipeY = e.changedTouches[0].clientY;
    }, { passive: true });

    menuContentEl.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - swipeX;
      const dy = e.changedTouches[0].clientY - swipeY;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;

      const tabArr  = Array.from(tabs);
      const curIdx  = tabArr.findIndex(t => t.classList.contains('active'));
      const nextIdx = dx < 0
        ? Math.min(curIdx + 1, tabArr.length - 1)
        : Math.max(curIdx - 1, 0);
      if (nextIdx === curIdx) return;

      const slideClass = dx < 0 ? 'slide-from-right' : 'slide-from-left';
      tabArr[nextIdx].click();

      const nextPanel = document.getElementById('tab-' + tabArr[nextIdx].dataset.tab);
      if (nextPanel) {
        nextPanel.classList.add(slideClass);
        nextPanel.addEventListener('animationend', () => nextPanel.classList.remove(slideClass), { once: true });
      }
    }, { passive: true });
  }

})();
