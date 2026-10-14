/* ============================================================
   CUSTOM CURSOR
============================================================ */
const cursor = document.querySelector(".cursor");
const cursorRing = document.querySelector(".cursor-ring");
const glow = document.querySelector(".glow");

let mouseX = 0,
  mouseY = 0;
let ringX = 0,
  ringY = 0;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";
  }
  if (glow) {
    glow.style.left = mouseX + "px";
    glow.style.top = mouseY + "px";
  }
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;
  if (cursorRing) {
    cursorRing.style.left = ringX + "px";
    cursorRing.style.top = ringY + "px";
  }
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll("a, button, [data-cursor]").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursorRing?.classList.add("is-hover");
    if (el.dataset.cursor === "view") cursorRing?.classList.add("is-view");
  });
  el.addEventListener("mouseleave", () => {
    cursorRing?.classList.remove("is-hover");
    cursorRing?.classList.remove("is-view");
  });
});

/* ============================================================
   NAV SCROLL STATE
============================================================ */
const nav = document.querySelector(".nav");
window.addEventListener(
  "scroll",
  () => {
    if (window.scrollY > 40) nav?.classList.add("is-scrolled");
    else nav?.classList.remove("is-scrolled");
  },
  { passive: true }
);

/* ============================================================
   SCROLL REVEAL
============================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i * 60, 400)}ms`;
  revealObserver.observe(el);
});

/* ============================================================
   COUNTER ANIMATION
============================================================ */
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const suffix = el.dataset.suffix || "";
      const duration = 1600;
      const start = performance.now();

      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const value = target * eased;
        el.textContent = value.toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(decimals) + suffix;
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.4 }
);
document
  .querySelectorAll("[data-count]")
  .forEach((el) => counterObserver.observe(el));

/* ============================================================
   TOAST
============================================================ */
const toast = document.getElementById("toast");
const toastTitle = document.getElementById("toastTitle");
const toastBody = document.getElementById("toastBody");
let toastTimer;

function showToast(title, body) {
  if (!toast) return;
  toastTitle.textContent = title;
  toastBody.textContent = body;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

/* ============================================================
   MOBILE MENU
============================================================ */
const burger = document.querySelector(".nav__burger");
const mobileMenu = document.getElementById("mobile-menu");
const menuLinks = document.querySelectorAll("[data-menu-link]");

function openMenu() {
  burger?.classList.add("is-open");
  burger?.setAttribute("aria-expanded", "true");
  mobileMenu?.classList.add("is-open");
  mobileMenu?.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-open");
}
function closeMenu() {
  burger?.classList.remove("is-open");
  burger?.setAttribute("aria-expanded", "false");
  mobileMenu?.classList.remove("is-open");
  mobileMenu?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-open");
}
burger?.addEventListener("click", () => {
  mobileMenu?.classList.contains("is-open") ? closeMenu() : openMenu();
});
menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
    const id = link.getAttribute("href");
    const target = id ? document.querySelector(id) : null;
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  });
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileMenu?.classList.contains("is-open")) {
    closeMenu();
  }
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 900 && mobileMenu?.classList.contains("is-open")) {
    closeMenu();
  }
});

/* ============================================================
   THEME TOGGLE
============================================================ */
const themeToggle = document.getElementById("themeToggle");

function applyTheme(isLight) {
  document.documentElement.classList.toggle("light", isLight);
  try {
    localStorage.setItem("theme", isLight ? "light" : "dark");
  } catch (e) {}
}
themeToggle?.addEventListener("click", () => {
  const isLight = !document.documentElement.classList.contains("light");
  applyTheme(isLight);
});
window.addEventListener("storage", (e) => {
  if (e.key === "theme") {
    document.documentElement.classList.toggle("light", e.newValue === "light");
  }
});
(function () {
  let saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch (e) {}
  if (saved === null) {
    const prefersLight = window.matchMedia(
      "(prefers-color-scheme: light)"
    ).matches;
    if (prefersLight) applyTheme(true);
  }
})();

