const CHANNEL_URL = "https://whatsapp.com/channel/0029VbCaX96EgGfOFW6Isc37";
const COMMUNITY_URL = "https://chat.whatsapp.com/L1bc0rZp4Zv4epYPAcSatx?s=cl&p=a&ilr=0";

// Chiffres de preuve sociale — à ajuster ici si besoin.
const STATS = {
  members: 5000, // abonnés chaîne + membres communauté
  drops: 1 // contenu publié chaque jour sur la chaîne
};

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const channelMessages = [
  {
    name: "Parlons IA",
    time: "Aujourd'hui, 09:12",
    body: "La masterclass <strong>Génération d'images IA</strong> est passée — merci à toutes et tous. Le replay arrive très vite.",
    actionLabel: "Voir le programme",
    actionHref: "./ateliers/"
  },
  {
    name: "Parlons IA",
    time: "Aujourd'hui, 11:08",
    body: "<strong>Prochaine masterclass en préparation</strong> : le thème et la date seront annoncés ici en avant-première."
  },
  {
    name: "Parlons IA",
    time: "Aujourd'hui, 14:42",
    body: "Concours terminé : félicitations à <strong>Serge</strong>, gagnant de la carte d'invitation de mariage IA.",
    actionLabel: "Voir le concours",
    actionHref: "./concours/"
  }
];

const communityMessages = [
  {
    name: "Maya",
    time: "09:22",
    body: "Vous savez quand aura lieu la prochaine masterclass ?"
  },
  {
    name: "Boris",
    time: "09:28",
    body: "On prépare ça. Le thème et la date tombent d'abord sur la chaîne."
  },
  {
    name: "Kevin",
    time: "09:31",
    body: "Le replay de la session images arrive aussi très vite."
  }
];

function hydrateLinks() {
  document.querySelectorAll("[data-channel-url]").forEach((node) => {
    node.href = CHANNEL_URL;
  });

  document.querySelectorAll("[data-community-url]").forEach((node) => {
    node.href = COMMUNITY_URL;
  });

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
}

function setupMobileMenu() {
  const button = document.querySelector("[data-mobile-menu-button]");
  const panel = document.querySelector("[data-mobile-menu]");

  if (!button || !panel) return;

  button.addEventListener("click", () => {
    panel.classList.toggle("hidden");
  });

  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      panel.classList.add("hidden");
    });
  });
}

/* ---------- Header condensé au scroll ---------- */
function setupHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const update = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* ---------- Reveal on scroll (IntersectionObserver) ---------- */
function setupReveals() {
  const targets = document.querySelectorAll("[data-reveal], [data-blur-words]");
  if (!targets.length) return;

  if (REDUCED_MOTION || !("IntersectionObserver" in window)) {
    targets.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
  );

  targets.forEach((node) => observer.observe(node));
}

/* ---------- Blur reveal mot par mot (titre du hero) ---------- */
function splitBlurWords() {
  document.querySelectorAll("[data-blur-words]").forEach((root) => {
    let index = 0;

    const wrap = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const fragment = document.createDocumentFragment();

        node.textContent.split(/(\s+)/).forEach((part) => {
          if (!part.trim()) {
            fragment.appendChild(document.createTextNode(part));
            return;
          }
          const span = document.createElement("span");
          span.className = "word";
          span.style.setProperty("--word-delay", `${index * 95}ms`);
          span.textContent = part;
          fragment.appendChild(span);
          index += 1;
        });

        node.replaceWith(fragment);
        return;
      }

      if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== "BR") {
        Array.from(node.childNodes).forEach(wrap);
      }
    };

    Array.from(root.childNodes).forEach(wrap);
  });
}

