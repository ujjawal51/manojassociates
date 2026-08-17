/**
 * JavaScript for Manoj Associates
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = mobileMenuBtn.querySelector('i');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if (navLinks.classList.contains('active')) {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-times');
        } else {
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        }
    });

    // Mobile Dropdown Toggle Logic
    const navDropdowns = document.querySelectorAll('.nav-dropdown');
    navDropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.nav-dropdown-trigger');
        trigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault(); // Prevent jump for "About" link
                dropdown.classList.toggle('mobile-open');
            }
        });
    });

    // 1. Modern Smooth Navigation & URL Cleaning (Excluding Mobile Dropdown Triggers)
    document.querySelectorAll('a[href^="#"]:not(.nav-dropdown-trigger)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            // Handle '#' as Home root
            if (targetId === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                window.history.pushState(null, null, window.location.pathname);
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust position for sticky header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL modernly without hash for #home, keep hash invisible for others if preferred
                if (targetId === '#home') {
                    window.history.pushState(null, null, window.location.pathname);
                } else {
                    // Modern pushState keeps it clean
                    window.history.pushState(null, null, targetId);
                }

                // Close mobile menu
                navLinks.classList.remove('active');
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });
    });

    // 1.5 Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    // Check local storage for theme preference, default to light
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    if (themeToggleBtn && themeIcon) {
        themeToggleBtn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme') || 'light';

            if (theme === 'light') {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        });
    }

    // 2. Sticky Navbar Effect on Scroll
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active link switching based on scroll position
        let current = '';
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });


    // 3. Number Counter Animation
    const counters = document.querySelectorAll('.counter');
    const statsSection = document.getElementById('stats-counter');
    let hasAnimated = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            // Duration logic
            const speed = 200;
            const updateCount = () => {
                const current = +counter.innerText;
                const inc = target / speed;

                if (current < target) {
                    counter.innerText = Math.ceil(current + inc);
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target;
                }
            };

            updateCount();
        });
    };

    // Intersection Observer to trigger counter animation when in view
    const observer = new IntersectionObserver((entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
            animateCounters();
            hasAnimated = true;
        }
    }, {
        root: null,
        threshold: 0.5
    });

    if (statsSection) {
        observer.observe(statsSection);
    }

    // 4. Contact Form Submit Prevention (Demo)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;

            btn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
            btn.style.opacity = '0.8';

            // Simulate network request
            setTimeout(() => {
                btn.innerHTML = 'Message Sent! <i class="fa-solid fa-check"></i>';
                btn.style.borderColor = '#9fb36d';
                btn.style.opacity = '1';
                contactForm.reset();

                // Revert button back after a few seconds
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.borderColor = '';
                }, 3000);

            }, 1500);
        });
    }

    // 5. Scroll Animations (Intersection Observer)
    const timelineItems = document.querySelectorAll('.timeline-item');
    const tlObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('tl-visible');
            }
        });
    }, { threshold: 0.2 });

    timelineItems.forEach(item => tlObserver.observe(item));

    const fadeElements = document.querySelectorAll('.animate-on-scroll');

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.2,
        rootMargin: "0px 0px 50px 0px"
    });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // 6. View Archive Toggling
    const viewArchiveBtn = document.getElementById('view-archive-btn');
    const archivedProjects = document.querySelectorAll('.archived-project');

    if (viewArchiveBtn && archivedProjects.length > 0) {
        let isArchiveVisible = false;

        viewArchiveBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent jump to top
            isArchiveVisible = !isArchiveVisible;

            archivedProjects.forEach(project => {
                if (isArchiveVisible) {
                    project.classList.add('show');
                } else {
                    project.classList.remove('show');
                }
            });

            if (isArchiveVisible) {
                viewArchiveBtn.innerHTML = 'HIDE ARCHIVE &nbsp;<i class="fa-solid fa-arrow-up"></i>';
            } else {
                viewArchiveBtn.innerHTML = 'VIEW ARCHIVE &nbsp;<i class="fa-solid fa-arrow-right"></i>';
            }
        });
    }

    // 7. Interactive Services Modal
    const modalData = {
        metro: {
            title: "Metro Rail & Tunneling Engineering",
            image: "Pune Metro Segment Transportation.png",
            desc: "We specialize in the complex engineering required for urban rapid transit systems. From deep tunnel excavation using TBMs to the structural development of multi-level underground stations, our expertise ensures timely delivery of critical metro corridors.",
            features: [
                { title: "TBM Excavation", text: "Precision tunneling using state-of-the-art Tunnel Boring Machines for dense urban environments." },
                { title: "Station Infrastructure", text: "Developing complex underground and elevated station structures with integrated civil works." },
                { title: "Precast Segment Casting", text: "High-volume production of precision-engineered concrete segment rings for tunnel lining." }
            ]
        },
        highway: {
            title: "Highway & Bridge Construction",
            image: "homeSlider/9th.png",
            desc: "Our primary expertise lies in the end-to-end execution of massive highway and bridge projects. We bring decades of engineering prowess to tackle challenging terrains, ensuring that every mile we lay is built for safety, efficiency, and longevity.",
            features: [
                { title: "Expressway Networks", text: "High-speed corridors designed with modern safety barriers and advanced drainage systems." },
                { title: "Long-Span Bridges", text: "Specialized cable-stayed and suspension bridges over major rivers and challenging valleys." },
                { title: "Smart Traffic Systems", text: "Integration of modern tolling, surveillance, and automated traffic management technology." }
            ]
        },
        aviation: {
            title: "Aviation Infrastructure",
            image: "Aviation_Infrastructure.png",
            desc: "Constructing an airport requires precision that leaves no room for error. We specialize in building commercial runways, rapid-exit taxiways, and sprawling terminal facilities that adhere strictly to international aviation standards (ICAO and FAA).",
            features: [
                { title: "Runway Construction", text: "High-grade polymer-modified bitumen layers for extreme load-bearing capacity and durability." },
                { title: "Terminal Buildings", text: "Energy-efficient structural steel terminals with modern aesthetics and passenger-centric design." },
                { title: "Airfield Lighting", text: "Complete installation of precision approach path indicators and modern airfield control systems." }
            ]
        },
        urban: {
            title: "Urban & Site Development",
            image: "STP Plant.png",
            desc: "Cities are the heart of human progress. We play a pivotal role in urban expansion by developing essential civil infrastructure, including massive storm-water systems, utility tunnels, and foundational work for smart cities.",
            features: [
                { title: "Utility Tunnels", text: "Highly integrated underground corridors for power, telecommunications, and city-wide water supply." },
                { title: "Industrial Yard Setup", text: "Design and execution of specialized casting yards for large-scale precast infrastructure components." },
                { title: "Commercial Foundations", text: "Heavy-duty deep foundation and piling work for mega-structures, skyscrapers, and urban malls." }
            ]
        }
    };

    const modalOverlay = document.getElementById('service-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalBody = document.getElementById('modal-body-content');

    // Select all buttons that trigger the modal (both services and projects)
    const learnMoreBtns = document.querySelectorAll('.learn-more.btn-link, .portfolio-action');

    // Open Modal
    if (modalOverlay && learnMoreBtns.length > 0) {
        learnMoreBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = btn.getAttribute('data-id');
                const data = modalData[id];

                if (data) {
                    // Update Title and Desc in the fixed header
                    const titleEl = document.getElementById('service-modal-title');
                    const descEl = document.getElementById('service-modal-desc');
                    if (titleEl) titleEl.innerText = data.title;
                    if (descEl) descEl.innerText = data.desc;

                    // Build features HTML
                    let featuresHtml = '';
                    data.features.forEach(feat => {
                        featuresHtml += `
                            <div class="modal-feature-item">
                                <div class="feat-dot"></div>
                                <div class="feat-info">
                                    <h4>${feat.title}</h4>
                                    <p>${feat.text}</p>
                                </div>
                            </div>
                        `;
                    });

                    // Inject Main Body (Image and Features Grid)
                    modalBody.innerHTML = `
                        <div class="service-modal-main">
                             <div class="service-image-wrap">
                                <img src="${data.image}" alt="${data.title}" class="modal-image">
                             </div>
                             <div class="service-competencies">
                                <h3 class="competency-title">CORE COMPETENCIES</h3>
                                <div class="modal-features-grid">
                                    ${featuresHtml}
                                </div>
                             </div>
                        </div>
                    `;

                    // Show modal
                    modalOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                }
            });
        });

        // Close Modal functions
        const closeModal = () => {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            setTimeout(() => { modalBody.innerHTML = ''; }, 300); // Clear content after transition
        };

        modalCloseBtn.addEventListener('click', closeModal);

        // Close on clicking outside
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // 8. Pill Button Filter for Projects (JKumar Style)
    const pillContainer = document.getElementById('project-pills');
    const projectModal = document.getElementById("project-modal");
    const closeProjectBtn = document.getElementById("close-project-modal");
    const projectGallery = document.getElementById("modal-project-gallery");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    let currentGalleryImages = [];
    let currentLightboxIndex = 0;

    const closeModal = () => {
        if (projectModal) {
            projectModal.classList.remove("active");
            document.body.style.overflow = "";
        }
    };

    const openLightbox = (index) => {
        currentLightboxIndex = index;
        if (lb && lbImg) {
            lbImg.src = currentGalleryImages[currentLightboxIndex];
            lb.classList.add("active");
        }
    };

    if (pillContainer) {
        const pills = pillContainer.querySelectorAll('.filter-pill');
        const showMoreBtnWrap = document.querySelector('.show-more-projects-wrap');
        const showMoreBtn = document.querySelector('.btn-show-more');

        let currentFilter = 'all';
        let isShowingAll = false;

        const filterProjects = (filter) => {
            currentFilter = filter;
            let matchCount = 0;
            const projectCards = Array.from(document.querySelectorAll('.pcard'));

            projectCards.forEach((card) => {
                // Explicitly hide projects marked as data-hidden
                if (card.getAttribute('data-hidden') === 'true') {
                    card.style.display = 'none';
                    return;
                }

                const sector = card.getAttribute('data-sector');
                const isMatch = (filter === 'all' || sector === filter);

                if (isMatch) {
                    matchCount++;
                    if (filter === 'all' && !isShowingAll && matchCount > 6) {
                        card.style.display = 'none';
                    } else {
                        card.style.display = 'flex';
                        card.style.animation = 'none';
                        void card.offsetWidth;
                        card.style.animation = 'pcardFadeIn 0.5s ease forwards';
                    }
                } else {
                    card.style.display = 'none';
                }
            });

            if (filter === 'all' && !isShowingAll && projectCards.length > 6) {
                if (showMoreBtnWrap) showMoreBtnWrap.style.display = 'flex';
            } else {
                if (showMoreBtnWrap) showMoreBtnWrap.style.display = 'none';
            }
        };

        window.filterProjects = filterProjects;

        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                const filter = pill.getAttribute('data-filter');
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                filterProjects(filter);
            });
        });

        filterProjects('all');

        if (showMoreBtn) {
            showMoreBtn.onclick = () => {
                isShowingAll = true;
                filterProjects(currentFilter);
            };
        }

        // --- Helper for Robust Title Matching ---
        const findCardByTitle = (title, allCards) => {
            const clean = (t) => t.toLowerCase().replace(/[^a-z0-9]/g, '');
            const targetClean = clean(title);
            return allCards.find(c => clean(c.getAttribute('data-title') || '') === targetClean);
        };

        // --- New Modal Opening Function with "Swapping" Logic ---
        window.openModalWithCard = (card) => {
            if (!card) return;
            const title = card.getAttribute("data-title") || "Project Details";
            const desc = card.getAttribute("data-desc") || "";
            const mainImg = card.querySelector("img") ? card.querySelector("img").src : "";
            const dataGallery = card.getAttribute("data-gallery");
            const city = (card.getAttribute("data-city") || "").toLowerCase();

            // Populate Modal Content
            document.getElementById("modal-project-title").innerText = title;
            document.getElementById("modal-project-desc").innerText = desc;

            let galleryImages = [];
            if (card._projectPhotos && Array.isArray(card._projectPhotos) && card._projectPhotos.length) {
                galleryImages = card._projectPhotos;
            } else if (dataGallery) {
                try {
                    if (dataGallery.startsWith('%5B') || dataGallery.startsWith('[')) {
                        galleryImages = JSON.parse(decodeURIComponent(dataGallery));
                    } else if (dataGallery.includes('|||')) {
                        galleryImages = dataGallery.split('|||').map(s => s.trim());
                    } else if (dataGallery.includes('data:image')) {
                        galleryImages = dataGallery.split(/,\s*(?=data:image\/|https?:\/\/|[a-zA-Z0-9_\-\/]+\.(?:png|jpe?g|webp|gif))/i).map(s => s.trim());
                    } else {
                        galleryImages = dataGallery.split(',').map(s => s.trim());
                    }
                } catch (e) {
                    galleryImages = [mainImg];
                }
            } else {
                galleryImages = [mainImg];
            }

            currentGalleryImages = galleryImages.filter(src => src && src !== "undefined" && src.trim().length > 3);
            if (!currentGalleryImages.length && mainImg) {
                currentGalleryImages = [mainImg];
            }

            projectGallery.innerHTML = "";
            currentGalleryImages.forEach((src, index) => {
                const item = document.createElement("div");
                item.className = "gallery-item";
                item.innerHTML = `<img src="${src}" alt="Project View ${index + 1}" onerror="this.src='homeSlider/9th.png'">`;
                item.onclick = (ev) => {
                    ev.stopPropagation();
                    openLightbox(index);
                };
                projectGallery.appendChild(item);
            });

            // --- Other Metro Projects (Screenshot Layout) ---
            const otherProjectsContainer = document.getElementById("modal-other-projects-container");
            if (otherProjectsContainer) {
                otherProjectsContainer.innerHTML = "";
                
                const allCards = Array.from(document.querySelectorAll('.pcard'));
                let relatedElements = [];

                // Handle Chennai and Delhi Specifically as per User Request
                const metroPairsChennai = ["Chennai Metro TU-01 & UG-06", "Chennai Metro UG 01"];
                const metroPairsDelhi = ["Delhi Metro DC-05", "Delhi Metro DC-07", "Delhi Metro DC-09"];

                if (metroPairsChennai.includes(title)) {
                    relatedElements = metroPairsChennai
                        .filter(t => t.toLowerCase() !== title.toLowerCase()) // Filter out current
                        .map(t => findCardByTitle(t, allCards))
                        .filter(c => c !== undefined);
                } else if (metroPairsDelhi.includes(title)) {
                    relatedElements = metroPairsDelhi
                        .filter(t => t.toLowerCase() !== title.toLowerCase()) // Filter out current
                        .map(t => findCardByTitle(t, allCards))
                        .filter(c => c !== undefined);
                } else if (city === "chennai") {
                    // For Chennai non-metro projects, remove the related section entirely
                    relatedElements = [];
                } else {
                    // Default logic for other cities
                    const currentSector = card.getAttribute('data-sector');
                    relatedElements = allCards.filter(c => {
                        const targetCity = (c.getAttribute('data-city') || "").toLowerCase();
                        const targetSector = c.getAttribute('data-sector');
                        const targetTitle = c.getAttribute('data-title');
                        
                        return targetCity === city && 
                               targetSector === currentSector && 
                               targetTitle !== title;
                    });
                }

                if (relatedElements.length > 0) {
                    const cityName = city.charAt(0).toUpperCase() + city.slice(1);
                    const otherHtml = `
                        <div class="other-projects-header">
                            <div class="line"></div>
                            <h2 class="other-projects-title">${cityName} Metro Projects</h2>
                            <div class="line"></div>
                        </div>
                        <div class="other-projects-columns">
                            <!-- Column 1: Related Metros -->
                            <div class="other-col">
                                <ul class="metro-details">
                                    ${relatedElements.map(c => `
                                        <li class="swap-project-link" data-title="${c.getAttribute('data-title')}">
                                            ${c.getAttribute('data-title')}
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    `;
                    otherProjectsContainer.innerHTML = otherHtml;

                    // Bind Swap Events
                    otherProjectsContainer.querySelectorAll('.swap-project-link').forEach(link => {
                        link.style.cursor = 'pointer';
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const targetTitle = link.getAttribute('data-title');
                            const targetCard = findCardByTitle(targetTitle, allCards);
                            if (targetCard) {
                                window.openModalWithCard(targetCard);
                                const container = document.querySelector('.project-modal-container');
                                if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                        });
                    });
                }
            }

            projectModal.classList.add("active");
            document.body.style.overflow = "hidden";
        };

        document.addEventListener('click', (e) => {
            const card = e.target.closest('.pcard');
            if (card) {
                window.openModalWithCard(card);
            }
        });
    }

    if (closeProjectBtn) closeProjectBtn.onclick = closeModal;
    // --- Project Modal Functions ---
    const closePModal = () => {
        if (projectModal) {
            projectModal.classList.remove("active");
            document.body.style.overflow = "";
        }
    };

    if (closeProjectBtn) closeProjectBtn.onclick = closePModal;
    if (projectModal) {
        projectModal.onclick = (e) => {
            if (e.target.classList.contains('modal-overlay')) closePModal();
        };
    }

    // --- Lightbox Logic ---
    const lb = document.getElementById("lightbox");
    const lbClose = document.getElementById("lightbox-close");
    const lbPrev = document.getElementById("lightbox-prev");
    const lbNext = document.getElementById("lightbox-next");
    const lbImg = document.getElementById("lightbox-img");

    const closeLB = () => { if (lb) lb.classList.remove("active"); };
    const nextLB = (e) => {
        if (e) e.stopPropagation();
        if (currentGalleryImages.length > 0) {
            currentLightboxIndex = (currentLightboxIndex + 1) % currentGalleryImages.length;
            if (lbImg) lbImg.src = currentGalleryImages[currentLightboxIndex];
        }
    };
    const prevLB = (e) => {
        if (e) e.stopPropagation();
        if (currentGalleryImages.length > 0) {
            currentLightboxIndex = (currentLightboxIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
            if (lbImg) lbImg.src = currentGalleryImages[currentLightboxIndex];
        }
    };

    if (lb) {
        if (lbClose) lbClose.onclick = closeLB;
        if (lbNext) lbNext.onclick = nextLB;
        if (lbPrev) lbPrev.onclick = prevLB;
        lb.onclick = (e) => { if (e.target === lb) closeLB(); };
    }

    document.addEventListener("keydown", (e) => {
        if (lb && lb.classList.contains("active")) {
            if (e.key === "Escape") closeLB();
            if (e.key === "ArrowRight") nextLB();
            if (e.key === "ArrowLeft") prevLB();
        }
    });

    // 10. Hero Slider — J. Kumar Category Tab Style
    const hjkSlides = document.querySelectorAll('.hjk-slide');
    const hjkCats   = document.querySelectorAll('.hjk-cat');

    // Map hero category → project filter pill data-filter value
    const catToFilter = {
        metro:     'metro',
        highway:   'road',
        aviation:  'airport',
        transport: 'transport',
        urban:     'urban'
    };

    // Helper: trigger a project filter pill click
    const triggerProjectFilter = (filterVal) => {
        const pill = document.querySelector(`.filter-pill[data-filter="${filterVal}"]`);
        if (pill) pill.click();
    };

    if (hjkSlides.length && hjkCats.length) {
        let currentCat = 'metro';
        let hjkTimer   = null;
        const catOrder = ['metro', 'highway', 'aviation', 'transport', 'urban'];

        const switchTo = (cat, scrollToProjects = false) => {
            // Deactivate all
            hjkSlides.forEach(s => s.classList.remove('active'));
            hjkCats.forEach(b => b.classList.remove('active'));

            // Activate matching slide
            const slide = document.querySelector(`.hjk-slide[data-cat="${cat}"]`);
            const btn   = document.querySelector(`.hjk-cat[data-cat="${cat}"]`);

            if (slide) slide.classList.add('active');
            if (btn)   btn.classList.add('active');
            currentCat = cat;

            // If user clicked (not auto-rotate) → scroll to projects + apply filter
            if (scrollToProjects) {
                const projectsSection = document.getElementById('projects');
                if (projectsSection) {
                    const offset = projectsSection.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({ top: offset, behavior: 'smooth' });
                }
                // Apply matching filter after slight delay (let scroll start)
                setTimeout(() => triggerProjectFilter(catToFilter[cat] || 'all'), 300);
            }
        };

        const startAuto = () => {
            clearInterval(hjkTimer);
            hjkTimer = setInterval(() => {
                const idx  = catOrder.indexOf(currentCat);
                const next = catOrder[(idx + 1) % catOrder.length];
                switchTo(next, false); // auto-rotate: no scroll
            }, 6000);
        };

        // Button clicks — user intent → scroll to projects
        hjkCats.forEach(btn => {
            btn.addEventListener('click', () => {
                clearInterval(hjkTimer);      // stop auto-rotate on click
                switchTo(btn.dataset.cat, true); // true = scroll to projects
            });
        });

        // Touch swipe on hero (no scroll — just slide change)
        let touchX = 0;
        const heroEl = document.getElementById('home');
        if (heroEl) {
            heroEl.addEventListener('touchstart', e => {
                touchX = e.changedTouches[0].clientX;
            }, { passive: true });
            heroEl.addEventListener('touchend', e => {
                const diff = touchX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) {
                    const idx = catOrder.indexOf(currentCat);
                    const next = diff > 0
                        ? catOrder[(idx + 1) % catOrder.length]
                        : catOrder[(idx - 1 + catOrder.length) % catOrder.length];
                    switchTo(next, false);
                    startAuto();
                }
            }, { passive: true });
        }

        // Init
        switchTo('metro', false);
        startAuto();
    }


    // 11. Mobile Touch Support - Simplified for full card click
    // Note: The main click listener on .pcard already handles both mobile and desktop.
    // Removed old touchstart preventDefault that was blocking modals.

});

/* ── Scripts for removed Map Section have been deleted to avoid errors ── */