/* ============================================================
   LIVE CLOCK
============================================================ */
const clock = document.getElementById("clock");
if (clock) {
  const update = () => {
    const now = new Date();
    const cairo = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Cairo",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(now);
    clock.textContent = cairo + " CAI";
  };
  update();
  setInterval(update, 1000);
}

/* ============================================================
   YEAR
============================================================ */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   SMOOTH ANCHOR SCROLL
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    if (id === "#" || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

/* ============================================================
   MAGNETIC BUTTONS
============================================================ */
document.querySelectorAll(".btn--primary, .nav__cta").forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "";
  });
});

/* ============================================================
   PARALLAX GLOW ON HERO
============================================================ */
window.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  document.querySelectorAll(".mock").forEach((m) => {
    m.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
  });
});

/* ============================================================
   BACK TO TOP — scroll-fill
============================================================ */
const backToTop = document.getElementById("backToTop");

function updateScrollProgress() {
  if (!backToTop) return;
  const scrollTop = window.scrollY;
  const docHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

  if (scrollTop > window.innerHeight * 0.6) {
    backToTop.classList.add("is-visible");
  } else {
    backToTop.classList.remove("is-visible");
  }

  backToTop.style.setProperty("--scroll-progress", progress.toFixed(3));
  backToTop.classList.toggle("is-half", progress >= 0.5);

  if (progress >= 0.995) {
    if (!backToTop.classList.contains("is-full")) {
      backToTop.classList.add("is-full");
    }
  } else {
    backToTop.classList.remove("is-full");
  }
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress, { passive: true });
updateScrollProgress();

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ============================================================
   TERMINAL PALETTE
============================================================ */
const terminal = document.getElementById("terminal");
const terminalInput = document.getElementById("terminalInput");
const terminalForm = document.getElementById("terminalForm");
const terminalOutput = document.getElementById("terminalOutput");
const terminalSugg = document.getElementById("terminalSuggestions");
const terminalPromptBtn = document.getElementById("terminalPrompt");
const hintToast = document.getElementById("hintToast");

let terminalOpen = false;
let commandHistory = [];
let historyIndex = -1;

