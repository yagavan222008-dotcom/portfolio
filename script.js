/**
 * YAGAVAN T M - DEVELOPER PORTFOLIO
 * Vanilla JavaScript: Navigation, ScrollSpy, Mobile Drawer, Clipboard & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ==========================================================================
       1. DOM ELEMENT REFERENCES
       ========================================================================== */
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    const navLinks = document.querySelectorAll('.side-nav .nav-link');
    const sections = document.querySelectorAll('section[id]');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const copyTooltip = document.getElementById('copyTooltip');

    /* ==========================================================================
       2. MOBILE DRAWER NAVIGATION
       ========================================================================== */
    function openMobileMenu() {
        if (!sidebar) return;
        sidebar.classList.add('mobile-active');
        if (sidebarOverlay) sidebarOverlay.classList.add('active');
        if (hamburgerBtn) {
            hamburgerBtn.classList.add('active');
            hamburgerBtn.setAttribute('aria-expanded', 'true');
        }
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        if (!sidebar) return;
        sidebar.classList.remove('mobile-active');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        if (hamburgerBtn) {
            hamburgerBtn.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            const isOpen = sidebar && sidebar.classList.contains('mobile-active');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', closeMobileMenu);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close mobile menu on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar && sidebar.classList.contains('mobile-active')) {
            closeMobileMenu();
        }
    });

    /* ==========================================================================
       3. SMOOTH SCROLLING WITH OFFSET
       ========================================================================== */
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach((link) => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();

                // Close mobile menu if open
                closeMobileMenu();

                const isMobile = window.innerWidth <= 1024;
                const headerOffset = isMobile ? 70 : 0;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });

                // Update active nav state immediately
                updateActiveLink(targetId.substring(1));

                // Update URL hash safely without triggering abrupt browser jump
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }
            }
        });
    });

    /* ==========================================================================
       4. SCROLLSPY / ACTIVE NAVIGATION HIGHLIGHTING
       ========================================================================== */
    function updateActiveLink(sectionId) {
        navLinks.forEach((link) => {
            const linkTarget = link.getAttribute('href')?.replace('#', '');
            if (linkTarget === sectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Modern IntersectionObserver for performant scrollspy
    if ('IntersectionObserver' in window && sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    if (id) {
                        updateActiveLink(id);
                    }
                }
            });
        }, observerOptions);

        sections.forEach((section) => observer.observe(section));
    } else {
        // Fallback for older browsers
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPos = window.scrollY + 200;

            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            if (current) {
                updateActiveLink(current);
            }
        }, { passive: true });
    }

    /* ==========================================================================
       5. COPY EMAIL TO CLIPBOARD
       ========================================================================== */
    if (copyEmailBtn) {
        const emailToCopy = 'yagavan222008@gmail.com';

        copyEmailBtn.addEventListener('click', async () => {
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(emailToCopy);
                } else {
                    // Fallback for older environments
                    const textarea = document.createElement('textarea');
                    textarea.value = emailToCopy;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                }

                // Show visual feedback in tooltip
                copyEmailBtn.classList.add('copied');
                if (copyTooltip) copyTooltip.textContent = 'Copied!';

                setTimeout(() => {
                    copyEmailBtn.classList.remove('copied');
                    if (copyTooltip) copyTooltip.textContent = 'Copy';
                }, 2200);
            } catch (err) {
                console.warn('Clipboard write failed:', err);
                if (copyTooltip) copyTooltip.textContent = 'Error';
                setTimeout(() => {
                    if (copyTooltip) copyTooltip.textContent = 'Copy';
                }, 2000);
            }
        });
    }

    /* ==========================================================================
       6. BACK TO TOP BUTTON
       ========================================================================== */
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    }

    /* ==========================================================================
       7. WINDOW RESIZE HANDLER (Desktop / Mobile transition cleanup)
       ========================================================================== */
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            closeMobileMenu();
        }
    }, { passive: true });

});