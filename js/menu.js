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

})();