const COMMANDS = {
  help: {
    desc: "Show all commands",
    run: () => {
      printLines([
        { text: "Available commands:", cls: "accent" },
        { text: "", cls: "" },
        ...Object.entries(COMMANDS).map(([name, c]) => ({
          text: `  ${name.padEnd(16)} ${c.desc}`,
          cls: "muted",
        })),
      ]);
      return null;
    },
  },
  whoami: {
    desc: "A one-line bio",
    run: () => {
      printLine(
        "Youssef Ahmed Amin — full-stack developer building AI-powered products.",
        "accent"
      );
      printLine("Cairo, Egypt · GPA 3.78 · Available for work.", "muted");
      return { scrollTo: "#about" };
    },
  },
  work: { desc: "Jump to Work", run: () => ({ scrollTo: "#work" }) },
  projects: { desc: "Alias for work", run: () => ({ scrollTo: "#work" }) },
  experience: {
    desc: "Jump to Experience",
    run: () => ({ scrollTo: "#experience" }),
  },
  education: {
    desc: "Jump to Education",
    run: () => ({ scrollTo: "#experience" }),
  },
  courses: { desc: "Jump to Learning", run: () => ({ scrollTo: "#courses" }) },
  skills: { desc: "Jump to Skills", run: () => ({ scrollTo: ".skills" }) },
  contact: { desc: "Jump to Contact", run: () => ({ scrollTo: "#contact" }) },
  email: {
    desc: "Open mail client",
    run: () => {
      printLine("Opening mail client…", "muted");
      setTimeout(() => {
        window.location.href = "mailto:youssefahmedamin28@gmail.com";
      }, 300);
      return null;
    },
  },
  cv: {
    desc: "Download CV",
    run: () => {
      printLine("Fetching resume…", "muted");
      setTimeout(() => {
        window.open("./assets/Youssef_Ahmed_Amin_CV.pdf", "_blank");
      }, 300);
      return null;
    },
  },
  resume: { desc: "Alias for cv", run: () => COMMANDS.cv.run() },
  github: {
    desc: "Open GitHub",
    run: () => {
      printLine("Opening GitHub…", "muted");
      setTimeout(() => {
        window.open("https://github.com/YoussefAhmed8777", "_blank");
      }, 250);
      return null;
    },
  },
  linkedin: {
    desc: "Open LinkedIn",
    run: () => {
      printLine("Opening LinkedIn…", "muted");
      setTimeout(() => {
        window.open("https://linkedin.com/in/youssef-ahmedd8", "_blank");
      }, 250);
      return null;
    },
  },
  theme: {
    desc: "theme light | theme dark",
    run: (args) => {
      const mode = (args[0] || "").toLowerCase();
      if (mode === "light" || mode === "dark") {
        document.documentElement.classList.toggle("light", mode === "light");
        try {
          localStorage.setItem("theme", mode);
        } catch (e) {}
        printLine(`Theme set to ${mode}.`, "accent");
      } else {
        printLine("Usage: theme light | theme dark", "muted");
      }
      return null;
    },
  },
  goto: {
    desc: "goto top | goto bottom",
    run: (args) => {
      const dest = (args[0] || "").toLowerCase();
      if (dest === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        printLine("Scrolling up.", "muted");
      } else if (dest === "bottom") {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        printLine("Scrolling down.", "muted");
      } else printLine("Usage: goto top | goto bottom", "muted");
      return null;
    },
  },
  hire: {
    desc: "Get in touch",
    run: () => {
      printLine("Good instinct.", "accent");
      printLine("→ youssefahmedamin28@gmail.com", "muted");
      return null;
    },
  },
  sudo: {
    desc: "sudo hire-me",
    run: (args) => {
      if (args.join(" ") === "hire-me") {
        printLine("Permission granted.", "accent");
        printLine("Sending his resume now…", "muted");
        setTimeout(() => {
          window.open("./assets/Youssef_Ahmed_Amin_CV.pdf", "_blank");
        }, 500);
      } else {
        printLine(`sudo: ${args.join(" ") || ""}: command not found`, "muted");
      }
      return null;
    },
  },
  coffee: {
    desc: "☕",
    run: () => {
      printLine("☕ Brewing… try again in 3 minutes.", "muted");
      return null;
    },
  },
  clear: {
    desc: "Clear the output",
    run: () => {
      if (terminalOutput) terminalOutput.innerHTML = "";
      return null;
    },
  },
  exit: {
    desc: "Close the terminal",
    run: () => {
      closeTerminal();
      return null;
    },
  },
};

function printLine(text, cls = "") {
  if (!terminalOutput) return;
  const p = document.createElement("p");
  if (cls) p.className = cls;
  p.textContent = text;
  terminalOutput.appendChild(p);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}
function printLines(arr) {
  arr.forEach(({ text, cls }) => printLine(text, cls));
}

function openTerminal() {
  if (!terminal) return;
  terminalOpen = true;
  terminal.classList.add("is-open");
  terminal.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-open");
  setTimeout(() => terminalInput?.focus(), 80);

  if (!openTerminal._greeted) {
    printLine("youssef@portfolio — interactive shell", "accent");
    printLine(`Type 'help' to see commands.`, "muted");
    printLine("", "");
    openTerminal._greeted = true;
  }
  hintToast?.classList.remove("is-visible");
}
function closeTerminal() {
  if (!terminal) return;
  terminalOpen = false;
  terminal.classList.remove("is-open");
  terminal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-open");
  if (terminalInput) terminalInput.value = "";
  if (terminalSugg) terminalSugg.hidden = true;
}

