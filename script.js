document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const header = document.querySelector(".site-header");
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelectorAll(".nav-link");
    const roleText = document.getElementById("roleText");
    const themeToggle = document.getElementById("themeToggle");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function getStoredTheme() {
        try {
            return window.localStorage.getItem("portfolio-theme");
        } catch {
            return null;
        }
    }

    function storeTheme(theme) {
        try {
            window.localStorage.setItem("portfolio-theme", theme);
        } catch {
            // Local storage can be unavailable in private or restricted browser contexts.
        }
    }

    function applyTheme(theme) {
        const isLight = theme === "light";
        body.classList.toggle("light-theme", isLight);
        themeToggle?.setAttribute("aria-pressed", String(isLight));
        themeToggle?.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");

        const icon = themeToggle?.querySelector("i");
        if (icon) {
            icon.className = isLight ? "fa-solid fa-sun" : "fa-solid fa-moon";
        }
    }

    function initThemeToggle() {
        const initialTheme = getStoredTheme() || "dark";
        applyTheme(initialTheme);

        themeToggle?.addEventListener("click", () => {
            const nextTheme = body.classList.contains("light-theme") ? "dark" : "light";
            applyTheme(nextTheme);
            storeTheme(nextTheme);
        });
    }

    function closeNav() {
        body.classList.remove("nav-open");
        navToggle?.setAttribute("aria-expanded", "false");
        navToggle?.setAttribute("aria-label", "Open navigation");
    }

    navToggle?.addEventListener("click", () => {
        const isOpen = body.classList.toggle("nav-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
        navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    document.querySelectorAll("a[href^='#']").forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            closeNav();

            const headerOffset = (header?.offsetHeight || 76) + 14;
            const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerOffset);
            window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
            window.history.pushState(null, "", targetId);
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeNav();
    });

    function updateHeader() {
        header?.classList.toggle("is-scrolled", window.scrollY > 24);
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    const sections = Array.from(document.querySelectorAll("main section[id]"));
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
            });
        });
    }, {
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0
    });

    sections.forEach((section) => sectionObserver.observe(section));

    const roles = [
        "SOC analyst intern",
        "SIEM-focused investigator",
        "Wazuh detection builder",
        "security automation builder",
        "threat research analyst"
    ];

    function startTypewriter() {
        if (!roleText || reduceMotion) return;

        let roleIndex = 0;
        roleText.style.transition = "opacity 220ms ease, transform 220ms ease";

        window.setInterval(() => {
            roleText.style.opacity = "0";
            roleText.style.transform = "translateY(4px)";

            window.setTimeout(() => {
                roleIndex = (roleIndex + 1) % roles.length;
                roleText.textContent = roles[roleIndex];
                roleText.style.opacity = "1";
                roleText.style.transform = "translateY(0)";
            }, 240);
        }, 2600);
    }

    function initFallbackMotion() {
        if (reduceMotion) return;

        const heroItems = document.querySelectorAll("[data-animate='hero']");
        heroItems.forEach((item, index) => {
            item.style.opacity = "0";
            item.style.transform = "translateY(24px)";
            item.style.transition = "opacity 720ms ease, transform 720ms ease";

            window.setTimeout(() => {
                item.style.opacity = "1";
                item.style.transform = "translateY(0)";
            }, 120 + index * 90);
        });

        const revealItems = document.querySelectorAll("[data-animate='fade'], [data-animate='card']");
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            });
        }, {
            rootMargin: "0px 0px -12% 0px",
            threshold: 0.12
        });

        revealItems.forEach((item) => {
            item.style.opacity = "0";
            item.style.transform = "translateY(28px)";
            item.style.transition = "opacity 680ms ease, transform 680ms ease";
            observer.observe(item);
        });
    }

    function initGsap() {
        if (!window.gsap || reduceMotion) return false;

        const { gsap } = window;

        if (window.ScrollTrigger) {
            gsap.registerPlugin(window.ScrollTrigger);
        }

        gsap.from("[data-animate='hero']", {
            autoAlpha: 0,
            y: 28,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12
        });

        document.querySelectorAll("[data-animate='fade']").forEach((element) => {
            gsap.from(element, {
                autoAlpha: 0,
                y: 32,
                duration: 0.85,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 82%"
                }
            });
        });

        gsap.utils.toArray("[data-animate='card']").forEach((card) => {
            gsap.from(card, {
                autoAlpha: 0,
                y: 38,
                duration: 0.75,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 86%"
                }
            });
        });

        document.querySelectorAll(".meter span").forEach((meter) => {
            gsap.from(meter, {
                scaleX: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: meter,
                    start: "top 90%"
                }
            });
        });

        gsap.to(".portrait-frame", {
            y: -22,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        gsap.to(".intel-panel", {
            y: -14,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        return true;
    }

    function initProjectFilters() {
        const buttons = document.querySelectorAll(".filter-btn");
        const cards = document.querySelectorAll(".project-card");

        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                const filter = button.dataset.filter || "all";

                buttons.forEach((item) => item.classList.remove("active"));
                button.classList.add("active");

                cards.forEach((card) => {
                    const categories = card.dataset.category || "";
                    const show = filter === "all" || categories.split(" ").includes(filter);

                    card.classList.toggle("is-hidden", !show);

                    if (show && window.gsap && !reduceMotion) {
                        window.gsap.fromTo(card, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out" });
                    }
                });
            });
        });
    }

    function initContactForm() {
        const form = document.getElementById("contactForm");
        if (!form) return;

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const name = String(formData.get("name") || "").trim();
            const email = String(formData.get("email") || "").trim();
            const message = String(formData.get("message") || "").trim();

            if (!name || !email || !message) return;

            const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
            const bodyText = [
                `Name: ${name}`,
                `Email: ${email}`,
                "",
                message
            ].join("\n");

            window.location.href = `mailto:alirayyancyber@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
            form.reset();
        });
    }

    function initSignalCanvas() {
        const canvas = document.getElementById("signalCanvas");
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        let width = 0;
        let height = 0;
        let points = [];
        let rafId = 0;
        const colors = ["rgba(107, 244, 166, 0.9)", "rgba(100, 216, 255, 0.82)", "rgba(255, 209, 102, 0.78)"];

        function resize() {
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = rect.width;
            height = rect.height;
            canvas.width = Math.max(1, Math.floor(width * dpr));
            canvas.height = Math.max(1, Math.floor(height * dpr));
            context.setTransform(dpr, 0, 0, dpr, 0, 0);

            const count = width < 520 ? 28 : 42;
            points = Array.from({ length: count }, (_, index) => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.34,
                vy: (Math.random() - 0.5) * 0.34,
                r: Math.random() * 1.8 + 1.2,
                color: colors[index % colors.length]
            }));
        }

        function drawGrid() {
            context.strokeStyle = "rgba(218, 255, 229, 0.055)";
            context.lineWidth = 1;

            for (let x = 0; x <= width; x += 44) {
                context.beginPath();
                context.moveTo(x, 0);
                context.lineTo(x, height);
                context.stroke();
            }

            for (let y = 0; y <= height; y += 44) {
                context.beginPath();
                context.moveTo(0, y);
                context.lineTo(width, y);
                context.stroke();
            }
        }

        function draw() {
            context.clearRect(0, 0, width, height);
            drawGrid();

            for (let i = 0; i < points.length; i += 1) {
                const point = points[i];
                point.x += point.vx;
                point.y += point.vy;

                if (point.x < 0 || point.x > width) point.vx *= -1;
                if (point.y < 0 || point.y > height) point.vy *= -1;

                for (let j = i + 1; j < points.length; j += 1) {
                    const other = points[j];
                    const dx = point.x - other.x;
                    const dy = point.y - other.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 118) {
                        const alpha = 1 - distance / 118;
                        context.strokeStyle = `rgba(107, 244, 166, ${alpha * 0.18})`;
                        context.lineWidth = 1;
                        context.beginPath();
                        context.moveTo(point.x, point.y);
                        context.lineTo(other.x, other.y);
                        context.stroke();
                    }
                }

                context.fillStyle = point.color;
                context.beginPath();
                context.arc(point.x, point.y, point.r, 0, Math.PI * 2);
                context.fill();
            }

            if (!reduceMotion) {
                rafId = window.requestAnimationFrame(draw);
            }
        }

        resize();
        draw();

        window.addEventListener("resize", () => {
            window.cancelAnimationFrame(rafId);
            resize();
            draw();
        });
    }

    initThemeToggle();
    startTypewriter();
    if (!initGsap()) {
        initFallbackMotion();
    }
    initProjectFilters();
    initContactForm();
    initSignalCanvas();
});
