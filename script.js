document.addEventListener("DOMContentLoaded", () => {
  // --- Loading Screen ---
  const loadingScreen = document.getElementById("loading-screen");
  const progressBar = document.getElementById("loading-progress-bar");
  let loadProgress = 0;
  const loadInterval = setInterval(() => {
    loadProgress += 5; // Simulate loading progress
    progressBar.style.width = loadProgress + "%";
    if (loadProgress >= 100) {
      clearInterval(loadInterval);
      setTimeout(() => {
        loadingScreen.style.opacity = "0";
        // Trigger fade-in for the first section after loading
        const firstSection = document.querySelector(".fade-in-section");
        if (firstSection) {
          setTimeout(() => firstSection.classList.add("is-visible"), 100); // Slight delay
        }
        setTimeout(() => (loadingScreen.style.display = "none"), 500); // Remove from layout
      }, 300);
    }
  }, 50);

  // --- Starry Background & Parallax ---
  const starrySky = document.querySelector(".starry-sky");
  const layers = starrySky.querySelectorAll(".parallax-layer");
  const numStarsPerLayer = 50;

  layers.forEach((layer, layerIndex) => {
    const depth = parseFloat(layer.dataset.depth);
    for (let i = 0; i < numStarsPerLayer; i++) {
      const star = document.createElement("div");
      star.classList.add("star");
      const size = Math.random() * (2.5 - 0.5) + 0.5;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 2}s`;
      star.dataset.depth = depth;
      layer.appendChild(star);
    }
  });

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset;
    layers.forEach((layer) => {
      const depth = layer.dataset.depth;
      const movement = -(scrollTop * depth * 0.3);
      layer.style.transform = `translateY(${movement}px)`;
    });
  });

  // --- Animated Name ---
  const nameElement = document.getElementById("animated-name");
  const firstName = "UGYEN";
  const lastName = "DORJI";
  if (nameElement) {
    nameElement.innerHTML = ""; // Clear original content
    (firstName + " " + lastName).split("").forEach((char, index) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.display = "inline-block";

      if (char === " ") {
        span.style.width = "0.5em";
      } else {
        span.style.animation = `textPopIn 0.5s ease-out ${
          index * 0.05
        }s forwards`;
        span.style.opacity = "0";
        if (index < firstName.length) {
          span.classList.add("neon-text-cyan");
        } else if (index > firstName.length) {
          span.classList.add("neon-text-magenta");
        }
      }
      nameElement.appendChild(span);
    });
  }

  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
          @keyframes textPopIn {
            0% { opacity: 0; transform: translateY(20px) scale(0.8); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
        `;
  document.head.appendChild(styleSheet);

  // --- Smooth Scrolling & Active Nav Link ---
  const navLinks = document.querySelectorAll("nav a.nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerEl = document.getElementById("main-header");
        const headerOffset = headerEl ? headerEl.offsetHeight : 0;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  const sections = document.querySelectorAll("section");
  window.addEventListener("scroll", () => {
    let current = "";
    const headerEl = document.getElementById("main-header");
    const headerHeight = headerEl ? headerEl.offsetHeight : 0;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - headerHeight - 50;
      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (
        link.getAttribute("href") &&
        link.getAttribute("href").substring(1) === current
      ) {
        link.classList.add("active");
      }
    });

    if (
      sections.length > 0 &&
      window.pageYOffset < sections[0].offsetTop - headerHeight - 50
    ) {
      navLinks.forEach((link) => link.classList.remove("active"));
      const homeLink = document.querySelector('nav a[href="#home"]');
      if (homeLink) homeLink.classList.add("active");
    }
  });

  if (
    sections.length > 0 &&
    document.getElementById("main-header") &&
    window.pageYOffset <
      sections[0].offsetTop -
        document.getElementById("main-header").offsetHeight -
        50
  ) {
    const homeLink = document.querySelector('nav a[href="#home"]');
    if (homeLink) homeLink.classList.add("active");
  }

  // --- Fade-in Sections on Scroll ---
  const fadeInSections = document.querySelectorAll(".fade-in-section");
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        if (entry.target.id === "skills") {
          animateSkillBars();
        }
        // obs.unobserve(entry.target); // Optional
      }
    });
  }, observerOptions);

  fadeInSections.forEach((section) => {
    observer.observe(section);
  });

  // --- Skill Bar Animation ---
  function animateSkillBars() {
    const skillBars = document.querySelectorAll(".skill-bar");
    skillBars.forEach((bar) => {
      const level = bar.getAttribute("data-skill-level");
      if (level) {
        bar.style.width = level;
      }
    });
  }
  const skillsSection = document.getElementById("skills");
  if (skillsSection && skillsSection.classList.contains("is-visible")) {
    animateSkillBars();
  }

  // --- EmailJS Initialization ---
  const EMAILJS_PUBLIC_KEY = "ElYD4y7oaAD1A9lxw"; // Your actual Public Key
  const formStatusGlobal = document.getElementById("form-status"); // For displaying init errors

  if (typeof emailjs !== "undefined") {
    try {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      console.log("EmailJS SDK initialized.");
    } catch (e) {
      console.error("Failed to initialize EmailJS:", e);
      if (formStatusGlobal) {
        formStatusGlobal.textContent = "Email service initialization failed.";
        formStatusGlobal.className = "text-red-400";
      }
    }
  } else {
    console.warn("EmailJS SDK not found. Email functionality will not work.");
    if (formStatusGlobal) {
      formStatusGlobal.textContent =
        "Email service is currently unavailable (SDK not loaded).";
      formStatusGlobal.className = "text-red-400";
    }
  }

  // --- Contact Form ---
  const contactForm = document.getElementById("contact-form");
  // formStatus is already declared as formStatusGlobal, let's reuse or rename for clarity if needed
  // For this specific handler, formStatus is fine.
  const formStatus = document.getElementById("form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Check if EmailJS is loaded and Public Key is set (not the placeholder)
      if (
        typeof emailjs === "undefined" ||
        !EMAILJS_PUBLIC_KEY ||
        EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY" // Checks against original placeholder
      ) {
        if (formStatus) {
          formStatus.textContent =
            "Email service is not configured correctly. Cannot send message.";
          formStatus.className = "text-red-400";
        }
        console.error(
          "EmailJS SDK not loaded, not initialized, or Public Key not set/placeholder used."
        );
        if (EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
          alert(
            "CRITICAL: EmailJS Public Key is still set to the placeholder 'YOUR_PUBLIC_KEY' in script.js. Please update it with your actual key."
          );
        }
        return;
      }

      if (formStatus) {
        formStatus.textContent = "Initializing transmission sequence...";
        formStatus.className = "text-cyan-400";
      }

      const SERVICE_ID = "service_vlh2m65"; // Your actual Service ID
      const TEMPLATE_ID = "template_4mft8vr"; // Your actual Template ID

      // Check if Service ID or Template ID are still placeholders
      if (
        SERVICE_ID === "YOUR_SERVICE_ID" || // Checks against original placeholder
        TEMPLATE_ID === "YOUR_TEMPLATE_ID" // Checks against original placeholder
      ) {
        if (formStatus) {
          formStatus.textContent =
            "Email service IDs not configured (placeholders found). Cannot send message.";
          formStatus.className = "text-red-400";
        }
        alert(
          "CRITICAL: EmailJS Service ID or Template ID are still set to placeholders ('YOUR_SERVICE_ID' or 'YOUR_TEMPLATE_ID') in script.js. Please update them."
        );
        return;
      }

      emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, this).then(
        () => {
          if (formStatus) {
            formStatus.textContent =
              "Transmission successful! Your message is traversing the cosmos.";
            formStatus.className = "text-green-400 neon-text-cyan";
          }
          contactForm.reset();
          setTimeout(() => {
            if (formStatus) formStatus.textContent = "";
          }, 5000);
        },
        (error) => {
          console.error("EmailJS send error:", error);
          if (formStatus) {
            formStatus.textContent = `Transmission failed: ${
              error.text || "Please try again later."
            }`;
            formStatus.className = "text-red-400";
          }
        }
      );
    });
  } else {
    console.warn("Contact form element (#contact-form) not found.");
  }

  // --- Current Year for Footer ---
  const currentYearEl = document.getElementById("current-year");
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // --- Background Music Toggle ---
  const musicToggle = document.getElementById("music-toggle");
  let synth, loop;
  let isMusicPlaying = false;

  const playIconSVG = `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z"></path>
    </svg>`;
  const muteIconSVG = `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"></path>
    </svg>`;

  if (musicToggle) {
    musicToggle.innerHTML = playIconSVG; // Start with play icon

    async function setupMusic() {
      if (typeof Tone === "undefined") {
        console.error("Tone.js is not loaded. Music cannot be played.");
        // Using formStatusGlobal here as formStatus might be specific to contact form handler
        if (formStatusGlobal) {
          formStatusGlobal.textContent = "Audio library (Tone.js) not loaded.";
          formStatusGlobal.className = "text-red-400";
        }
        return false;
      }

      await Tone.start();
      console.log("Audio Context started by Tone.js");

      synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sine" },
        envelope: {
          attack: 2,
          decay: 1,
          sustain: 0.4,
          release: 4,
        },
        volume: -20,
      }).toDestination();

      const sequence = [
        { time: "0:0", note: "C3", duration: "2m" },
        { time: "0:2", note: "G3", duration: "2m" },
        { time: "1:0", note: "E3", duration: "2m" },
        { time: "1:2", note: "A2", duration: "2m" },
        { time: "2:0", note: "F3", duration: "2m" },
        { time: "2:2", note: "C4", duration: "2m" },
        { time: "3:0", note: "D3", duration: "2m" },
        { time: "3:2", note: "G2", duration: "2m" },
      ];

      loop = new Tone.Part((time, value) => {
        if (synth) synth.triggerAttackRelease(value.note, value.duration, time);
      }, sequence).start(0);
      loop.loop = true;
      loop.loopEnd = "4m";
      Tone.Transport.bpm.value = 60;
      return true;
    }

    musicToggle.addEventListener("click", async () => {
      if (typeof Tone === "undefined") {
        alert("Audio library (Tone.js) is not loaded.");
        return;
      }

      if (!Tone.context.state || Tone.context.state !== "running") {
        await Tone.start();
        console.log("Audio Context explicitly started on click.");
      }

      if (!synth) {
        try {
          const musicSetupSuccess = await setupMusic();
          if (!musicSetupSuccess) return;

          if (Tone.Transport.state !== "started") {
            Tone.Transport.start();
          }
          isMusicPlaying = true;
          musicToggle.innerHTML = muteIconSVG;
          musicToggle.setAttribute("aria-label", "Mute Music");
        } catch (error) {
          console.error("Error setting up music:", error);
          if (formStatusGlobal) {
            formStatusGlobal.textContent = "Error initializing audio systems.";
            formStatusGlobal.className = "text-red-400";
          }
          return;
        }
      } else {
        if (isMusicPlaying) {
          Tone.Transport.pause();
          isMusicPlaying = false;
          musicToggle.innerHTML = playIconSVG;
          musicToggle.setAttribute("aria-label", "Play Music");
        } else {
          if (Tone.Transport.state !== "started") {
            Tone.Transport.start();
          }
          isMusicPlaying = true;
          musicToggle.innerHTML = muteIconSVG;
          musicToggle.setAttribute("aria-label", "Mute Music");
        }
      }
    });
  } else {
    console.warn("Music toggle button (#music-toggle) not found.");
  }
});
