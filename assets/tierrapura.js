/**
 * Tierrapura - Vanilla JS replacements for Webflow runtime
 * Handles: Navbar, Slider, Smooth Scroll, Carousel Image Init
 */
(function () {
  'use strict';

  // ── Navbar ──────────────────────────────────────────────
  function initNavbars() {
    document.querySelectorAll('.w-nav').forEach(function (nav) {
      var btn = nav.querySelector('.w-nav-button');
      var menu = nav.querySelector('.w-nav-menu');
      if (!btn || !menu) return;

      var duration = parseInt(nav.dataset.duration, 10) || 400;
      var overlay = null;
      var isOpen = false;

      function open() {
        isOpen = true;
        btn.classList.add('w--open');
        btn.setAttribute('aria-expanded', 'true');
        menu.setAttribute('data-nav-menu-open', '');

        // Create overlay
        overlay = document.createElement('div');
        overlay.className = 'w-nav-overlay';
        overlay.style.height = '100vh';
        overlay.style.display = 'block';
        nav.appendChild(overlay);

        // Clone menu into overlay for Webflow CSS compatibility
        var menuClone = menu.cloneNode(true);
        menuClone.setAttribute('data-nav-menu-open', '');
        overlay.appendChild(menuClone);

        // Animate overlay height
        overlay.style.transition = 'height ' + duration + 'ms ease';
        overlay.style.height = '0px';
        // Force reflow then set target height
        overlay.offsetHeight;
        overlay.style.height = menuClone.scrollHeight + 'px';

        // Close on overlay link click
        menuClone.querySelectorAll('a').forEach(function (a) {
          a.addEventListener('click', close);
        });
        overlay.addEventListener('click', function (e) {
          if (e.target === overlay) close();
        });
      }

      function close() {
        if (!isOpen) return;
        isOpen = false;
        btn.classList.remove('w--open');
        btn.setAttribute('aria-expanded', 'false');
        menu.removeAttribute('data-nav-menu-open');
        if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
          overlay = null;
        }
      }

      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (isOpen) close(); else open();
      });

      // Close on Escape
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') close();
      });

      // Close on resize to desktop
      var collapseAt = nav.dataset.collapse === 'medium' ? 992 :
                       nav.dataset.collapse === 'small' ? 768 : 480;
      window.addEventListener('resize', function () {
        if (window.innerWidth >= collapseAt) close();
      });
    });
  }

  // ── Slider ──────────────────────────────────────────────
  function initSliders() {
    document.querySelectorAll('.w-slider').forEach(function (slider) {
      var mask = slider.querySelector('.w-slider-mask');
      var slides = Array.prototype.slice.call(mask.querySelectorAll('.w-slide'));
      var leftArrow = slider.querySelector('.w-slider-arrow-left');
      var rightArrow = slider.querySelector('.w-slider-arrow-right');
      var navContainer = slider.querySelector('.w-slider-nav');

      if (slides.length === 0) return;

      var duration = parseInt(slider.dataset.duration, 10) || 500;
      var infinite = slider.dataset.infinite !== 'false';
      var autoplay = slider.dataset.autoplay === 'true';
      var delay = parseInt(slider.dataset.delay, 10) || 4000;
      var hideArrows = slider.dataset.hideArrows === 'true';
      var current = 0;
      var autoplayTimer = null;

      // Setup mask for horizontal sliding
      mask.style.overflow = 'hidden';
      mask.style.position = 'relative';

      // Measure and position slides
      function layoutSlides() {
        var w = mask.offsetWidth;
        slides.forEach(function (slide, i) {
          slide.style.position = 'absolute';
          slide.style.top = '0';
          slide.style.left = '0';
          slide.style.width = w + 'px';
          slide.style.height = '100%';
          slide.style.transform = 'translateX(' + (i * 100) + '%)';
          slide.style.transition = 'transform ' + duration + 'ms ease';
        });
      }

      function goTo(index) {
        if (!infinite) {
          index = Math.max(0, Math.min(index, slides.length - 1));
        } else {
          if (index < 0) index = slides.length - 1;
          if (index >= slides.length) index = 0;
        }
        current = index;
        slides.forEach(function (slide, i) {
          slide.style.transform = 'translateX(' + ((i - current) * 100) + '%)';
        });
        updateNav();
        updateArrows();
      }

      // Navigation dots
      var dots = [];
      function buildNav() {
        if (!navContainer || slides.length < 2) return;
        navContainer.innerHTML = '';
        slides.forEach(function (_, i) {
          var dot = document.createElement('div');
          dot.className = 'w-slider-dot' + (i === 0 ? ' w-active' : '');
          dot.setAttribute('aria-label', 'Show slide ' + (i + 1) + ' of ' + slides.length);
          dot.setAttribute('role', 'button');
          dot.setAttribute('tabindex', '0');
          dot.addEventListener('click', function () { goTo(i); resetAutoplay(); });
          navContainer.appendChild(dot);
          dots.push(dot);
        });
      }

      function updateNav() {
        dots.forEach(function (dot, i) {
          if (i === current) dot.classList.add('w-active');
          else dot.classList.remove('w-active');
        });
      }

      function updateArrows() {
        if (hideArrows || !leftArrow || !rightArrow) return;
        if (!infinite) {
          leftArrow.style.display = current === 0 ? 'none' : '';
          rightArrow.style.display = current === slides.length - 1 ? 'none' : '';
        }
      }

      // Arrow clicks
      if (leftArrow) {
        leftArrow.addEventListener('click', function () { goTo(current - 1); resetAutoplay(); });
      }
      if (rightArrow) {
        rightArrow.addEventListener('click', function () { goTo(current + 1); resetAutoplay(); });
      }

      // Touch / swipe
      var touchStartX = 0;
      var touchStartY = 0;
      mask.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });
      mask.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - touchStartX;
        var dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
          if (dx < 0) goTo(current + 1);
          else goTo(current - 1);
          resetAutoplay();
        }
      }, { passive: true });

      // Autoplay
      function startAutoplay() {
        if (!autoplay || slides.length < 2) return;
        autoplayTimer = setInterval(function () { goTo(current + 1); }, delay);
      }
      function resetAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
        startAutoplay();
      }

      // Resize handler
      window.addEventListener('resize', function () { layoutSlides(); goTo(current); });

      // Init
      layoutSlides();
      buildNav();
      goTo(0);
      startAutoplay();
    });
  }

  // ── Smooth Scroll ───────────────────────────────────────
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href*="#"]');
      if (!link) return;

      var href = link.getAttribute('href');
      var hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;

      var hash = href.substring(hashIndex + 1);
      if (!hash) return;

      // Only handle same-page anchors
      var path = href.substring(0, hashIndex);
      if (path && path !== window.location.pathname &&
          path !== window.location.pathname.replace(/\.html$/, '') &&
          !path.endsWith(window.location.pathname.split('/').pop())) return;

      var target = document.getElementById(hash) ||
                   document.querySelector('[name="' + hash + '"]');
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, '', '#' + hash);
      }
    });
  }

  // ── Carousel Image Init (replaces jQuery in proyectos pages) ──
  function initCarouselImages() {
    var slider = document.getElementById('MultiImageSlider');
    var collectionWrapper = document.getElementById('MultiImageCollectionWrapper');
    if (!slider || !collectionWrapper) return;

    slider.style.opacity = '0';
    var images = collectionWrapper.querySelectorAll('.w-dyn-item');
    var slides = slider.querySelectorAll('.w-slide');

    if (!images.length) {
      slider.parentNode.removeChild(slider);
    } else {
      var imgCount = Math.min(images.length, slides.length);

      for (var i = 0; i < imgCount; i++) {
        slides[i].style.backgroundImage = images[i].style.backgroundImage;
      }
      // Remove excess slides
      for (var i = slides.length - 1; i >= imgCount; i--) {
        slides[i].parentNode.removeChild(slides[i]);
      }
      // Remove arrows/nav if only one image
      if (imgCount < 2) {
        var toRemove = slider.querySelectorAll('.w-slider-arrow-left, .w-slider-arrow-right, .w-slider-nav');
        toRemove.forEach(function (el) { el.parentNode.removeChild(el); });
      }
      slider.style.opacity = '1';
    }
    collectionWrapper.parentNode.removeChild(collectionWrapper);
  }

  // ── Boot ────────────────────────────────────────────────
  function init() {
    initCarouselImages();
    initNavbars();
    initSliders();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