function runCommand(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return;

  printLine(`youssef@portfolio:~$ ${trimmed}`, "dim");

  const parts = trimmed.split(/\s+/);
  const name = parts[0].toLowerCase();
  const args = parts.slice(1);

  const cmd = COMMANDS[name];
  if (!cmd) {
    printLine(`command not found: ${name}. Try 'help'.`, "muted");
    return;
  }
  const result = cmd.run(args);
  if (result?.scrollTo) {
    closeTerminal();
    setTimeout(() => {
      const target = document.querySelector(result.scrollTo);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  } else if (name !== "clear") {
    if (name !== "help" && name !== "theme" && name !== "sound") {
      setTimeout(() => closeTerminal(), 900);
    }
  }
}

function updateSuggestions(query) {
  if (!terminalSugg) return;
  const q = query.trim().toLowerCase();

  if (q.includes(" ")) {
    terminalSugg.hidden = true;
    return;
  }
  const matches = Object.entries(COMMANDS)
    .filter(([name]) => name.startsWith(q) || q === "")
    .slice(0, 6);

  if (!matches.length) {
    terminalSugg.hidden = true;
    return;
  }
  terminalSugg.hidden = false;
  terminalSugg.innerHTML = matches
    .map(
      ([name, c]) => `
      <button type="button" data-cmd="${name}">
        <span class="cmd">${name}</span>
        <span class="desc">${c.desc}</span>
      </button>
    `
    )
    .join("");

  terminalSugg.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cmd = btn.dataset.cmd;
      if (terminalInput) terminalInput.value = cmd + " ";
      terminalInput?.focus();
      updateSuggestions(cmd);
    });
  });
}

terminalInput?.addEventListener("input", (e) => {
  updateSuggestions(e.target.value);
});
terminalInput?.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (commandHistory.length === 0) return;
    historyIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
    terminalInput.value =
      commandHistory[commandHistory.length - 1 - historyIndex] || "";
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    historyIndex = Math.max(historyIndex - 1, -1);
    if (historyIndex === -1) terminalInput.value = "";
    else
      terminalInput.value =
        commandHistory[commandHistory.length - 1 - historyIndex] || "";
  } else if (e.key === "Tab") {
    e.preventDefault();
    const first = terminalSugg?.querySelector("button");
    if (first) {
      terminalInput.value = first.dataset.cmd + " ";
      updateSuggestions(first.dataset.cmd);
    }
  }
});

terminalForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = terminalInput?.value || "";
  if (value.trim()) {
    commandHistory.push(value.trim());
    historyIndex = -1;
  }
  runCommand(value);
  if (terminalInput) terminalInput.value = "";
  updateSuggestions("");
});

window.addEventListener("keydown", (e) => {
  const isMac = navigator.platform.toLowerCase().includes("mac");
  const modKey = isMac ? e.metaKey : e.ctrlKey;
  if (modKey && e.key.toLowerCase() === "k") {
    e.preventDefault();
    terminalOpen ? closeTerminal() : openTerminal();
  }
  if (e.key === "Escape" && terminalOpen) {
    closeTerminal();
  }
});
terminalPromptBtn?.addEventListener("click", openTerminal);
terminal
  ?.querySelector("[data-terminal-close]")
  ?.addEventListener("click", closeTerminal);

(function showHintOnFirstVisit() {
  let seen = null;
  try {
    seen = localStorage.getItem("terminalHintSeen");
  } catch (e) {}
  if (seen) return;

  setTimeout(() => {
    if (terminalOpen) return;
    hintToast?.classList.add("is-visible");
    const hide = () => {
      hintToast?.classList.remove("is-visible");
      try {
        localStorage.setItem("terminalHintSeen", "1");
      } catch (e) {}
      window.removeEventListener("scroll", hide);
      window.removeEventListener("click", hide);
      window.removeEventListener("keydown", hide);
    };
    setTimeout(hide, 8000);
    window.addEventListener("scroll", hide, { passive: true, once: true });
    window.addEventListener("click", hide, { once: true });
    window.addEventListener("keydown", hide, { once: true });
  }, 6000);
})();

/* ============================================================
   HERO — self-rewriting variants
============================================================ */
const heroMeta = document.getElementById("heroMeta");
const heroLead = document.getElementById("heroLead");
const heroContext = document.getElementById("heroContext");
const heroContextText = document.getElementById("heroContextText");

