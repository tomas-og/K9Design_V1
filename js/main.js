/* ============================================
   K9 DESIGN — main.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Scroll Reveal Animations ---------- */
    const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

    if (revealEls.length && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => revealObserver.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('in-view'));
    }

    /* ---------- Service Category Tabs ---------- */
    const serviceTabBtns = document.querySelectorAll('#serviceTabs .chip');
    const serviceGroups = document.querySelectorAll('#serviceGroups .service-group');

    function filterServices(category) {
        serviceGroups.forEach(group => {
            if (category === 'all' || group.getAttribute('data-category') === category) {
                group.classList.remove('hidden');
            } else {
                group.classList.add('hidden');
            }
        });
    }

    serviceTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            serviceTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterServices(btn.getAttribute('data-category'));
        });
    });

    // Default to Full Groom tab
    filterServices('full');

    /* ---------- Mobile Navigation ---------- */
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileNav = document.getElementById('mobileNav');
    const navOverlay = document.getElementById('navOverlay');

    function closeMobileNav() {
        mobileToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function toggleMobileNav() {
        const isOpen = mobileNav.classList.toggle('active');
        mobileToggle.classList.toggle('active', isOpen);
        navOverlay.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    if (mobileToggle && mobileNav && navOverlay) {
        mobileToggle.addEventListener('click', toggleMobileNav);
        mobileToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileNav();
            }
        });
        navOverlay.addEventListener('click', closeMobileNav);
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileNav);
        });
    }

    /* ---------- Animated Stat Counters ---------- */
    const statNumbers = document.querySelectorAll('.stat-num[data-target]');

    function animateCount(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            el.textContent = target === 500 ? '500 +' : target;
        }
    }

    requestAnimationFrame(tick);
}

    // Set the static "5★" stat immediately
    document.querySelectorAll('.stat-num[data-static]').forEach(el => {
        el.textContent = el.getAttribute('data-static');
    });

    if (statNumbers.length && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        statNumbers.forEach(el => statsObserver.observe(el));
    } else {
        statNumbers.forEach(animateCount);
    }

    /* ---------- Gallery — 21 Images + Lightbox ---------- */
    const galleryGrid = document.getElementById('dogGallery');
    const galleryExpandBtn = document.getElementById('galleryExpandBtn');
    const galleryExpandLabel = document.getElementById('galleryExpandLabel');
    const galleryExpandWrap = document.getElementById('galleryExpandWrap');

    const dogImages = [
        { src: 'assets/Images/Dog 1.jpeg',  caption: 'A polished little gentleman with serious main-character energy.' },
        { src: 'assets/Images/Dog 2.jpeg',  caption: 'Perfect cut and absolutely zero bad angles.' },
        { src: 'assets/Images/Dog 3.jpeg',  caption: 'Ready for the great outdoors, or at least a very cute photo shoot.' },
        { src: 'assets/Images/Dog 4.jpeg',  caption: 'Straight out of this world, and still looking camera-ready.' },
        { src: 'assets/Images/Dog 5.jpeg',  caption: 'Small dog, big elegance, fully booked for compliments.' },
        { src: 'assets/Images/Dog 6.jpeg',  caption: 'Tiny face, huge personality, and probably knows it.' },
        { src: 'assets/Images/Dog 7.jpeg',  caption: 'Fluffy, fabulous, and clearly the office favourite.' },
        { src: 'assets/Images/Dog 8.jpeg',  caption: 'Looking like a model who just remembered treat time.' },
        { src: 'assets/Images/Dog 9.jpeg',  caption: 'Soft, stylish, and one wag away from stealing hearts.' },
        { src: 'assets/Images/Dog 10.jpeg', caption: 'Fresh from the groomer and acting like it was all their idea.' },
        { src: 'assets/Images/Dog 11.jpeg', caption: 'Clean, bright, and giving luxury-pet energy.' },
        { src: 'assets/Images/Dog 12.jpeg', caption: 'A cloud with paws and a very serious schedule of being adorable.' },
        { src: 'assets/Images/Dog 13.jpeg', caption: 'Professional look, playful attitude, perfect balance.' },
        { src: 'assets/Images/Dog 14.jpeg', caption: 'Small pup, bold expression, maximum charm.' },
        { src: 'assets/Images/Dog 15.jpeg', caption: 'Groomed to perfection and ready for the spotlight.' },
        { src: 'assets/Images/Dog 16.jpeg', caption: 'Looking like a teddy bear that learned how to pose.' },
        { src: 'assets/Images/Dog 17.jpeg', caption: 'A cheerful little icon with excellent grooming standards.' },
        { src: 'assets/Images/Dog 18.jpeg', caption: 'Sweet face, neat trim, and top-tier presence.' },
        { src: 'assets/Images/Dog 19.jpeg', caption: 'Compact, fluffy, and full of confidence.' },
        { src: 'assets/Images/Dog 20.jpeg', caption: 'A little lion in a very good mood.' },
        { src: 'assets/Images/Dog 21.jpeg', caption: 'Classic good looks and a face built for compliments.' },
    ];

    const PREVIEW_COUNT = 9;
    let galleryExpanded = false;

    function buildGallery() {
        if (!galleryGrid) return;
        galleryGrid.innerHTML = '';

        dogImages.forEach((dog, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item' + (index >= PREVIEW_COUNT ? ' gallery-item--hidden' : '');
            item.setAttribute('data-index', index);

            const img = document.createElement('img');
            img.src = dog.src;
            img.alt = dog.caption;
            img.loading = index < PREVIEW_COUNT ? 'eager' : 'lazy';

            img.addEventListener('load', () => {
                img.classList.add('loaded');
                item.classList.add('has-image');
            });
            img.addEventListener('error', () => {
                item.classList.add('gallery-item--placeholder');
            });

            const caption = document.createElement('div');
            caption.className = 'gallery-caption';
            caption.textContent = dog.caption;

            const overlay = document.createElement('div');
            overlay.className = 'gallery-overlay';
            overlay.innerHTML = '<span class="gallery-zoom-icon">⊕</span>';

            item.appendChild(img);
            item.appendChild(caption);
            item.appendChild(overlay);
            item.addEventListener('click', () => openLightbox(index));
            galleryGrid.appendChild(item);
        });
    }

    // Expand / collapse
    if (galleryExpandBtn) {
        galleryExpandBtn.addEventListener('click', () => {
            galleryExpanded = !galleryExpanded;
            const hiddenItems = galleryGrid.querySelectorAll('.gallery-item--hidden');

            if (galleryExpanded) {
                hiddenItems.forEach((el, i) => {
                    setTimeout(() => el.classList.add('gallery-item--visible'), i * 40);
                });
                galleryExpandLabel.textContent = 'Show fewer photos';
                galleryExpandBtn.querySelector('.gallery-expand-icon').textContent = '↑';
            } else {
                hiddenItems.forEach(el => el.classList.remove('gallery-item--visible'));
                galleryExpandLabel.textContent = 'Show all 21 photos';
                galleryExpandBtn.querySelector('.gallery-expand-icon').textContent = '↓';
                galleryGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    buildGallery();

    /* ---------- Lightbox ---------- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let lightboxIndex = 0;

    function openLightbox(index) {
        lightboxIndex = index;
        showLightboxImage();
        lightbox.classList.add('active');
        document.body.classList.add('lightbox-open');
        lightboxClose.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.classList.remove('lightbox-open');
    }

    function showLightboxImage() {
        const dog = dogImages[lightboxIndex];
        lightboxImg.classList.remove('loaded');
        lightboxImg.src = dog.src;
        lightboxImg.alt = dog.caption;
        lightboxImg.onload = () => lightboxImg.classList.add('loaded');
        lightboxCaption.textContent = dog.caption;
        lightboxCounter.textContent = (lightboxIndex + 1) + ' / ' + dogImages.length;
    }

    function lightboxStep(dir) {
        lightboxIndex = (lightboxIndex + dir + dogImages.length) % dogImages.length;
        showLightboxImage();
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev)  lightboxPrev.addEventListener('click', () => lightboxStep(-1));
    if (lightboxNext)  lightboxNext.addEventListener('click', () => lightboxStep(1));

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft')  lightboxStep(-1);
        if (e.key === 'ArrowRight') lightboxStep(1);
    });

    /* ---------- reviewss: Filtering ---------- */
    const filterChips = document.querySelectorAll('#filterChips .chip');
    const reviewsCards = document.querySelectorAll('#reviewsGrid .t-card');
    const showMoreBtn = document.getElementById('showMoreBtn');
    const VISIBLE_COUNT = 6;

    function applyFilter(filter) {
        let visibleIndex = 0;

        reviewsCards.forEach(card => {
            const tags = (card.getAttribute('data-tags') || '').split(' ');
            const matches = filter === 'all' || tags.includes(filter);

            card.classList.remove('extra', 'visible', 'hidden');

            if (!matches) {
                card.classList.add('hidden');
                return;
            }

            visibleIndex++;
            if (visibleIndex > VISIBLE_COUNT) {
                card.classList.add('extra');
            }
        });

        if (showMoreBtn) {
            const hasExtras = Array.from(reviewsCards).some(c => c.classList.contains('extra'));
            showMoreBtn.classList.toggle('hidden', !hasExtras);
            showMoreBtn.textContent = 'Show More Reviews \u2193';
        }
    }

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            applyFilter(chip.getAttribute('data-filter'));
        });
    });

    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', () => {
            document.querySelectorAll('#reviewsGrid .t-card.extra').forEach(card => {
                card.classList.add('visible');
            });
            showMoreBtn.classList.add('hidden');
        });
    }

    // Initial state
    applyFilter('all');

    /* ---------- FAQ Accordion ---------- */
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            document.querySelectorAll('.faq-item.active').forEach(openItem => {
                if (openItem !== item) {
                    openItem.classList.remove('active');
                    openItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = null;
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    /* ---------- Booking Form ---------- */
    const bookingForm = document.getElementById('bookingForm');
    const successMsg = document.getElementById('successMsg');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!bookingForm.checkValidity()) {
                bookingForm.reportValidity();
                return;
            }

            if (successMsg) {
                successMsg.classList.add('visible');
                successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            bookingForm.reset();
        });
    }

    /* ---------- Back to Top ---------- */
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 480);
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});