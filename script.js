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
          setTimeout(() => firstSection.classList.add("is-visible"), 100); // Slight delay for smoother transition
        }
        setTimeout(() => (loadingScreen.style.display = "none"), 500); // Remove from layout after fade
      }, 300);
    }
  }, 50);

  // --- Starry Background & Parallax ---
  const starrySky = document.querySelector(".starry-sky");
  const layers = starrySky.querySelectorAll(".parallax-layer");
  const numStarsPerLayer = 50; // Stars per parallax layer

  layers.forEach((layer, layerIndex) => {
    const depth = parseFloat(layer.dataset.depth);
    for (let i = 0; i < numStarsPerLayer; i++) {
      const star = document.createElement("div");
      star.classList.add("star");
      const size = Math.random() * (2.5 - 0.5) + 0.5; // Star size between 0.5px and 2.5px
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 2}s`; // Randomize twinkle start
      star.dataset.depth = depth; // Store depth for parallax calculation
      layer.appendChild(star);
    }
  });

  // Simple parallax on scroll for stars
  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset;
    layers.forEach((layer) => {
      const depth = layer.dataset.depth;
      const movement = -(scrollTop * depth * 0.3); // Adjust multiplier for more/less effect
      layer.style.transform = `translateY(${movement}px)`;
    });
  });

  // --- Animated Name ---
  const nameElement = document.getElementById("animated-name");
  const nameText = nameElement.textContent; // Keep original text for reference if needed
  // It's better to define the name parts explicitly for styling
  const firstName = "UGYEN";
  const lastName = "DORJI";
  nameElement.innerHTML = ""; // Clear original content

  (firstName + " " + lastName).split("").forEach((char, index) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.display = "inline-block";

    if (char === " ") {
      span.style.width = "0.5em"; // Adjust space width if needed
    } else {
      span.style.animation = `textPopIn 0.5s ease-out ${
        index * 0.05
      }s forwards`;
      span.style.opacity = "0";
      // Apply neon class based on which part of the name it is
      if (index < firstName.length) {
        // Characters belonging to "ALEX"
        span.classList.add("neon-text-cyan");
      } else if (index > firstName.length) {
        // Characters belonging to "XENON" (index firstName.length is the space)
        span.classList.add("neon-text-magenta");
      }
    }
    nameElement.appendChild(span);
  });

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
        // Calculate offset for fixed header
        const headerOffset =
          document.getElementById("main-header").offsetHeight;
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

  // Active nav link highlighting on scroll
  const sections = document.querySelectorAll("section");
  window.addEventListener("scroll", () => {
    let current = "";
    const headerHeight = document.getElementById("main-header").offsetHeight;
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - headerHeight - 50; // Adjusted for header and a bit of margin
      if (pageYOffset >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").substring(1) === current) {
        link.classList.add("active");
      }
    });
    // Default to 'home' if at the very top
    if (window.pageYOffset < sections[0].offsetTop - headerHeight - 50) {
      navLinks.forEach((link) => link.classList.remove("active"));
      const homeLink = document.querySelector('nav a[href="#home"]');
      if (homeLink) homeLink.classList.add("active");
    }
  });
  // Set initial active link
  if (
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
    root: null, // relative to document viewport
    rootMargin: "0px",
    threshold: 0.1, // 10% of item is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        if (entry.target.id === "skills") {
          animateSkillBars();
        }
        // observer.unobserve(entry.target); // Optional: stop observing after faded in
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
      bar.style.width = level;
    });
  }
  // Initial check in case skills section is already visible on load (unlikely with loading screen)
  const skillsSection = document.getElementById("skills");
  if (skillsSection && skillsSection.classList.contains("is-visible")) {
    animateSkillBars();
  }

  // --- Contact Form ---
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    formStatus.textContent = "Initializing transmission sequence...";
    formStatus.className = "text-cyan-400";

    // Simulate API call
    setTimeout(() => {
      // const formData = new FormData(contactForm);
      // const name = formData.get('name');
      // console.log('Form Data:', Object.fromEntries(formData));

      formStatus.textContent =
        "Transmission successful! Your message is traversing the cosmos.";
      formStatus.className = "text-green-400 neon-text-cyan"; // Use a success color
      contactForm.reset();
      setTimeout(() => (formStatus.textContent = ""), 5000); // Clear status after 5s
    }, 2000);
  });

  // --- Current Year for Footer ---
  document.getElementById("current-year").textContent =
    new Date().getFullYear();

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

  musicToggle.innerHTML = playIconSVG; // Start with play icon

  async function setupMusic() {
    await Tone.start(); // Required for audio context in browsers
    console.log("Audio Context started by Tone.js");

    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" }, // Gentler sound
      envelope: {
        attack: 2, // Slow attack
        decay: 1,
        sustain: 0.4,
        release: 4, // Slow release
      },
      volume: -20, // Lower volume
    }).toDestination();

    // A simple, ambient, spacey sequence
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
      synth.triggerAttackRelease(value.note, value.duration, time);
    }, sequence).start(0);
    loop.loop = true;
    loop.loopEnd = "4m"; // Loop the 4-measure sequence
    Tone.Transport.bpm.value = 60; // Slow tempo
  }

  musicToggle.addEventListener("click", async () => {
    if (!Tone.context.state || Tone.context.state !== "running") {
      await Tone.start(); // Ensure audio context is running, especially on first click
      console.log("Audio Context explicitly started on click.");
    }

    if (!synth) {
      // First click, setup music
      try {
        await setupMusic(); // This already calls Tone.start()
        // Music setup might have already started transport if Tone.start() was called by user gesture
        if (Tone.Transport.state !== "started") {
          Tone.Transport.start();
        }
        // loop.start(0); // Ensure loop is started - setupMusic already starts the part
        isMusicPlaying = true;
        musicToggle.innerHTML = muteIconSVG;
        musicToggle.setAttribute("aria-label", "Mute Music");
      } catch (error) {
        console.error("Error setting up music:", error);
        if (formStatus) {
          // Check if formStatus exists
          formStatus.textContent = "Error initializing audio systems.";
          formStatus.className = "text-red-400";
        }
        return;
      }
    } else {
      // Subsequent clicks
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
});