const HERO_VARIANTS = {
  default: {
    label: "default",
    meta: "Cairo, Egypt — Available for work",
    lead: "Full-stack developer building <em>AI-powered</em> products with Angular, Node &amp; React — from MVP to demo-ready.",
  },
  recruiter: {
    label: "recruiter",
    meta: "Cairo, Egypt — Available for work",
    lead: "You're here from LinkedIn. Save time — here's what I've shipped: three products, two internships, GPA 3.78. Ten minutes of scrolling below.",
  },
  developer: {
    label: "developer",
    meta: "Cairo, Egypt — Available for work",
    lead: "Another dev. Skip the intro — the Work section has the interesting bits. Or press <em>⌘K</em> for the terminal.",
  },
  nightOwl: {
    label: "night owl",
    meta: "Cairo, Egypt — It's late where you are",
    lead: "It's <em>late</em> where you are. Respect. Here's the short version: I ship AI features with Angular, Node, and React.",
  },
};

function pickHeroVariant() {
  try {
    const params = new URLSearchParams(location.search);
    const forced = (
      params.get("v") ||
      params.get("from") ||
      ""
    ).toLowerCase();
    if (
      forced === "recruiter" ||
      forced === "developer" ||
      forced === "nightowl" ||
      forced === "default"
    ) {
      return forced === "nightowl" ? "nightOwl" : forced;
    }
    const ref = (document.referrer || "").toLowerCase();
    if (ref.includes("linkedin.")) return "recruiter";
    if (ref.includes("github.")) return "developer";
    const hour = new Date().getHours();
    if (hour >= 23 || hour < 5) return "nightOwl";
    return "default";
  } catch (e) {
    return "default";
  }
}

function typeInto(el, html, speed = 16) {
  if (!el) return;
  const temp = document.createElement("div");
  temp.innerHTML = html;
  const plain = temp.textContent;

  el.textContent = "";
  el.classList.add("is-retyping");

  let i = 0;
  const tick = () => {
    el.textContent = plain.slice(0, i++);
    if (i <= plain.length) setTimeout(tick, speed);
    else {
      el.innerHTML = html;
      el.classList.remove("is-retyping");
    }
  };
  tick();
}

function applyHeroVariant(key, { animate = true } = {}) {
  const v = HERO_VARIANTS[key] || HERO_VARIANTS.default;

  if (heroMeta && heroMeta.textContent !== v.meta) {
    heroMeta.style.transition = "opacity 0.3s ease";
    heroMeta.style.opacity = "0";
    setTimeout(() => {
      heroMeta.textContent = v.meta;
      heroMeta.style.opacity = "1";
    }, 300);
  }

  if (heroLead) {
    if (!animate) {
      heroLead.innerHTML = v.lead;
    } else {
      heroLead.style.transition = "opacity 0.25s ease";
      heroLead.style.opacity = "0";
      setTimeout(() => {
        heroLead.style.opacity = "1";
        typeInto(heroLead, v.lead, 14);
      }, 250);
    }
  }

  if (heroContextText) {
    const hour = new Date().getHours().toString().padStart(2, "0");
    const min = new Date().getMinutes().toString().padStart(2, "0");
    const device = window.innerWidth <= 900 ? "mobile" : "desktop";
    heroContextText.textContent = `context: ${v.label} · ${hour}:${min} · ${device}`;
  }

  try {
    sessionStorage.setItem("heroVariant", key);
  } catch (e) {}
}

(function initHero() {
  let saved = null;
  try {
    saved = sessionStorage.getItem("heroVariant");
  } catch (e) {}
  const key = saved || pickHeroVariant();
  applyHeroVariant(key, { animate: false });
  if (key !== "default") {
    setTimeout(() => applyHeroVariant(key, { animate: true }), 1600);
  }
})();

heroContext?.addEventListener("click", () => openVariantPreview());