const form = document.getElementById("contactForm");

if (form) {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const data = new FormData(form);
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) { submitBtn.textContent = 'SENDING…'; submitBtn.disabled = true; }

        try {
            const res = await fetch("https://formspree.io/f/xojkgrol", {
                method: "POST",
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                form.reset();
                showHpToast('✅ Inquiry sent successfully! We will contact you soon.', 'success');
            } else {
                showHpToast('❌ Something went wrong. Please try again.', 'error');
            }
        } catch {
            showHpToast('❌ Network error. Please check your connection.', 'error');
        } finally {
            if (submitBtn) { submitBtn.textContent = 'SUBMIT INQUIRY'; submitBtn.disabled = false; }
        }
    });
}

/* ── Back To Top Button ── */
(function () {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    // Show button after scrolling 400px
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    // Smooth scroll to top on click
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

/* ── Timeline Scroll Animation ── */
(function () {
    const items = document.querySelectorAll('.timeline-item');
    if (!items.length) return;

    const tlObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Slight stagger delay based on position
                setTimeout(() => {
                    entry.target.classList.add('tl-visible');
                }, 100);
                tlObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    items.forEach(item => tlObserver.observe(item));
})();

/* ── Nav Dropdown — Mobile Accordion Toggle ── */
(function () {
    const dropdown = document.getElementById('nav-about-dropdown');
    if (!dropdown) return;

    const trigger = dropdown.querySelector('.nav-dropdown-trigger');

    trigger.addEventListener('click', function (e) {
        // Only act as accordion on mobile
        if (window.innerWidth <= 900) {
            e.preventDefault();
            dropdown.classList.toggle('mobile-open');
        }
    });

    // Close dropdown when any item inside is clicked
    dropdown.querySelectorAll('.nav-dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            dropdown.classList.remove('mobile-open');
            // Also close the mobile nav
            const navLinks = document.querySelector('.nav-links');
            const menuIcon = document.querySelector('.mobile-menu-btn i');
            if (navLinks) navLinks.classList.remove('active');
            if (menuIcon) {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });
    });
})();

