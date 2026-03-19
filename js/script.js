document.addEventListener('DOMContentLoaded', () => {

    /* ─────────────────────────────────────────
       SCROLL PROGRESS BAR
    ───────────────────────────────────────── */
    const progressBar = document.getElementById('scroll-progress');
    function updateProgress() {
        if (!progressBar) return;
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = docHeight > 0 ? (scrollTop / docHeight * 100) + '%' : '0%';
    }

    /* ─────────────────────────────────────────
       NAVBAR
    ───────────────────────────────────────── */
    const navbar = document.getElementById('navbar');

    // Mark inner pages (non-index) as 'solid' always
    const isIndexPage = !document.body.classList.contains('inner-page');

    function updateNavbar() {
        if (isIndexPage) {
            if (window.scrollY > 60) {
                navbar.classList.add('scrolled');
                navbar.classList.remove('transparent');
            } else {
                navbar.classList.remove('scrolled');
            }
        } else {
            navbar.classList.add('solid');
        }
    }

    /* ─────────────────────────────────────────
       MOBILE NAV + BACKDROP
    ───────────────────────────────────────── */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    // Create backdrop if it doesn't exist
    let backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'nav-backdrop';
        document.body.appendChild(backdrop);
    }

    function openMenu() {
        navMenu.classList.add('active');
        backdrop.classList.add('visible');
        document.body.style.overflow = 'hidden';
        const icon = mobileToggle.querySelector('i');
        icon.classList.remove('bx-menu');
        icon.classList.add('bx-x');
    }

    function closeMenu() {
        navMenu.classList.remove('active');
        backdrop.classList.remove('visible');
        document.body.style.overflow = '';
        const icon = mobileToggle.querySelector('i');
        icon.classList.remove('bx-x');
        icon.classList.add('bx-menu');
    }

    mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    backdrop.addEventListener('click', closeMenu);

    // Close on nav link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    /* ─────────────────────────────────────────
       SCROLL EVENTS (debounced by rAF)
    ───────────────────────────────────────── */
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateProgress();
                updateNavbar();
                updateActiveLink();
                updateBackToTop();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    /* ─────────────────────────────────────────
       ACTIVE LINK HIGHLIGHTING
    ───────────────────────────────────────── */
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('.nav-link:not(.btn-primary-outline)');

    function updateActiveLink() {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 200) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href') || '';
            if (current && href.includes(current)) {
                link.classList.add('active');
            }
        });
    }

    /* ─────────────────────────────────────────
       BACK-TO-TOP BUTTON
    ───────────────────────────────────────── */
    const backToTop = document.getElementById('back-to-top');

    function updateBackToTop() {
        if (!backToTop) return;
        if (window.scrollY > 350) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ─────────────────────────────────────────
       INTERSECTION OBSERVER — REVEAL ANIMATIONS
       Handles both .fade-in-up (hero) and .reveal (sections)
    ───────────────────────────────────────── */
    const revealElements = document.querySelectorAll('.fade-in-up, .reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear', 'visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ─────────────────────────────────────────
       ADD REVEAL CLASS TO SECTION ELEMENTS
       (for elements that don't already have fade-in-up)
    ───────────────────────────────────────── */
    const revealTargets = [
        '.feature-card',
        '.gallery-item',
        '.stat-card',
        '.executive-card',
        '.faculty-card',
        '.about-content .description',
        '.footer-col',
        '.section-header'
    ];

    revealTargets.forEach((selector, selectorIdx) => {
        document.querySelectorAll(selector).forEach((el, i) => {
            // Skip if already has animation class
            if (!el.classList.contains('fade-in-up') && !el.classList.contains('reveal')) {
                el.classList.add('reveal');
                // Add stagger delay based on position within siblings
                const delayClass = `delay-${Math.min(i % 4 + 1, 6)}`;
                el.classList.add(delayClass);
                revealObserver.observe(el);
            }
        });
    });

    /* ─────────────────────────────────────────
       INITIAL STATE
    ───────────────────────────────────────── */
    updateNavbar();
    updateBackToTop();
    updateProgress();
});