function openVariantPreview() {
  const existing = document.querySelector(".variant-preview");
  if (existing) {
    existing.classList.add("is-open");
    return;
  }
  const panel = document.createElement("div");
  panel.className = "variant-preview";
  panel.innerHTML = `
    <div class="variant-preview__panel">
      <div class="variant-preview__title">Pick a hero variant</div>
      ${Object.entries(HERO_VARIANTS)
        .map(
          ([key, v]) => `
        <div class="variant-preview__item" data-key="${key}">
          <div class="variant-preview__name">${v.label}</div>
          <div class="variant-preview__lead">${v.lead.replace(
            /<[^>]*>/g,
            ""
          )}</div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
  document.body.appendChild(panel);
  requestAnimationFrame(() => panel.classList.add("is-open"));

  panel.addEventListener("click", (e) => {
    const item = e.target.closest(".variant-preview__item");
    if (item) {
      applyHeroVariant(item.dataset.key, { animate: true });
      panel.classList.remove("is-open");
      setTimeout(() => panel.remove(), 400);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (e.target === panel) {
      panel.classList.remove("is-open");
      setTimeout(() => panel.remove(), 400);
    }
  });
}

/* ============================================================
   CHALLENGE CONTACT
============================================================ */
const challengeForm = document.getElementById("challengeForm");
const challengeInput = document.getElementById("challengeInput");
const challengeCopy = document.getElementById("challengeCopy");

challengeForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = (challengeInput?.value || "").trim();
  if (!text) {
    challengeInput?.focus();
    return;
  }
  const subject = encodeURIComponent("The hardest bug I have");
  const body = encodeURIComponent(
    `Hi Youssef,\n\nHere's the bug I'm stuck on:\n\n${text}\n\n---\nSent from your portfolio.`
  );
  window.location.href = `mailto:youssefahmedamin28@gmail.com?subject=${subject}&body=${body}`;
});

challengeCopy?.addEventListener("click", async () => {
  const template = `## Bug Report

**What I expected:**


**What actually happened:**


**Steps to reproduce:**


**Environment (browser / OS / versions):**


**What I've already tried:**


**Stack trace (if any):**
\`\`\`

\`\`\`
`;
  try {
    await navigator.clipboard.writeText(template);
    showToast("Template copied", "Paste it anywhere, then email me.");
  } catch (e) {
    showToast("Copy failed", "Try again");
  }
});

/* ============================================================
   COPY-TO-CLIPBOARD (contact + mobile menu items)
============================================================ */
document.querySelectorAll("[data-copy]").forEach((el) => {
  el.addEventListener("click", async () => {
    const text = el.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard", text);
    } catch {
      showToast("Copy failed", text);
    }
  });
});

