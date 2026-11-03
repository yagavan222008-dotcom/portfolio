/**
 * YAGAVAN T M - DEVELOPER PORTFOLIO
 * Modern Vanilla JavaScript: Responsive Navigation Drawer, ScrollSpy,
 * Scroll Offset Management, Clipboard API & Accessibility Controls
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
       2. MOBILE DRAWER NAVIGATION & SCROLL LOCK
       ========================================================================== */
    function openMobileMenu() {
        if (!sidebar) return;
        sidebar.classList.add('mobile-active');
        if (sidebarOverlay) {
            sidebarOverlay.classList.add('active');
            sidebarOverlay.setAttribute('aria-hidden', 'false');
        }
        if (hamburgerBtn) {
            hamburgerBtn.classList.add('active');
            hamburgerBtn.setAttribute('aria-expanded', 'true');
        }
        document.body.classList.add('nav-open');
        document.documentElement.classList.add('nav-open');
    }

    function closeMobileMenu() {
        if (!sidebar) return;
        sidebar.classList.remove('mobile-active');
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove('active');
            sidebarOverlay.setAttribute('aria-hidden', 'true');
        }
        if (hamburgerBtn) {
            hamburgerBtn.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
        document.body.classList.remove('nav-open');
        document.documentElement.classList.remove('nav-open');
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = sidebar && sidebar.classList.contains('mobile-active');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeMobileMenu();
        });
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
       3. SMOOTH SCROLLING WITH PRECISE HEADER OFFSET
       ========================================================================== */
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach((link) => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();

                // Close mobile menu immediately upon selecting a link
                closeMobileMenu();

                // Calculate offset: on <=1024px mobile header is 60px + breathing room
                const isMobile = window.innerWidth <= 1024;
                const headerOffset = isMobile ? 68 : 20;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

                window.scrollTo({
                    top: Math.max(0, offsetPosition),
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });

                // Update active state in navigation
                updateActiveLink(targetId.substring(1));

                // Safe hash push without jumping
                if (window.history && window.history.pushState) {
                    window.history.pushState(null, null, targetId);
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

    if ('IntersectionObserver' in window && sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-25% 0px -55% 0px',
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
            const scrollPos = window.scrollY + 180;

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
       5. COPY EMAIL TO CLIPBOARD WITH FEEDBACK
       ========================================================================== */
    if (copyEmailBtn) {
        const emailAddress = 'yagavan222008@gmail.com';

        copyEmailBtn.addEventListener('click', async () => {
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(emailAddress);
                } else {
                    const textarea = document.createElement('textarea');
                    textarea.value = emailAddress;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                }

                copyEmailBtn.classList.add('copied');
                if (copyTooltip) copyTooltip.textContent = 'Copied!';

                setTimeout(() => {
                    copyEmailBtn.classList.remove('copied');
                    if (copyTooltip) copyTooltip.textContent = 'Copy';
                }, 2200);
            } catch (err) {
                console.warn('Clipboard write fallback triggered:', err);
                if (copyTooltip) copyTooltip.textContent = 'Copy failed';
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
       7. WINDOW RESIZE HANDLER (Desktop / Mobile Drawer Cleanup)
       ========================================================================== */
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            closeMobileMenu();
        }
    }, { passive: true });

});
