// Script kecil untuk interaksi:
// - Toggle menu navigasi di mobile
// - Animasi fade-in saat elemen masuk viewport
// - Tahun dinamis di footer

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  // Toggle navigasi mobile
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      body.classList.toggle("nav-open");
    });

    // Tutup menu ketika salah satu link diklik (di mobile)
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        body.classList.remove("nav-open");
      });
    });
  }

  // Animasi fade-in menggunakan IntersectionObserver
  const fadeEls = document.querySelectorAll(".fade-in");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Optional: stop observing setelah terlihat
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
      }
    );

    fadeEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback sederhana jika browser tidak support
    fadeEls.forEach((el) => el.classList.add("visible"));
  }

  // Tahun dinamis di footer
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Efek ketikan pada judul hero
  const heading = document.querySelector(".typewriter-heading");
  if (heading) {
    const fullText = heading.textContent.trim();
    heading.textContent = "";
    let index = 0;

    const typeNext = () => {
      if (index <= fullText.length) {
        heading.textContent = fullText.slice(0, index);
        index += 1;
        setTimeout(typeNext, 35);
      } else {
        heading.classList.add("done");
      }
    };

    // Sedikit delay sebelum mulai supaya terasa lebih halus
    setTimeout(typeNext, 350);
  }

  // Parallax Effect untuk background hero
  const heroSection = document.querySelector(".hero-section");
  const wallpaper = document.querySelector(".parallax-wallpaper");

  if (heroSection && wallpaper && window.innerWidth > 768) {
    let ticking = false;
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.pageX;
      mouseY = e.pageY;

      if (!ticking) {
        requestAnimationFrame(() => {
          // Calculate movement relative to center of screen
          const x = (window.innerWidth / 2 - mouseX) / 60;
          const y = (window.innerHeight / 2 - mouseY) / 60;

          const speed = 2; // subtle speed
          const xOffset = x * speed;
          const yOffset = y * speed;

          // Apply transform
          wallpaper.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // Klik pada product-card mengarahkan ke kontak (scroll lancar)
  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach((card) => {
    card.addEventListener("click", () => {
      const target = document.getElementById("kontak");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        // Update hash tanpa mental scroll jika ingin tetap ada di URL
        history.pushState(null, null, "#kontak");
      }
    });
  });

  // WhatsApp Modal Logic
  const waLink = document.getElementById("wa-link");
  const waModal = document.getElementById("wa-modal");
  const modalClose = document.querySelector(".modal-close");
  const modalOverlay = document.querySelector(".modal-overlay");

  if (waLink && waModal) {
    waLink.addEventListener("click", (e) => {
      e.preventDefault();
      waModal.classList.remove("hidden");
      // Force reflow
      waModal.offsetWidth;
      waModal.classList.add("active");
    });

    const closeModal = () => {
      waModal.classList.remove("active");
      waModal.addEventListener('transitionend', function handler() {
        if (!waModal.classList.contains('active')) {
          waModal.classList.add("hidden");
        }
        waModal.removeEventListener('transitionend', handler);
      });
    };

    if (modalClose) modalClose.addEventListener("click", closeModal);
    if (modalOverlay) {
      modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
      });
    }

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && waModal.classList.contains("active")) closeModal();
    });
  }

  // Section Navigator Logic
  const sectionNavToggle = document.getElementById("sectionNavToggle");
  const sectionNavMenu = document.getElementById("sectionNavMenu");
  const navMenuItems = document.querySelectorAll(".nav-menu-item");

  if (sectionNavToggle && sectionNavMenu) {
    // Check if mobile
    const isMobile = () => window.innerWidth <= 640;

    // Update arrow direction based on scroll position (mobile only)
    const updateArrowDirection = () => {
      if (!isMobile()) return;

      const scrollY = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      // At top (first ~20% of page)
      if (scrollY < windowHeight * 0.2) {
        sectionNavToggle.classList.remove('arrow-both');
        sectionNavToggle.classList.add('arrow-down');
      }
      // At bottom (last ~20% of page)
      else if (scrollY + windowHeight > docHeight - windowHeight * 0.2) {
        sectionNavToggle.classList.remove('arrow-both', 'arrow-down');
      }
      // In middle
      else {
        sectionNavToggle.classList.remove('arrow-down');
        sectionNavToggle.classList.add('arrow-both');
      }
    };

    // Toggle menu visibility (desktop only)
    sectionNavToggle.addEventListener("click", () => {
      if (isMobile()) {
        // Mobile: scroll based on arrow state
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;

        // If at top, scroll down
        if (scrollY < windowHeight * 0.2) {
          window.scrollBy({ top: windowHeight, behavior: 'smooth' });
        }
        // If at bottom, scroll up
        else if (scrollY + windowHeight > docHeight - windowHeight * 0.2) {
          window.scrollBy({ top: -windowHeight, behavior: 'smooth' });
        }
        // In middle, scroll down
        else {
          window.scrollBy({ top: windowHeight, behavior: 'smooth' });
        }
      } else {
        // Desktop: toggle menu
        sectionNavToggle.classList.toggle("active");
        sectionNavMenu.classList.toggle("active");
      }
    });

    // Handle section navigation (desktop only)
    navMenuItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = item.getAttribute("data-section");
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth" });
          // Close menu after navigation
          sectionNavToggle.classList.remove("active");
          sectionNavMenu.classList.remove("active");
        }
      });
    });

    // Update active state based on scroll position
    let scrollTicking = false;
    const updateActiveSection = () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          const sections = document.querySelectorAll("section[id]");
          const scrollY = window.pageYOffset;

          sections.forEach((section) => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
              navMenuItems.forEach((item) => {
                if (item.getAttribute("data-section") === sectionId) {
                  if (!item.classList.contains("active")) {
                    navMenuItems.forEach(i => i.classList.remove("active"));
                    item.classList.add("active");
                  }
                }
              });
            }
          });

          // Update arrow direction on mobile
          updateArrowDirection();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };

    // Listen to scroll events
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    // Initial check
    updateActiveSection();

    // Close menu when clicking outside (desktop only)
    document.addEventListener("click", (e) => {
      if (!isMobile() && !sectionNavToggle.contains(e.target) && !sectionNavMenu.contains(e.target)) {
        sectionNavToggle.classList.remove("active");
        sectionNavMenu.classList.remove("active");
      }
    });
  }

  // ================= PRODUCT STATUS CONFIGURATION =================
  // Individual product statuses: 'ready', 'preorder', or 'habis'
  const productStatus = {
    robux400: 'preorder',
    robux800: 'ready',
    robux1000: 'ready'
  };

  // Global override - when true, ALL products become 'habis' regardless of individual settings
  const isOutOfStock = false;
  // =================================================================

  // Function to apply product statuses
  const applyProductStatus = () => {
    // Get all product cards
    const products = [
      { id: 'robux400', element: document.querySelector('[data-product="robux400"]') },
      { id: 'robux800', element: document.querySelector('[data-product="robux800"]') },
      { id: 'robux1000', element: document.querySelector('[data-product="robux1000"]') }
    ];

    products.forEach(({ id, element }) => {
      if (!element) return;

      // Determine actual status (global override takes precedence)
      const actualStatus = isOutOfStock ? 'habis' : productStatus[id];

      // Remove all status classes
      element.classList.remove('status-ready', 'status-preorder', 'status-habis');

      // Add current status class
      element.classList.add(`status-${actualStatus}`);

      // Handle recommendation text visibility (only show for 'ready' status)
      const recommendationText = element.querySelector('.recommendation-text');
      if (recommendationText) {
        if (actualStatus === 'ready') {
          recommendationText.style.display = 'block';
        } else {
          recommendationText.style.display = 'none';
        }
      }

      // Update pill/badge text and styling
      const pill = element.querySelector('.pill');
      if (pill) {
        pill.classList.remove('ready', 'pre-order', 'status-habis');

        switch (actualStatus) {
          case 'ready':
            pill.textContent = 'Ready Stok';
            pill.classList.add('ready');
            break;
          case 'preorder':
            pill.textContent = 'Pre-Order';
            pill.classList.add('pre-order');
            break;
          case 'habis':
            pill.textContent = 'Habis';
            pill.classList.add('status-habis');
            break;
        }
      }
    });
  };

  // Apply statuses on page load
  applyProductStatus();

  // FAQ Accordion Logic
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    if (question) {
      question.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        // Optional: Close other FAQ items when one is opened (accordion behavior)
        faqItems.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains("active")) {
            otherItem.classList.remove("active");
            const otherQuestion = otherItem.querySelector(".faq-question");
            if (otherQuestion) {
              otherQuestion.setAttribute("aria-expanded", "false");
            }
          }
        });

        // Toggle current item
        const willOpen = !isActive;
        item.classList.toggle("active");
        question.setAttribute("aria-expanded", willOpen ? "true" : "false");

        // Scroll to item if opening (especially useful on mobile)
        if (willOpen) {
          // Increase delay to 300ms so it calculates after the other item has mostly collapsed
          setTimeout(() => {
            item.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }, 300);
        }
      });
    }
  });

  // Stock Modal Logic
  const stockModal = document.getElementById("stock-modal");
  const stockCloseBtn = document.getElementById("stock-modal-close");
  const stockStayBtn = document.getElementById("stock-modal-stay");
  const stockToContact = document.getElementById("stock-to-contact");

  if (isOutOfStock && stockModal) {
    // Munculkan modal setelah sedikit delay agar efek transisinya terlihat bagus
    setTimeout(() => {
      stockModal.classList.remove("hidden");
      stockModal.offsetWidth; // force reflow
      stockModal.classList.add("active");
    }, 500);

    const closeStockModal = () => {
      stockModal.classList.remove("active");
      stockModal.addEventListener('transitionend', function handler() {
        if (!stockModal.classList.contains('active')) {
          stockModal.classList.add("hidden");
        }
        stockModal.removeEventListener('transitionend', handler);
      });
    };

    if (stockCloseBtn) stockCloseBtn.addEventListener("click", closeStockModal);
    if (stockStayBtn) stockStayBtn.addEventListener("click", closeStockModal);
    if (stockToContact) stockToContact.addEventListener("click", closeStockModal);

    // Klik di luar modal untuk menutup
    stockModal.addEventListener("click", (e) => {
      if (e.target === stockModal) closeStockModal();
    });
  }
});