/* ============================================================
   FOOTER SIGNATURE — pen-written along the real strokes
   The artwork is a filled shape, so thick "pen" strokes along the
   centre-line of every letter sit in an SVG mask; revealing them in
   writing order shows the real art. The pen speeds up on straights
   and slows through curves, retraces quickly over finished ink, and
   the last stroke is a fast swash. Fresh ink is accent-coloured and
   dries into the text colour a moment behind the nib.
============================================================ */
(function initFooterSignature() {
  const signature = document.getElementById("footerSignature");
  const wet = document.getElementById("signatureWet");
  const dry = document.getElementById("signatureDry");
  const penDry = document.getElementById("signaturePenDry");
  const nib = document.getElementById("signatureNib");
  const spark = document.getElementById("signatureSpark");
  const wetPaths = signature
    ? Array.from(signature.querySelectorAll("#signatureMask .signature-pen path"))
    : [];

  if (!signature || !wet || !dry || !penDry || !nib || !wetPaths.length) return;

  // Reduced motion: leave it fully drawn (default state), no replay
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const TOTAL_MS = 5600;  // pen-down time, first stroke to swash landing
  const SETTLE_MS = 600;  // wet ink drying after the swash lands
  const PRE_UNIT = 8;     // pause cost per data-pre unit (tiny dwell at tips)
  const DRY_LAG = 150;    // how far behind the nib the ink dries (cost units)
  const NIB_FOLLOW = 0.45; // 0-1, lower = floatier nib
  const TRAIL_STEP = 1;   // frames between trail dots

  const trail = Array.from(nib.querySelectorAll(".signature-nib__trail"));
  const nibParts = [
    ...trail,
    ...nib.querySelectorAll(".signature-nib__halo, .signature-nib__core"),
  ];

  // Second (lagging) copy of the pen strokes for the dry-ink mask
  const dryPaths = wetPaths.map((p) => {
    const c = p.cloneNode(false);
    penDry.appendChild(c);
    return c;
  });

  // Blockers (see the mask in the HTML): hold back ink that sits right next
  // to a stroke the pen is writing, until the pen reaches it
  const blockDry = document.getElementById("signatureBlockDry");
  const blockers = Array.from(
    signature.querySelectorAll("#signatureMask .signature-block path")
  ).map((el) => {
    const dryEl = el.cloneNode(false);
    blockDry.appendChild(dryEl);
    return { el, dryEl, j: +el.dataset.j, frac: +el.dataset.f };
  });

  // One continuous timeline built from the chunks' data-c costs
  let total = 0;
  const steps = wetPaths.map((el, i) => {
    const len = el.getTotalLength();
    const pre = (parseFloat(el.dataset.pre) || 0) * PRE_UNIT;
    const cost = parseFloat(el.dataset.c) || len;
    const s = { el, dryEl: dryPaths[i], len, pre, cost, c0: total, blk: [] };
    total += pre + cost;
    return s;
  });
  blockers.forEach((b) => steps[b.j] && steps[b.j].blk.push(b));
  const lastStep = steps[steps.length - 1];

  // Soft start, then the pen picks speed up into the swash
  const ease = (x) => 0.78 * x + 0.22 * (1 - Math.cos((Math.PI * x) / 2));

  let isPlaying = false;
  let history = [];
  let nibPos = null;
  let wi = 0; // first wet step not yet complete
  let di = 0; // first dry step not yet complete

  function placeNib(tip) {
    nibPos = nibPos
      ? {
          x: nibPos.x + (tip.x - nibPos.x) * NIB_FOLLOW,
          y: nibPos.y + (tip.y - nibPos.y) * NIB_FOLLOW,
        }
      : { x: tip.x, y: tip.y };
    history.push({ x: nibPos.x, y: nibPos.y });
    if (history.length > trail.length * TRAIL_STEP + 1) history.shift();
    const last = history.length - 1;
    nibParts.forEach((c, i) => {
      const lag = i < trail.length ? (trail.length - i) * TRAIL_STEP : 0;
      const p = history[Math.max(0, last - lag)];
      c.setAttribute("transform", `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)})`);
    });
  }

  function hideAll() {
    wetPaths.concat(dryPaths).forEach((el) => {
      el.style.strokeDashoffset = "1";
      el.style.visibility = "hidden"; // avoids a stray round-cap dot
    });
  }

  function prime() {
    hideAll();
    blockers.forEach((b) => {
      b.el.style.display = "";
      b.dryEl.style.display = "";
    });
    wet.setAttribute("mask", "url(#signatureMask)");
    dry.setAttribute("mask", "url(#signatureMaskDry)");
    history = [];
    nibPos = null;
    wi = 0;
    di = 0;
    signature.classList.remove("is-drawn", "is-drawing");
    signature.classList.add("is-ready");
  }

  // Reveal steps up to cost `c` on one layer. Returns the pen tip if mid-stroke.
  function reveal(c, which) {
    let tip = null;
    let i = which === "wet" ? wi : di;
    for (; i < steps.length; i++) {
      const s = steps[i];
      if (c <= s.c0) break;
      const el = which === "wet" ? s.el : s.dryEl;
      const x = Math.min(1, (c - s.c0 - s.pre) / s.cost);
      if (x <= 0) {
        if (which === "wet") tip = s.el.getPointAtLength(0); // dwell at the tip
        break;
      }
      el.style.visibility = "visible";
      el.style.strokeDashoffset = String(1 - x);
      for (const b of s.blk) {
        if (x >= b.frac) (which === "wet" ? b.el : b.dryEl).style.display = "none";
      }
      if (x < 1) {
        if (which === "wet") tip = s.el.getPointAtLength(x * s.len);
        break;
      }
    }
    if (which === "wet") wi = i;
    else di = i;
    return tip;
  }

  function frame(t0, now) {
    const elapsed = now - t0;
    const t = Math.min(1, elapsed / TOTAL_MS);
    const c = ease(t) * total;

    const tip = reveal(c, "wet");
    if (tip) placeNib(tip);

    let cDry;
    if (t < 1) {
      cDry = Math.max(0, c - DRY_LAG);
    } else {
      // swash has landed: the wet ink dries the rest of the way
      const k = Math.min(1, (elapsed - TOTAL_MS) / SETTLE_MS);
      cDry = total - DRY_LAG + DRY_LAG * (k * (2 - k));
    }
    reveal(cDry, "dry");

    if (elapsed < TOTAL_MS + SETTLE_MS) {
      requestAnimationFrame((n) => frame(t0, n));
    } else {
      finish();
    }
  }

  function finish() {
    isPlaying = false;
    // Pop a ring where the swash flicked off
    const end = lastStep.el.getPointAtLength(lastStep.len);
    spark.setAttribute("cx", end.x);
    spark.setAttribute("cy", end.y);
    spark.classList.remove("is-burst");
    void spark.getBoundingClientRect();
    spark.classList.add("is-burst");

    signature.classList.remove("is-ready", "is-drawing");
    signature.classList.add("is-drawn");
    // Fully drawn: drop the masks so the exact original artwork shows
    wet.removeAttribute("mask");
    dry.removeAttribute("mask");
  }

  function play() {
    if (isPlaying) return;
    isPlaying = true;
    prime();
    signature.classList.add("is-drawing");
    requestAnimationFrame((now) => frame(now, now));
  }

  function replay() {
    if (isPlaying || signature.classList.contains("is-erasing")) return;
    signature.classList.add("is-erasing"); // fade the old ink out
    setTimeout(() => {
      signature.classList.remove("is-erasing");
      play();
    }, 380);
  }

  // Hidden until it's time to write
  prime();

  // Write once, when the signature is actually on screen
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      observer.disconnect();
      setTimeout(play, 300);
    },
    { threshold: 0.6 }
  );
  observer.observe(signature);

  // ---------- Easter egg: click (or Enter/Space) to replay ----------
  // Desktop only. Delete this whole `if` block if you want it to play
  // exactly once and never again.
  const isTouch =
    window.matchMedia("(hover: none)").matches || "ontouchstart" in window;

  if (!isTouch) {
    signature.setAttribute("role", "button");
    signature.setAttribute("tabindex", "0");
    signature.setAttribute(
      "aria-label",
      "Signature of Youssef Ahmed Amin. Press to replay."
    );
    signature.addEventListener("click", replay);
    signature.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        replay();
      }
    });
  }
})();

