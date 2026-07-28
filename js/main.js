(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Toast
  ------------------------------------------------------------------ */
  var toastEl = document.getElementById('toast');
  var toastTimer = null;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('show');
    }, 2200);
  }

  /* ------------------------------------------------------------------
     Top-right popup menu
  ------------------------------------------------------------------ */
  var menuBtn = document.getElementById('menuBtn');
  var menuPopup = document.getElementById('menuPopup');

  function openMenu() {
    menuPopup.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    menuPopup.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu(e) {
    e.stopPropagation();
    if (menuPopup.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  menuBtn.addEventListener('click', toggleMenu);

  document.addEventListener('click', function (e) {
    if (!menuPopup.contains(e.target) && e.target !== menuBtn) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ------------------------------------------------------------------
     Copy Link / Share Link
  ------------------------------------------------------------------ */
  function copyCurrentUrl() {
    var url = window.location.href;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        showToast('Link copied to clipboard');
      }).catch(function () {
        fallbackCopy(url);
      });
    } else {
      fallbackCopy(url);
    }
  }

  function fallbackCopy(text) {
    var input = document.createElement('input');
    input.value = text;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, 99999);
    try {
      document.execCommand('copy');
      showToast('Link copied to clipboard');
    } catch (err) {
      showToast('Unable to copy link');
    }
    document.body.removeChild(input);
  }

  document.getElementById('copyLinkBtn').addEventListener('click', function () {
    copyCurrentUrl();
    closeMenu();
  });

  document.getElementById('shareLinkBtn').addEventListener('click', function () {
    var url = window.location.href;
    var shareData = {
      title: document.title,
      text: 'Check out DEWNAPAT',
      url: url
    };

    if (navigator.share) {
      navigator.share(shareData).catch(function () {
        /* user cancelled share sheet — no action needed */
      });
    } else {
      copyCurrentUrl();
    }
    closeMenu();
  });

  /* ------------------------------------------------------------------
     Scroll cue -> smooth scroll to links section
  ------------------------------------------------------------------ */
  var scrollCue = document.getElementById('scrollCue');
  var linksSection = document.getElementById('linksSection');

  if (scrollCue && linksSection) {
    scrollCue.addEventListener('click', function () {
      linksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ------------------------------------------------------------------
     Reveal-on-load (hero) using CSS var delay
  ------------------------------------------------------------------ */
  var heroReveals = document.querySelectorAll('.hero .reveal-fade');
  heroReveals.forEach(function (el) {
    var delay = el.getAttribute('data-delay') || 0;
    el.style.setProperty('--d', delay);
  });

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      heroReveals.forEach(function (el) {
        el.classList.add('visible');
      });
    });
  });

  /* ------------------------------------------------------------------
     Scroll-triggered staggered reveal for streaming buttons
  ------------------------------------------------------------------ */
  var linkButtons = document.querySelectorAll('.link-btn');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var index = Array.prototype.indexOf.call(linkButtons, entry.target);
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, index * 90);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    linkButtons.forEach(function (btn) {
      observer.observe(btn);
    });
  } else {
    linkButtons.forEach(function (btn) {
      btn.classList.add('visible');
    });
  }

})();
