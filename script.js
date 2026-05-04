document.addEventListener("DOMContentLoaded", function () {

    /* =====================
       1. HAMBURGER MENU TOGGLE
    ===================== */
    const nav        = document.querySelector("nav");
    const menuBtn    = document.getElementById("menu-btn");
    const navList    = document.getElementById("nav-list");

    if (menuBtn && navList) {
        menuBtn.addEventListener("click", function () {
            const isOpen = navList.classList.toggle("open");

            // Update aria-expanded for accessibility
            menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");

            // Animate hamburger icon via class on nav
            nav.classList.toggle("active", isOpen);
        });
    }

    // Close menu when a nav link is clicked (mobile UX)
    if (navList) {
        navList.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", function () {
                navList.classList.remove("open");
                nav.classList.remove("active");
                if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
            });
        });
    }


    /* =====================
       2. SMOOTH SCROLL
    ===================== */
    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            const href = this.getAttribute("href");

            // Only intercept anchor links (starts with #)
            if (href && href.startsWith("#")) {
                e.preventDefault();
                const targetSection = document.querySelector(href);

                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: "smooth" });
                }
            }
        });
    });


    /* =====================
       3. PROJECT FILTER
    ===================== */
    const filterBtns  = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-list article");

    function filterProjects(category) {
        projectCards.forEach(card => {
            const cardCategory = card.dataset.category;

            if (category === "all" || cardCategory === category) {
                card.style.display = "";
                // Animate in
                card.style.opacity  = "0";
                card.style.transform = "translateY(16px)";
                requestAnimationFrame(() => {
                    card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
                    card.style.opacity  = "1";
                    card.style.transform = "translateY(0)";
                });
            } else {
                card.style.display = "none";
            }
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            // Remove active class from all buttons, add to clicked
            filterBtns.forEach(b => b.classList.remove("active"));
            this.classList.add("active");

            const filter = this.dataset.filter;
            filterProjects(filter);
        });
    });

    // Expose globally (optional, for external use)
    window.filterProjects = filterProjects;


    /* =====================
       4. LIGHTBOX IMAGE
    ===================== */
    const projectImages = document.querySelectorAll(".project-list figure img");

    // Create modal elements
    const modal    = document.createElement("div");
    modal.id       = "modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Image Lightbox");

    const modalImg = document.createElement("img");
    modalImg.setAttribute("alt", ""); // decorative in modal context

    modal.appendChild(modalImg);
    document.body.appendChild(modal);

    // Open lightbox on image click
    projectImages.forEach(img => {
        img.style.cursor = "zoom-in";

        img.addEventListener("click", function () {
            modalImg.src = this.src;
            modalImg.alt = this.alt; // preserve alt for screen readers
            modal.style.display = "flex";
            document.body.style.overflow = "hidden"; // prevent background scroll
        });
    });

    // Close lightbox on modal click
    modal.addEventListener("click", function (e) {
        // Only close if clicking backdrop, not the image itself
        if (e.target === modal) {
            modal.style.display = "none";
            document.body.style.overflow = "";
        }
    });

    // Close lightbox on Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && modal.style.display === "flex") {
            modal.style.display = "none";
            document.body.style.overflow = "";
        }
    });


    /* =====================
       5. CONTACT FORM VALIDATION
    ===================== */
    const form         = document.getElementById("contact-form");
    const nameInput    = document.getElementById("name");
    const emailInput   = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const successMsg   = document.getElementById("form-success");

    function showError(input, errorId, message) {
        const errorEl = document.getElementById(errorId);
        input.classList.add("invalid");
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add("visible");
        }
    }

    function clearError(input, errorId) {
        const errorEl = document.getElementById(errorId);
        input.classList.remove("invalid");
        if (errorEl) {
            errorEl.textContent = "";
            errorEl.classList.remove("visible");
        }
    }

    // Real-time validation on blur
    if (nameInput) {
        nameInput.addEventListener("blur", () => {
            if (!nameInput.value.trim()) {
                showError(nameInput, "name-error", "Name is required.");
            } else {
                clearError(nameInput, "name-error");
            }
        });
    }

    if (emailInput) {
        emailInput.addEventListener("blur", () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim()) {
                showError(emailInput, "email-error", "Email is required.");
            } else if (!emailRegex.test(emailInput.value)) {
                showError(emailInput, "email-error", "Please enter a valid email address.");
            } else {
                clearError(emailInput, "email-error");
            }
        });
    }

    if (messageInput) {
        messageInput.addEventListener("blur", () => {
            if (!messageInput.value.trim()) {
                showError(messageInput, "message-error", "Message cannot be empty.");
            } else {
                clearError(messageInput, "message-error");
            }
        });
    }

    // Form submission validation
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            let isValid = true;

            // Validate name
            if (!nameInput.value.trim()) {
                showError(nameInput, "name-error", "Name is required.");
                isValid = false;
            } else {
                clearError(nameInput, "name-error");
            }

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim()) {
                showError(emailInput, "email-error", "Email is required.");
                isValid = false;
            } else if (!emailRegex.test(emailInput.value)) {
                showError(emailInput, "email-error", "Please enter a valid email address.");
                isValid = false;
            } else {
                clearError(emailInput, "email-error");
            }

            // Validate message
            if (!messageInput.value.trim()) {
                showError(messageInput, "message-error", "Message cannot be empty.");
                isValid = false;
            } else {
                clearError(messageInput, "message-error");
            }

            // If all valid, show success
            if (isValid) {
                if (successMsg) {
                    successMsg.textContent = "✅ Your message has been sent successfully!";
                    successMsg.classList.add("visible");
                }
                form.reset();

                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMsg.textContent = "";
                    successMsg.classList.remove("visible");
                }, 5000);
            }
        });
    }


    /* =====================
       6. ACTIVE NAV HIGHLIGHT ON SCROLL
    ===================== */
    const sections = document.querySelectorAll("section[id]");

    function highlightNav() {
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop    = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId     = section.getAttribute("id");

            const correspondingLink = document.querySelector(`nav a[href="#${sectionId}"]`);
            if (!correspondingLink) return;

            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                correspondingLink.style.color      = "white";
                correspondingLink.style.background = "rgba(108, 99, 255, 0.25)";
            } else {
                correspondingLink.style.color      = "";
                correspondingLink.style.background = "";
            }
        });
    }

    window.addEventListener("scroll", highlightNav, { passive: true });

});