/* ---------- Compteurs animés (preuve sociale) ---------- */
function setupCounters() {
  const counters = document.querySelectorAll("[data-stat]");
  if (!counters.length) return;

  const compact = (n) =>
    n >= 1000 ? `${(n / 1000).toFixed(1).replace(".0", "").replace(".", ",")}k` : String(n);

  const avatars = document.querySelector("[data-stat-avatars]");
  if (avatars) avatars.textContent = `+${compact(Math.max(STATS.members - 2, 0))}`;

  if (REDUCED_MOTION || !("IntersectionObserver" in window)) return;

  const format = new Intl.NumberFormat("fr-FR");

  const animate = (node, target) => {
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = format.format(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = STATS[entry.target.dataset.stat];
        if (typeof target === "number") animate(entry.target, target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((node) => observer.observe(node));
}

/* ---------- Parallax légère (téléphone, desktop uniquement) ---------- */
function setupParallax() {
  const nodes = document.querySelectorAll("[data-parallax]");
  if (!nodes.length || REDUCED_MOTION) return;
  if (!window.matchMedia("(min-width: 1024px)").matches) return;

  let ticking = false;

  const update = () => {
    ticking = false;
    nodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offset = (center - window.innerHeight / 2) * 0.05;
      node.style.transform = `translateY(${offset.toFixed(1)}px)`;
    });
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
}

/* ---------- Grille interactive du hero + glow ---------- */
function setupHeroGrid() {
  const canvas = document.getElementById("hero-grid-bg");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const pointer = { x: -1000, y: -1000 };
  const cell = 32;
  const radius = 170;

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;

    const width = parent.clientWidth;
    const height = parent.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function updatePointer(event) {
    const rect = canvas.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    ) {
      pointer.x = -1000;
      pointer.y = -1000;
      return;
    }

    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
  }

  function resetPointer() {
    pointer.x = -1000;
    pointer.y = -1000;
  }

  function draw() {
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    context.clearRect(0, 0, width, height);

    // Glow radial qui suit la souris (sous les points)
    if (pointer.x > 0 && !REDUCED_MOTION) {
      const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 230);
      glow.addColorStop(0, "rgba(16, 185, 129, 0.09)");
      glow.addColorStop(1, "rgba(16, 185, 129, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);
    }

    const cols = Math.ceil(width / cell) + 1;
    const rows = Math.ceil(height / cell) + 1;

    for (let i = 0; i <= cols; i += 1) {
      for (let j = 0; j <= rows; j += 1) {
        const x = i * cell;
        const y = j * cell;
        const dx = pointer.x - x;
        const dy = pointer.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, 1 - distance / radius);
        const alpha = 0.05 + proximity * 0.14;

        context.beginPath();
        context.arc(x, y, 1 + proximity * 1.5, 0, Math.PI * 2);
        context.fillStyle = `rgba(15, 118, 110, ${alpha})`;
        context.fill();
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("mousemove", updatePointer, { passive: true });
  window.addEventListener("mouseout", resetPointer, { passive: true });
  draw();
}

/* ---------- Simulateur WhatsApp ---------- */
let simRun = 0; // token d'annulation de la séquence en cours
let simMode = "channel";
let simVisible = false;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function buildMessage(item, self = false, index = 0) {
  const wrapper = document.createElement("div");
  wrapper.className = self
    ? "sim-message bg-emerald-50/80 ml-auto rounded-xl p-3 shadow-sm border border-zinc-200/50 max-w-[85%]"
    : "sim-message bg-white rounded-xl p-3 shadow-sm border border-zinc-200/50 max-w-[90%] mr-auto";

  if (!REDUCED_MOTION) {
    wrapper.style.animationDelay = `${index * 110}ms`;
  }

  wrapper.innerHTML = `
    <div class="flex items-center justify-between mb-1.5 ${self ? "" : "border-b border-zinc-100 pb-1"}">
      <span class="font-bold text-zinc-800 text-[10px]">${item.name}</span>
      <span class="text-[9px] text-zinc-400">${item.time}</span>
    </div>
    <p class="text-zinc-600 text-xs leading-relaxed">${item.body}</p>
    ${item.actionLabel ? `<a href="${item.actionHref}" class="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-900 hover:underline">${item.actionLabel}</a>` : ""}
  `;

  return wrapper;
}

function buildTyping(self) {
  const wrapper = document.createElement("div");
  wrapper.className = self
    ? "bg-emerald-50/80 ml-auto rounded-xl p-3 shadow-sm border border-zinc-200/50 w-fit"
    : "bg-white rounded-xl p-3 shadow-sm border border-zinc-200/50 mr-auto w-fit";
  wrapper.innerHTML = `<span class="typing-dots"><span></span><span></span><span></span></span>`;
  return wrapper;
}

function setSimChrome(mode) {
  const title = document.querySelector("[data-sim-title]");
  const subtitle = document.querySelector("[data-sim-subtitle]");
  const input = document.querySelector("[data-sim-input]");
  const channelTab = document.querySelector("[data-sim-tab='channel']");
  const communityTab = document.querySelector("[data-sim-tab='community']");

  if (!title || !subtitle || !input || !channelTab || !communityTab) return;

  const active = "w-1/2 py-2.5 text-center font-semibold border-b-2 border-emerald-500 text-emerald-400 transition-all";
  const inactive = "w-1/2 py-2.5 text-center font-semibold border-b-2 border-transparent text-zinc-400 hover:text-white transition-all";

  if (mode === "community") {
    title.textContent = "Parlons IA — Communauté";
    subtitle.textContent = "Questions, retours et entraide";
    input.textContent = "Écrire un message...";
    channelTab.className = inactive;
    communityTab.className = active;
    return;
  }

  title.textContent = "Parlons IA — Chaîne";
  subtitle.textContent = "Prompts, annonces et nouveautés";
  input.textContent = "Lecture seule pour la chaîne";
  channelTab.className = active;
  communityTab.className = inactive;
}

/* Rendu statique (fallback reduced-motion) */
function renderSimulatorStatic(mode) {
  const area = document.querySelector("[data-sim-area]");
  if (!area) return;

  setSimChrome(mode);
  area.innerHTML = "";

  if (mode === "community") {
    communityMessages.forEach((message, index) => {
      area.appendChild(buildMessage(message, index > 0, index));
    });
    return;
  }

  channelMessages.forEach((message, index) => {
    area.appendChild(buildMessage(message, false, index));
  });
}

/* Conversation animée : typing → message, en boucle tant que visible */
async function playSim(mode) {
  const run = ++simRun;
  simMode = mode;

  const area = document.querySelector("[data-sim-area]");
  if (!area) return;

  setSimChrome(mode);
  area.innerHTML = "";

  const messages = mode === "community" ? communityMessages : channelMessages;

  for (let i = 0; i < messages.length; i += 1) {
    if (run !== simRun) return;

    const self = mode === "community" && i > 0;
    const typing = buildTyping(self);
    area.appendChild(typing);
    area.scrollTop = area.scrollHeight;

    await wait(700 + Math.random() * 500);
    if (run !== simRun) return;

    typing.replaceWith(buildMessage(messages[i], self, 0));
    area.scrollTop = area.scrollHeight;

    await wait(1000);
  }

  // Pause en fin de séquence, puis on recommence si toujours visible
  await wait(8000);
  if (run === simRun && simVisible) playSim(mode);
}

function setupSimulator() {
  const tabs = document.querySelectorAll("[data-sim-tab]");
  const stage = document.querySelector(".phone-stage");
  if (!tabs.length) return;

  if (REDUCED_MOTION) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => renderSimulatorStatic(tab.dataset.simTab));
    });
    renderSimulatorStatic("channel");
    return;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      playSim(tab.dataset.simTab);
    });
  });

  if ("IntersectionObserver" in window && stage) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!simVisible) {
              simVisible = true;
              playSim(simMode);
            }
          } else {
            simVisible = false;
            simRun += 1; // annule la séquence en cours
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(stage);
    return;
  }

  simVisible = true;
  playSim("channel");
}

document.addEventListener("DOMContentLoaded", () => {
  hydrateLinks();
  setupMobileMenu();
  setupHeaderScroll();
  splitBlurWords();
  setupReveals();
  setupCounters();
  setupParallax();
  setupHeroGrid();
  setupSimulator();

  if (window.lucide) {
    window.lucide.createIcons();
  }
});
