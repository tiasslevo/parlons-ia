const CHANNEL_URL = "https://whatsapp.com/channel/0029VbCaX96EgGfOFW6Isc37";
const COMMUNITY_URL = "https://chat.whatsapp.com/L1bc0rZp4Zv4epYPAcSatx?s=cl&p=a&ilr=0";

const channelMessages = [
  {
    name: "Parlons IA",
    time: "Aujourd'hui, 09:12",
    body: "Nouveau guide partagé : <strong>Product Shoot Prompt Kit</strong>. Avant / après, prompt et variantes.",
    actionLabel: "Voir le guide",
    actionHref: "./articles/product-photo-prompt/"
  },
  {
    name: "Parlons IA",
    time: "Aujourd'hui, 11:08",
    body: "<strong>Atelier Parlons IA</strong> très bientôt. Le thème et le format seront annoncés ici."
  },
  {
    name: "Parlons IA",
    time: "Aujourd'hui, 14:42",
    body: "Concours ouvert : crée une <strong>carte d'invitation de mariage avec l'IA</strong>. Prix : 100$ d'abonnement IA. Deadline : 1er juin.",
    actionLabel: "Participer",
    actionHref: "./concours/"
  }
];

const communityMessages = [
  {
    name: "Maya",
    time: "09:22",
    body: "Quelqu'un a déjà testé GPT Image pour une invitation élégante avec de vrais espaces pour le texte ?"
  },
  {
    name: "Boris",
    time: "09:28",
    body: "Oui. Commence simple : ton, composition, marges, puis seulement après les détails visuels."
  },
  {
    name: "Kevin",
    time: "09:31",
    body: "Poste ton essai dans la communauté, on pourra te faire un retour dessus."
  }
];

function hydrateLinks() {
  document.querySelectorAll("[data-channel-url]").forEach((node) => {
    node.href = CHANNEL_URL;
  });

  document.querySelectorAll("[data-community-url]").forEach((node) => {
    node.href = COMMUNITY_URL;
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
        const alpha = 0.05 + proximity * 0.13;

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

function buildMessage(item, self = false) {
  const wrapper = document.createElement("div");
  wrapper.className = self
    ? "bg-emerald-50/80 ml-auto rounded-xl p-3 shadow-sm border border-zinc-200/50 max-w-[85%]"
    : "bg-white rounded-xl p-3 shadow-sm border border-zinc-200/50 max-w-[90%] mr-auto";

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

function renderSimulator(mode) {
  const title = document.querySelector("[data-sim-title]");
  const subtitle = document.querySelector("[data-sim-subtitle]");
  const input = document.querySelector("[data-sim-input]");
  const area = document.querySelector("[data-sim-area]");
  const channelTab = document.querySelector("[data-sim-tab='channel']");
  const communityTab = document.querySelector("[data-sim-tab='community']");

  if (!title || !subtitle || !input || !area || !channelTab || !communityTab) return;

  area.innerHTML = "";

  if (mode === "community") {
    title.textContent = "Parlons IA — Communauté";
    subtitle.textContent = "Questions, retours et entraide";
    input.textContent = "Écrire un message...";
    channelTab.className = "w-1/2 py-2 text-center font-semibold border-b-2 border-transparent text-zinc-400 hover:text-white transition-all";
    communityTab.className = "w-1/2 py-2 text-center font-semibold border-b-2 border-emerald-500 text-emerald-400 transition-all";
    communityMessages.forEach((message, index) => {
      area.appendChild(buildMessage(message, index > 0));
    });
    return;
  }

  title.textContent = "Parlons IA — Chaîne";
  subtitle.textContent = "Prompts, annonces et nouveautés";
  input.textContent = "Lecture seule pour la chaîne";
  channelTab.className = "w-1/2 py-2 text-center font-semibold border-b-2 border-emerald-500 text-emerald-400 transition-all";
  communityTab.className = "w-1/2 py-2 text-center font-semibold border-b-2 border-transparent text-zinc-400 hover:text-white transition-all";
  channelMessages.forEach((message) => {
    area.appendChild(buildMessage(message));
  });
}

function setupSimulator() {
  const tabs = document.querySelectorAll("[data-sim-tab]");
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      renderSimulator(tab.dataset.simTab);
    });
  });

  renderSimulator("channel");
}

document.addEventListener("DOMContentLoaded", () => {
  hydrateLinks();
  setupMobileMenu();
  setupHeroGrid();
  setupSimulator();

  if (window.lucide) {
    window.lucide.createIcons();
  }
});