/* ── Footer Project Link Filter Trigger ── */
(function () {
    const footerPillLinks = document.querySelectorAll('.footer-pill-link');
    footerPillLinks.forEach(link => {
        link.addEventListener('click', () => {
            const filter = link.getAttribute('data-filter');
            const targetPill = document.querySelector(`.filter-pill[data-filter="${filter}"]`);
            if (targetPill) targetPill.click();
        });
    });
})();

/* ── Requirements & Careers — Homepage Renderer ── */
(function () {
    /* ── shared DB helpers (same keys as admin.js) ── */
    const REQS_KEY     = 'ma_requirements';
    const APPS_KEY     = 'ma_applications';
    const SETTINGS_KEY = 'ma_admin_settings';

    const CAT_LABELS = {
        metro:       'Metro & Tunneling',
        highway:     'Highway & Bridge',
        aviation:    'Aviation',
        machinery:   'Heavy Machinery',
        procurement: 'Procurement',
    };
    const URGENCY_LABELS = {
        urgent:    '🔴 Urgent Hiring',
        immediate: '🟠 Immediate',
        active:    '🟢 Active',
        pipeline:  '🔵 Pipeline',
    };

    /* ── seed requirements into localStorage if empty (mirrors admin.js seeds) ── */
    const SEED = [
        { id:'req_001', title:'Senior Civil Engineer — Metro Tunneling',        category:'metro',       openings:4, experience:'5–8 Years',        location:'Pune Metro / Chennai Metro',          urgency:'urgent',    active:true,  description:'We are urgently seeking Senior Civil Engineers with deep expertise in metro tunneling, TBM operations, and underground station civil works.',                                                 qualifications:'B.Tech/M.Tech Civil. Prior metro project experience preferred.' },
        { id:'req_002', title:'Site Supervisor — Civil & Finishing Works',       category:'metro',       openings:8, experience:'3–5 Years',        location:'Delhi Metro / Bhopal Metro',           urgency:'urgent',    active:true,  description:'Supervise day-to-day civil finishing, cladding, and MEP integration works on metro stations. Manage workforce of 20–50 labourers.',                                                     qualifications:'Diploma / B.Tech Civil. Metro finishing experience preferred.' },
        { id:'req_003', title:'Survey Engineer',                                  category:'metro',       openings:3, experience:'2–4 Years',        location:'Lucknow / Patna Metro',                urgency:'immediate', active:true,  description:'Conduct topographic, alignment, and settlement monitoring surveys on underground and elevated metro corridor sites using Total Station and GPS.',                                        qualifications:'B.Tech / Diploma Civil. Hands-on survey instrumentation skills required.' },
        { id:'req_004', title:'Hydraulic Rig / Piling Operator',                 category:'machinery',   openings:5, experience:'4–7 Years',        location:'Noida International Airport / Pan-India', urgency:'urgent',    active:true,  description:'Operate hydraulic rotary piling rigs for airport foundation and metro pile casting. ITI or equivalent certification required.',                                                          qualifications:'ITI Mechanical/Operator. Prior airport or metro site experience.' },
        { id:'req_005', title:'Sub-Contractor — Concrete & Shuttering',          category:'procurement', openings:2, experience:'Established Firm', location:'Pan-India (Multiple Project Sites)',   urgency:'active',    active:true,  description:'Empanelment of experienced sub-contracting firms for mass concrete pouring, shuttering / form-work, and reinforcement works on metro and highway projects.',                              qualifications:'Registered firm with GST, PF/ESI. 3+ years project execution track record.' },
        { id:'req_006', title:'Highway Site Engineer',                            category:'highway',     openings:3, experience:'2–5 Years',        location:'Uttar Pradesh / Maharashtra',          urgency:'active',    active:true,  description:'Site execution of highway embankment, pavement layering, road restoration, and drainage works as part of NHAI/state-highway projects.',                                                   qualifications:'B.Tech / Diploma Civil. Experience on NH or SH highway project mandatory.' },
    ];

    function getReqs() {
        try { return JSON.parse(localStorage.getItem(REQS_KEY)) || null; } catch { return null; }
    }
    function getSettings() {
        try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch { return {}; }
    }
    function saveApps(apps) {
        localStorage.setItem(APPS_KEY, JSON.stringify(apps));
        if (typeof CloudDB !== 'undefined' && CloudDB.isCloudReady()) {
            CloudDB.set(APPS_KEY, apps, APPS_KEY);
        }
    }
    function getApps() { try { return JSON.parse(localStorage.getItem(APPS_KEY)) || []; } catch { return []; } }

    /* If admin hasn't seeded yet, use built-in seed so homepage shows content immediately */
    function resolveReqs() {
        const stored = getReqs();
        if (stored && stored.length) return stored;
        localStorage.setItem(REQS_KEY, JSON.stringify(SEED));
        return SEED;
    }

    /* ── Render announcement ticker ── */
    function renderTicker() {
        const s = getSettings();
        const ticker = document.getElementById('announcement-ticker');
        if (!ticker) return;

        const isOn  = s.announcer_on !== undefined ? (s.announcer_on === true || s.announcer_on === 'true') : true;
        const text  = s.announcer_text || '🚨 URGENT REQUIREMENT: Seeking Senior Civil Engineers for Pune Metro Tunneling — 3-5 Yrs Experience  |  🏗️ IMMEDIATE NEED: Experienced Site Supervisors for Noida Airport Project  |  ⚙️ HIRING: Hydraulic Rig Operators & Surveyors — Apply Now via Contact Form';
        const style = s.ticker_style || 'urgent';

        if (!isOn) { 
            ticker.style.display = 'none'; 
            return; 
        }

        ticker.style.display = 'flex';
        ticker.className = `hero-announcement-strip style-${style}`;

        const badgeEl = ticker.querySelector('.announcement-badge');
        if (badgeEl) {
            const badgeMap = {
                urgent:  '<i class="fa-solid fa-bullhorn"></i> ANNOUNCEMENT',
                warning: '<i class="fa-solid fa-triangle-exclamation"></i> URGENT',
                success: '<i class="fa-solid fa-circle-check"></i> NOTICE',
                dark:    '<i class="fa-solid fa-circle-info"></i> UPDATE'
            };
            badgeEl.innerHTML = badgeMap[style] || '<i class="fa-solid fa-bullhorn"></i> ANNOUNCEMENT';
        }

        const textEl = document.getElementById('ticker-text');
        if (textEl) textEl.textContent = text + '    ✦    ' + text + '    ✦    ' + text;

        document.getElementById('ticker-close')?.addEventListener('click', () => {
            ticker.style.display = 'none';
        });
    }

    window.renderTicker = renderTicker;

    /* ── Render requirement cards ── */
    let currentFilter = 'all';

    function renderCards(filter) {
        currentFilter = filter || 'all';
        const grid = document.getElementById('req-cards-grid');
        if (!grid) return;

        const settings = getSettings();
        if (settings.req_section_title) {
            const titleEl = document.getElementById('req-section-title');
            if (titleEl) titleEl.textContent = settings.req_section_title;
        }
        if (settings.req_section_subtitle) {
            const subEl = document.getElementById('req-section-subtitle');
            if (subEl) subEl.textContent = settings.req_section_subtitle;
        }

        let reqs = resolveReqs().filter(r => r.active);
        if (currentFilter !== 'all') reqs = reqs.filter(r => r.category === currentFilter);

        if (!reqs.length) {
            grid.innerHTML = `<div class="req-empty-state"><i class="fa-solid fa-folder-open"></i><p>No active requirements in this category right now. Check back soon!</p></div>`;
            return;
        }

        grid.innerHTML = reqs.map(r => `
            <div class="req-card" data-category="${r.category}">
                <div class="req-card-header">
                    <div class="req-card-title">${r.title}</div>
                    <span class="req-urgency-badge ${r.urgency}">${URGENCY_LABELS[r.urgency] || r.urgency}</span>
                </div>
                <div class="req-card-meta">
                    <span class="req-meta-item"><i class="fa-solid fa-users"></i>${r.openings} Opening${r.openings > 1 ? 's' : ''}</span>
                    <span class="req-meta-item"><i class="fa-solid fa-briefcase"></i>${r.experience}</span>
                    <span class="req-meta-item"><i class="fa-solid fa-location-dot"></i>${r.location}</span>
                </div>
                <p class="req-card-desc">${r.description}</p>
                <div class="req-card-footer">
                    <span class="req-cat-chip">${CAT_LABELS[r.category] || r.category}</span>
                    <button class="btn-apply-now" onclick="openApplyModal('${r.title.replace(/'/g, "&apos;")}')"><i class="fa-solid fa-paper-plane"></i> Apply Now</button>
                </div>
            </div>
        `).join('');
    }

    /* ── Filter pills ── */
    document.querySelectorAll('.req-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.req-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            renderCards(pill.dataset.reqFilter);
        });
    });

    /* ── Apply Modal ── */
    window.openApplyModal = function(position) {
        const modal = document.getElementById('apply-modal');
        const posTitle = document.getElementById('apply-modal-position');
        const posHidden = document.getElementById('apply-position-hidden');
        if (!modal) return;
        if (posTitle) posTitle.textContent = 'Apply for: ' + position;
        if (posHidden) posHidden.value = position;

        const settings = getSettings();
        const emailLink = document.getElementById('apply-email-link');
        if (emailLink && settings.contact_email) {
            emailLink.href = 'mailto:' + settings.contact_email;
            emailLink.textContent = settings.contact_email;
        }

        // Reset to form view
        const applyBody = document.getElementById('apply-modal-body');
        const form = document.getElementById('apply-form');
        if (applyBody && form) form.reset();

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    window.closeApplyModal = function() {
        const modal = document.getElementById('apply-modal');
        if (modal) modal.classList.remove('open');
        document.body.style.overflow = '';
    };

    document.getElementById('apply-modal-close')?.addEventListener('click', window.closeApplyModal);
    document.getElementById('apply-modal')?.addEventListener('click', function(e) {
        if (e.target === this) window.closeApplyModal();
    });

    document.getElementById('btn-submit-apply')?.addEventListener('click', async () => {
        const name     = document.getElementById('apply-name')?.value.trim();
        const phone    = document.getElementById('apply-phone')?.value.trim();
        const email    = document.getElementById('apply-email')?.value.trim();
        const exp      = document.getElementById('apply-experience')?.value;
        const message  = document.getElementById('apply-message')?.value.trim();
        const position = document.getElementById('apply-position-hidden')?.value;

        if (!name || !phone || !email) {
            showHpToast('⚠️ Please fill your name, phone and email.', 'warning');
            return;
        }

        const submitBtn = document.getElementById('btn-submit-apply');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting…';
        }

        const newApp = {
            id: 'app_' + Date.now() + '_' + Math.floor(Math.random()*1000),
            name,
            phone,
            email,
            experience: exp || '—',
            message: message || 'No message provided.',
            position: position || 'General Opening',
            status: 'new',
            created: new Date().toISOString(),
        };

        if (typeof CloudDB !== 'undefined') {
            await CloudDB.submitApplication(newApp);
        } else {
            const apps = getApps();
            apps.unshift(newApp);
            saveApps(apps);
        }

        // Show success inside modal
        const body = document.getElementById('apply-modal-body');
        if (body) {
            body.innerHTML = `
                <div class="apply-success">
                    <div class="apply-success-icon"><i class="fa-solid fa-circle-check"></i></div>
                    <h4>Application Submitted!</h4>
                    <p>Thank you, <strong>${name}</strong>! Your application for <em>${position}</em> has been received.<br><br>Our team will review your profile and contact you at <strong>${phone}</strong> or <strong>${email}</strong> within 2–3 business days.</p>
                </div>
            `;
        }
        setTimeout(() => { window.closeApplyModal(); }, 3500);
        showHpToast('✅ Application submitted! We will be in touch soon.', 'success');
    });

    /* ── Robust Realtime Cloud & Local Sync ── */
    function attachCloudSync() {
        if (typeof CloudDB === 'undefined' || !CloudDB.isCloudReady()) return;

        // 1. Initial Cloud Fetch for Settings (Announcement Banner)
        CloudDB.get(SETTINGS_KEY).then(data => {
            if (data && typeof data === 'object') {
                localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
                renderTicker();
                renderCards(currentFilter);
            }
        }).catch(() => {});

        // 2. Initial Cloud Fetch for Requirements
        CloudDB.get(REQS_KEY).then(data => {
            if (data && Array.isArray(data) && data.length) {
                localStorage.setItem(REQS_KEY, JSON.stringify(data));
                renderCards(currentFilter);
            }
        }).catch(() => {});

        // 3. Live Cloud Listeners (instant cross-device updates)
        CloudDB.listen(REQS_KEY, (data) => {
            let list = [];
            if (data && Array.isArray(data)) list = data;
            else if (data && typeof data === 'object') list = Object.values(data);
            if (list.length) {
                localStorage.setItem(REQS_KEY, JSON.stringify(list));
                renderCards(currentFilter);
            }
        });

        CloudDB.listen(SETTINGS_KEY, (data) => {
            if (data && typeof data === 'object') {
                localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
                renderTicker();
                renderCards(currentFilter);
            }
        });
    }

    // Attach immediately and retry on load/timers
    attachCloudSync();
    window.addEventListener('load', attachCloudSync);
    setTimeout(attachCloudSync, 800);
    setTimeout(attachCloudSync, 2000);

    /* ── Poll for local admin changes every 1.5s (fallback when cloud not connected) ── */
    let _lastSyncStamp = localStorage.getItem('ma_last_updated') || '0';

    setInterval(() => {
        const newStamp = localStorage.getItem('ma_last_updated') || '0';
        if (newStamp !== _lastSyncStamp) {
            _lastSyncStamp = newStamp;
            renderTicker();
            renderCards(currentFilter);
        }
    }, 1500);

    /* ── Cross-tab Storage Event Listener ── */
    window.addEventListener('storage', (e) => {
        if (e.key === 'ma_last_updated' || e.key === REQS_KEY || e.key === SETTINGS_KEY) {
            _lastSyncStamp = localStorage.getItem('ma_last_updated') || '0';
            renderTicker();
            renderCards(currentFilter);
        }
    });

    /* ── Init ── */
    renderTicker();
    renderCards('all');

})();

