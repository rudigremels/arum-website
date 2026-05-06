/* =====================================================
   Arum House — vanilla JS
   ===================================================== */

(function () {
  'use strict';

  // ---------------------------------------------------
  // Year in footer
  // ---------------------------------------------------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------------------------------------------------
  // Sticky nav state
  // ---------------------------------------------------
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 80) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------------------------------------------------
  // Side-drawer menu
  // ---------------------------------------------------
  const menu = document.getElementById('menu');
  const menuOpen = document.getElementById('menuOpen');
  const menuClose = document.getElementById('menuClose');
  const openMenu = () => {
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  if (menuOpen) menuOpen.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  if (menu) {
    menu.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', closeMenu);
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu && menu.classList.contains('is-open')) closeMenu();
  });

  // ---------------------------------------------------
  // Reveal on scroll (eyebrow, displays, lede, etc.)
  // ---------------------------------------------------
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // ---------------------------------------------------
  // Chapters — load images + reveal-on-scroll for the
  // image scale + caption fade-up
  // ---------------------------------------------------
  const chapters = document.querySelectorAll('.chapter');
  chapters.forEach((c) => {
    const src = c.getAttribute('data-img');
    const img = c.querySelector('.chapter__media img');
    if (img && src) img.src = src;
  });

  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('is-visible');
        else e.target.classList.remove('is-visible');
      });
    }, { threshold: 0.4 });
    chapters.forEach((c) => cio.observe(c));
  } else {
    chapters.forEach((c) => c.classList.add('is-visible'));
  }

  // ---------------------------------------------------
  // Reviews carousel
  // ---------------------------------------------------
  const slides = document.querySelectorAll('.quote__slide');
  const dotsWrap = document.getElementById('quoteDots');
  let qIndex = 0;
  let qTimer;

  if (slides.length && dotsWrap) {
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Go to review ' + (i + 1));
      if (i === 0) b.classList.add('is-active');
      b.addEventListener('click', () => goToSlide(i, true));
      dotsWrap.appendChild(b);
    });

    const goToSlide = (i, manual) => {
      qIndex = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('is-active', k === qIndex));
      dotsWrap.querySelectorAll('button').forEach((d, k) =>
        d.classList.toggle('is-active', k === qIndex)
      );
      if (manual) restart();
    };
    const next = () => goToSlide(qIndex + 1);
    const restart = () => {
      clearInterval(qTimer);
      qTimer = setInterval(next, 7000);
    };
    restart();
  }

  // ---------------------------------------------------
  // Photo set + lightbox (View all photographs)
  // ---------------------------------------------------
  const ENC = (s) => s.split('/').map(encodeURIComponent).join('/');
  const photos = [
    { src: 'assets/all images/1 EXT/1 Ext 1.jpg',                       caption: 'Exterior I' },
    { src: 'assets/all images/1 EXT/2 Ext 2.jpg',                       caption: 'Exterior II' },
    { src: 'assets/all images/1 EXT/Ext 3.jpg',                         caption: 'Garden & Pool' },
    { src: 'assets/all images/1 EXT/Ext 4.jpg',                         caption: 'Garden' },
    { src: 'assets/all images/1 EXT/Ext 5.jpg',                         caption: 'Outdoors' },
    { src: 'assets/all images/1 EXT/Ext 6.jpg',                         caption: 'Garden detail' },
    { src: 'assets/all images/1 EXT/Ext 7.JPG',                         caption: 'Exterior detail' },
    { src: 'assets/all images/2 LIVING SPACE/Living Space 1.jpg',       caption: 'Living Room' },
    { src: 'assets/all images/2 LIVING SPACE/Living Space 2.jpg',       caption: 'Living Room' },
    { src: 'assets/all images/2 LIVING SPACE/Living Space 3.jpg',       caption: 'Living Room' },
    { src: 'assets/all images/2 LIVING SPACE/Living Space 4.jpg',       caption: 'Dining' },
    { src: 'assets/all images/2 LIVING SPACE/Living Space 5.JPG',       caption: 'Living' },
    { src: 'assets/all images/2 LIVING SPACE/Living Space 6.jpg',       caption: 'Living' },
    { src: 'assets/all images/2 LIVING SPACE/Living Space 7.jpg',       caption: 'Kitchen' },
    { src: 'assets/all images/2 LIVING SPACE/Living Space 8.jpg',       caption: 'Kitchen' },
    { src: 'assets/all images/2 LIVING SPACE/Living Space 9.JPG',       caption: 'Kitchen' },
    { src: 'assets/all images/2 LIVING SPACE/Living Space 10.JPG',      caption: 'Lounge' },
    { src: 'assets/all images/2 LIVING SPACE/Living Space 11.jpg',      caption: 'Lounge' },
    { src: 'assets/all images/2 LIVING SPACE/Living Space 12.jpg',      caption: 'Lounge' },
    { src: 'assets/all images/3 MASTER BEDROOM/Master Bedroom 1.JPG',   caption: 'Master Bedroom' },
    { src: 'assets/all images/3 MASTER BEDROOM/Master Bedroom 2.jpg',   caption: 'Master Bedroom' },
    { src: 'assets/all images/3 MASTER BEDROOM/Master Bedroom 3.jpg',   caption: 'Master Bedroom' },
    { src: 'assets/all images/3 MASTER BEDROOM/Master Bedroom 4.jpg',   caption: 'Master Bedroom' },
    { src: 'assets/all images/3 MASTER BEDROOM/Master Bedroom Balcony.JPG', caption: 'Master Balcony' },
    { src: 'assets/all images/3 MASTER BEDROOM/Master En Suite 1.jpg',  caption: 'Master En Suite' },
    { src: 'assets/all images/4 BEDROOM 2/Bedroom 2 1.jpg',             caption: 'Bedroom 2' },
    { src: 'assets/all images/4 BEDROOM 2/Bedroom 2 2.JPG',             caption: 'Bedroom 2' },
    { src: 'assets/all images/4 BEDROOM 2/Bedroom 2 En Suite.JPG',      caption: 'Bedroom 2 En Suite' },
    { src: 'assets/all images/5 BEDROOM 3/Bedroom 3_1.JPG',             caption: 'Bedroom 3' },
    { src: 'assets/all images/5 BEDROOM 3/Bedroom 3_2.JPG',             caption: 'Bedroom 3' },
    { src: 'assets/all images/6 BEDROOM 4/Shared Bedroom 1.JPG',        caption: 'Bedroom 4' },
    { src: 'assets/all images/6 BEDROOM 4/Shared Bedroom 2.JPG',        caption: 'Bedroom 4' },
    { src: 'assets/all images/7 OTHER BATHROOMS/Shared Bathroom 1.JPG', caption: 'Bathroom' },
    { src: 'assets/all images/7 OTHER BATHROOMS/Guest WC.JPG',          caption: 'Guest WC' }
  ];

  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbCap = document.getElementById('lightboxCaption');
  const lbCounter = document.getElementById('lightboxCounter');
  const viewAllBtn = document.getElementById('viewAllPhotos');
  let lbIndex = 0;

  const showImage = () => {
    const p = photos[lbIndex];
    lbImg.src = ENC(p.src);
    lbImg.alt = p.caption;
    lbCap.textContent = p.caption;
    lbCounter.textContent = (lbIndex + 1) + ' / ' + photos.length;
  };
  const openLightbox = (i) => {
    lbIndex = i || 0;
    showImage();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  const nextImage = () => { lbIndex = (lbIndex + 1) % photos.length; showImage(); };
  const prevImage = () => { lbIndex = (lbIndex - 1 + photos.length) % photos.length; showImage(); };

  if (viewAllBtn) viewAllBtn.addEventListener('click', () => openLightbox(0));
  if (lightbox) {
    lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox__nav--next').addEventListener('click', nextImage);
    lightbox.querySelector('.lightbox__nav--prev').addEventListener('click', prevImage);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    });
  }

  // ---------------------------------------------------
  // Availability calendar — fetches /api/availability,
  // renders 3 months, click a free day to set check-in.
  // ---------------------------------------------------
  const cal = document.getElementById('cal');
  const calMonths = document.getElementById('calMonths');

  const ymd = (d) => {
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  };

  const buildBookedSet = (bookings) => {
    const set = new Set();
    for (const b of bookings || []) {
      const s = new Date(b.start + 'T00:00:00');
      const e = new Date(b.end + 'T00:00:00');
      // DTEND is exclusive — last booked night is the day before DTEND
      for (let d = new Date(s); d < e; d.setDate(d.getDate() + 1)) {
        set.add(ymd(d));
      }
    }
    return set;
  };

  const monthName = (d) =>
    d.toLocaleString('en-GB', { month: 'long' }).toUpperCase();

  const renderMonth = (year, month, booked, todayStr) => {
    const first = new Date(year, month, 1);
    const last  = new Date(year, month + 1, 0);
    const offset = (first.getDay() + 6) % 7; // Mon-first
    const div = document.createElement('div');
    div.className = 'cal-month';

    const head = document.createElement('p');
    head.className = 'cal-month__head';
    head.innerHTML = monthName(first) + ' <em>' + first.getFullYear() + '</em>';
    div.appendChild(head);

    const wd = document.createElement('div');
    wd.className = 'cal-month__weekdays';
    ['M','T','W','T','F','S','S'].forEach(c => {
      const s = document.createElement('span');
      s.textContent = c;
      wd.appendChild(s);
    });
    div.appendChild(wd);

    const grid = document.createElement('div');
    grid.className = 'cal-month__grid';

    for (let i = 0; i < offset; i++) {
      const e = document.createElement('span');
      e.className = 'cal-day cal-day--empty';
      grid.appendChild(e);
    }

    for (let day = 1; day <= last.getDate(); day++) {
      const d = new Date(year, month, day);
      const key = ymd(d);
      const isPast = key < todayStr;
      const isToday = key === todayStr;
      const isBusy = booked.has(key);
      const isFree = !isBusy && !isPast;

      const cell = document.createElement(isFree ? 'button' : 'span');
      cell.className = 'cal-day';
      if (isFree) cell.type = 'button';
      cell.textContent = day;
      if (isPast) cell.classList.add('cal-day--past');
      else if (isBusy) cell.classList.add('cal-day--busy');
      else cell.classList.add('cal-day--free');
      if (isToday) cell.classList.add('cal-day--today');
      cell.dataset.date = key;

      if (isFree) {
        cell.addEventListener('click', () => selectDay(key, cell));
      }

      grid.appendChild(cell);
    }
    div.appendChild(grid);
    return div;
  };

  const selectDay = (dateStr, cell) => {
    document.querySelectorAll('.cal-day--selected').forEach(el =>
      el.classList.remove('cal-day--selected')
    );
    cell.classList.add('cal-day--selected');
    const checkin = document.querySelector('input[name="checkin"]');
    if (checkin) {
      checkin.value = dateStr;
      checkin.dispatchEvent(new Event('change'));
    }
  };

  const renderCalendar = (booked) => {
    if (!calMonths) return;
    calMonths.innerHTML = '';
    const today = new Date();
    const todayStr = ymd(today);
    for (let i = 0; i < 3; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
      calMonths.appendChild(renderMonth(d.getFullYear(), d.getMonth(), booked, todayStr));
    }
  };

  if (cal) {
    fetch('/api/availability')
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => {
        const booked = buildBookedSet(data.bookings);
        renderCalendar(booked);
        cal.dataset.state = (booked.size === 0 && data.note) ? 'empty' : 'ok';
        if (cal.dataset.state === 'empty') {
          calMonths.innerHTML = '<p class="cal__loading">All dates currently shown as available — please confirm via enquiry.</p>';
        }
      })
      .catch(() => {
        cal.dataset.state = 'error';
        calMonths.innerHTML = '<p class="cal__loading">Calendar unavailable — please send an enquiry below.</p>';
      });
  }

  // ---------------------------------------------------
  // Form
  // ---------------------------------------------------
  const form = document.getElementById('enquiryForm');
  const status = document.getElementById('formStatus');

  if (form) {
    const todayStr = new Date().toISOString().split('T')[0];
    const checkin = form.querySelector('input[name="checkin"]');
    const checkout = form.querySelector('input[name="checkout"]');
    if (checkin) checkin.min = todayStr;
    if (checkout) checkout.min = todayStr;
    if (checkin && checkout) {
      checkin.addEventListener('change', () => {
        checkout.min = checkin.value || todayStr;
        if (checkout.value && checkout.value < checkin.value) checkout.value = '';
      });
    }

    form.addEventListener('submit', async (e) => {
      const action = form.getAttribute('action') || '';
      if (action.indexOf('YOUR_FORM_ID') !== -1) {
        e.preventDefault();
        status.className = 'form__status is-error';
        status.textContent = 'Form endpoint not configured yet — set the action URL in index.html.';
        return;
      }

      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;
      status.className = 'form__status';
      status.textContent = '';

      try {
        const data = new FormData(form);
        const res = await fetch(action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          form.reset();
          status.className = 'form__status is-success';
          status.textContent = 'Thank you — your enquiry is on its way. We’ll be in touch within a day.';
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (err) {
        status.className = 'form__status is-error';
        status.textContent = 'Something went wrong. Please email rudigremels1@gmail.com directly.';
      } finally {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
      }
    });
  }
})();
