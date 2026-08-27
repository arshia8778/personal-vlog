const links = document.querySelectorAll(".navbar-nav .nav-link");
const nav = document.querySelector(".navbar-nav");
const sections = document.querySelectorAll("section");
const navbar = document.querySelector(".navbar");
const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("navbarNavAltMarkup");
const starsContainer = document.querySelector(".stars");
const backToTop = document.getElementById("backToTop");
const loader = document.getElementById("loader");
const siteWrapper = document.querySelector(".site-wrapper");
const loaderLine = document.querySelector(".loader-line span");
const loaderPercent = document.querySelector(".loader-percent");
const typingText = document.getElementById("typingText");

function moveLine(link) {
  if (!link || !nav) return;

  if (window.innerWidth <= 991.98) {
    nav.style.setProperty("--line-width", "0px");
    return;
  }

  const linkRect = link.getBoundingClientRect();
  const navRect = nav.getBoundingClientRect();

  const right = navRect.right - linkRect.right;

  nav.style.setProperty("--line-right", `${right}px`);
  nav.style.setProperty("--line-width", `${linkRect.width}px`);
}

function setActiveLink(sectionId) {
  const targetLink = document.querySelector(
    `.nav-link[data-section="${sectionId}"]`,
  );

  if (!targetLink) return;

  links.forEach((link) => {
    link.classList.remove("active");
  });

  targetLink.classList.add("active");

  requestAnimationFrame(() => {
    moveLine(targetLink);
  });
}

function openMenu() {
  menu.classList.add("menu-open");
  menuToggle.classList.add("open");
  menuToggle.setAttribute("aria-expanded", "true");
}

function closeMenu() {
  menu.classList.remove("menu-open");
  menuToggle.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", function (event) {
  event.stopPropagation();

  if (menu.classList.contains("menu-open")) {
    closeMenu();
  } else {
    openMenu();
  }
});

links.forEach((link) => {
  link.addEventListener("click", function () {
    const sectionId = this.dataset.section;
    const target = document.getElementById(sectionId);

    if (!target) return;

    setActiveLink(sectionId);
    closeMenu();

    const targetPosition =
      target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  });
});

function detectActiveSection() {
  let currentSection = sections[0]?.id;

  const position = window.scrollY + navbar.offsetHeight + 100;

  sections.forEach((section) => {
    const top = section.getBoundingClientRect().top + window.scrollY;

    if (position >= top) {
      currentSection = section.id;
    }
  });

  if (currentSection) {
    setActiveLink(currentSection);
  }
}

let scrollTimer;

window.addEventListener(
  "scroll",
  function () {
    detectActiveSection();

    if (window.scrollY > 450) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }

    if (menu.classList.contains("menu-open")) {
      clearTimeout(scrollTimer);

      scrollTimer = setTimeout(() => {
        closeMenu();
      }, 120);
    }
  },
  { passive: true },
);

document.addEventListener("click", function (event) {
  if (
    menu.classList.contains("menu-open") &&
    !menu.contains(event.target) &&
    !menuToggle.contains(event.target)
  ) {
    closeMenu();
  }
});

backToTop.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  setActiveLink("home");
});

window.addEventListener("resize", function () {
  const active = document.querySelector(".navbar-nav .nav-link.active");

  if (active) {
    requestAnimationFrame(() => {
      moveLine(active);
    });
  }
});

function createStars() {
  const count = 160;

  for (let i = 0; i < count; i++) {
    const star = document.createElement("span");

    star.className = "star";

    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";

    const size = Math.random() * 2 + 1;

    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    star.style.setProperty("--duration", `${Math.random() * 4 + 2}s`);

    star.style.animationDelay = `${Math.random() * 5}s`;

    starsContainer.appendChild(star);
  }
}

function typeText() {
  const texts = [
    "توسعه‌دهنده وب",
    "برنامه‌نویس Front-End",
    "علاقه‌مند به React",
    "سازنده تجربه‌های دیجیتال",
  ];

  let textIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const current = texts[textIndex];

    if (!deleting) {
      typingText.textContent = current.substring(0, charIndex + 1);

      charIndex++;

      if (charIndex === current.length) {
        deleting = true;

        setTimeout(type, 1700);

        return;
      }

      setTimeout(type, 80);
    } else {
      typingText.textContent = current.substring(0, charIndex - 1);

      charIndex--;

      if (charIndex === 0) {
        deleting = false;

        textIndex = (textIndex + 1) % texts.length;

        setTimeout(type, 400);

        return;
      }

      setTimeout(type, 45);
    }
  }

  type();
}

function setupReveal() {
  const elements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
    },
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
}

function startLoader() {
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 5) + 1;

    if (progress >= 100) {
      progress = 100;
    }

    loaderLine.style.width = `${progress}%`;
    loaderPercent.textContent = `${progress}%`;

    if (progress >= 100) {
      clearInterval(interval);

      setTimeout(() => {
        loader.classList.add("loader-hidden");
        siteWrapper.classList.add("site-loaded");

        typeText();
        setupReveal();

        setTimeout(() => {
          loader.remove();
        }, 900);
      }, 450);
    }
  }, 55);
}

window.addEventListener("load", function () {
  createStars();

  const active = document.querySelector(".navbar-nav .nav-link.active");

  if (active) {
    moveLine(active);
  }

  startLoader();
});

window.addEventListener("load", function () {
  if (window.location.hash) {
    const id = window.location.hash.substring(1);
    const target = document.getElementById(id);

    if (target) {
      setTimeout(() => {
        window.scrollTo({
          top: target.offsetTop - navbar.offsetHeight,
          behavior: "smooth",
        });

        setActiveLink(id);
      }, 1400);
    }
  }
});