/* ── Homepage Toast Helper ── */
let _hpToastTimer;
function showHpToast(msg, type) {
    const el = document.getElementById('hp-toast');
    if (!el) return;
    el.innerHTML = msg;
    el.className = `hp-toast show`;
    if (type === 'error')   el.style.background = '#B71C1C';
    else if (type === 'warning') el.style.background = '#E65100';
    else el.style.background = '#1B5E20';
    clearTimeout(_hpToastTimer);
    _hpToastTimer = setTimeout(() => { el.className = 'hp-toast'; }, 4000);
}

/* ── Secret Admin Access: Footer Logo Triple-Click ── */
(function () {
    const logo = document.getElementById('footer-logo-secret');
    if (!logo) return;

    let clickCount = 0;
    let clickTimer = null;

    logo.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation(); // stop the smooth-scroll handler from interfering

        clickCount++;
        clearTimeout(clickTimer);

        if (clickCount >= 3) {
            clickCount = 0;
            // Flash logo gold to confirm
            logo.style.outline = '3px solid rgba(200,164,93,0.85)';
            logo.style.borderRadius = '8px';
            logo.style.transition = 'outline 0.2s';
            setTimeout(() => { logo.style.outline = ''; logo.style.borderRadius = ''; }, 350);
            // Open admin — must be synchronous (no setTimeout) to avoid popup blocker
            window.open('admin.html', '_blank');
        } else {
            // Reset if no 3rd click within 700ms
            clickTimer = setTimeout(() => { clickCount = 0; }, 700);
        }
    });
})();