/* ============================================================
   DEVICE-AWARE KEYBOARD SHORTCUT DETECTION
   - macOS / iPad → ⌘K
   - Windows / Linux → Ctrl K
   - Touch-only devices → hide the shortcut chip
============================================================ */
(function detectKeyboard() {
  const keyEl = document.getElementById("terminalKey");
  if (!keyEl) return;

  // Determine platform
  let isMac = false;
  try {
    // Modern API
    if (navigator.userAgentData && navigator.userAgentData.platform) {
      isMac = /mac/i.test(navigator.userAgentData.platform);
    } else if (navigator.platform) {
      // Fallback — matches MacIntel, iPhone, iPad on older Safari
      isMac = /mac|iphone|ipad|ipod/i.test(navigator.platform);
    }
  } catch (e) {
    isMac = false;
  }

  // Detect touch-only devices (no physical keyboard)
  const isTouchOnly =
    window.matchMedia("(hover: none) and (pointer: coarse)").matches &&
    !window.matchMedia("(hover: hover)").matches;

  // If touch-only: hide the entire shortcut item
  if (isTouchOnly) {
    const row = keyEl.closest(".footer__item");
    if (row) row.style.display = "none";
    return;
  }

  // Otherwise set the correct key label
  keyEl.textContent = isMac ? "⌘K" : "Ctrl K";
})();