/* ── Dynamic Projects Renderer (Synced with Admin & Cloud Database) ── */
(function() {
    const PROJS_KEY = 'ma_projects';
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    const sectorBadgeMap = {
        metro:     { label: 'Metro', cls: 'metro' },
        road:      { label: 'Highway', cls: 'road' },
        airport:   { label: 'Airport', cls: 'airport' },
        transport: { label: 'Transport', cls: 'transport' },
        urban:     { label: 'Urban', cls: 'urban' },
    };

    function renderHomepageProjects() {
        let projs = [];
        try {
            const raw = localStorage.getItem(PROJS_KEY);
            if (raw) projs = JSON.parse(raw);
        } catch { projs = []; }

        if (!projs || !projs.length) return; // Keep static fallback if no DB projects

        const activeProjs = projs.filter(p => p.active !== false);
        if (!activeProjs.length) return;

        grid.innerHTML = activeProjs.map((p, pIdx) => {
            const photos = Array.isArray(p.photos) ? p.photos : (p.photos ? p.photos.split('|||').map(s=>s.trim()) : []);
            const mainImg = photos[0] || 'pune metro/1th.png';
            const galleryAttr = encodeURIComponent(JSON.stringify(photos));
            const badge = sectorBadgeMap[p.sector] || { label: p.sector || 'Project', cls: 'metro' };

            return `
                <div class="pcard" 
                     id="dyn-pcard-${p.id || pIdx}"
                     data-city="${p.city || (p.location ? p.location.split(',')[0].trim().toLowerCase() : '')}"
                     data-sector="${p.sector || 'metro'}"
                     data-title="${p.title}"
                     data-client="${p.client || 'Manoj Associates'}"
                     data-amount="-"
                     data-status="${p.status || 'Completed'}"
                     data-location="${p.location || 'Pan-India'}"
                     data-gallery="${galleryAttr}"
                     data-desc="${p.desc || ''}">
                    <div class="pcard-image">
                        <img loading="lazy" src="${mainImg}" alt="${p.title}" onerror="this.src='homeSlider/9th.png'">
                        <div class="pcard-overlay"><button class="view-details-btn">VIEW DETAILS</button></div>
                        <span class="pcard-badge ${badge.cls}">${badge.label}</span>
                    </div>
                    <div class="pcard-body">
                        <h1 style="color: #FFFF;">${p.title}</h1>
                    </div>
                </div>
            `;
        }).join('');

        // Store direct references on the card elements
        activeProjs.forEach((p, pIdx) => {
            const cardEl = document.getElementById(`dyn-pcard-${p.id || pIdx}`);
            if (cardEl) {
                const photos = Array.isArray(p.photos) ? p.photos : [p.photos];
                cardEl._projectPhotos = photos;
            }
        });

        // Trigger pill filter to refresh view
        const activePill = document.querySelector('.filter-pill.active');
        const filterVal = activePill ? activePill.getAttribute('data-filter') : 'all';
        if (typeof window.filterProjects === 'function') {
            window.filterProjects(filterVal);
        }
    }

    // Initial render
    renderHomepageProjects();

    // Live Cloud Database listener for real-time project additions / updates
    if (typeof CloudDB !== 'undefined' && CloudDB.isCloudReady()) {
        CloudDB.listen('ma_projects', (data) => {
            let list = [];
            if (data && Array.isArray(data)) list = data;
            else if (data && typeof data === 'object') list = Object.values(data);
            if (list.length) {
                localStorage.setItem(PROJS_KEY, JSON.stringify(list));
                renderHomepageProjects();
            }
        });

        // Real-time Cloud listener for Admin Settings (Announcement Banner)
        CloudDB.listen('ma_admin_settings', (data) => {
            if (data && typeof data === 'object') {
                localStorage.setItem('ma_admin_settings', JSON.stringify(data));
                if (typeof window.renderTicker === 'function') window.renderTicker();
                if (typeof window.renderCards === 'function') window.renderCards();
            }
        });

        // Real-time Cloud listener for Requirements
        CloudDB.listen('ma_requirements', (data) => {
            let list = [];
            if (data && Array.isArray(data)) list = data;
            else if (data && typeof data === 'object') list = Object.values(data);
            if (list.length) {
                localStorage.setItem('ma_requirements', JSON.stringify(list));
                if (typeof window.renderCards === 'function') window.renderCards();
            }
        });
    }

    // Polling fallback across browser tabs
    let _lastProjStamp = localStorage.getItem('ma_last_updated') || '0';
    setInterval(() => {
        const stamp = localStorage.getItem('ma_last_updated') || '0';
        if (stamp !== _lastProjStamp) {
            _lastProjStamp = stamp;
            renderHomepageProjects();
            if (typeof window.renderTicker === 'function') window.renderTicker();
            if (typeof window.renderCards === 'function') window.renderCards();
        }
    }, 1500);

    // Cross-tab storage listener
    window.addEventListener('storage', (e) => {
        if (e.key === 'ma_admin_settings' || e.key === 'ma_requirements' || e.key === 'ma_projects' || e.key === 'ma_last_updated') {
            renderHomepageProjects();
            if (typeof window.renderTicker === 'function') window.renderTicker();
            if (typeof window.renderCards === 'function') window.renderCards();
        }
    });

})();

/* ── Sticky Header Scroll Listener & Mobile Nav Drawer ── */
(function() {
    const header = document.querySelector('.header');
    function updateHeaderScroll() {
        if (window.scrollY > 15) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', updateHeaderScroll, { passive: true });
    updateHeaderScroll();

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    menuBtn?.addEventListener('click', function(e) {
        e.stopPropagation();
        navLinks?.classList.toggle('open');
        const icon = menuBtn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        }
    });

    // Close mobile menu on clicking any navigation link
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.addEventListener('click', () => {
            navLinks?.classList.remove('open');
            const icon = menuBtn?.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-xmark');
            }
        });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks?.classList.contains('open') && !navLinks.contains(e.target) && !menuBtn?.contains(e.target)) {
            navLinks.classList.remove('open');
            const icon = menuBtn?.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-xmark');
            }
        }
    });
})();



