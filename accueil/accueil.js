// Page d'accueil : deux portes. La fenêtre « ouvrir dans le navigateur »
// reprend celle du site (script.js) pour les visiteurs venus de TikTok, Instagram…
document.documentElement.classList.add("js");

function detectInAppBrowser() {
  const forced = new URLSearchParams(location.search).get("inapp");
  if (forced) return forced === "1" ? "TikTok" : forced.charAt(0).toUpperCase() + forced.slice(1);
  const ua = navigator.userAgent || "";
  if (/BytedanceWebview|musical_ly|TikTok|trill_|ByteLocale/i.test(ua)) return "TikTok";
  if (/Instagram/i.test(ua)) return "Instagram";
  if (/FBAN|FBAV|FB_IAB|FBIOS/i.test(ua)) return "Facebook";
  if (/Snapchat/i.test(ua)) return "Snapchat";
  return null;
}

function setupInAppNotice() {
  const app = detectInAppBrowser();
  if (!app) return;

  const url = new URL(location.href);
  url.searchParams.delete("inapp");
  const cleanUrl = url.toString();

  const style = document.createElement("style");
  style.textContent = `
    .inapp-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:flex-end;justify-content:center;
      background:rgba(9,9,11,.55);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);padding:16px;
      font-family:inherit;animation:inapp-fade .2s ease-out}
    .inapp-card{width:100%;max-width:420px;background:#fff;color:#09090b;border-radius:20px;padding:22px 20px 18px;
      box-shadow:0 20px 50px -12px rgba(0,0,0,.35);animation:inapp-up .25s ease-out}
    .inapp-card h2{font-size:19px;font-weight:700;line-height:1.25;margin:0 0 8px}
    .inapp-card p{font-size:14.5px;line-height:1.5;color:#3f3f46;margin:0 0 14px}
    .inapp-steps{background:#f4f4f5;border-radius:14px;padding:12px 14px;margin:0 0 14px;font-size:14px;line-height:1.55;color:#27272a}
    .inapp-steps strong{color:#09090b}
    .inapp-btn{display:flex;align-items:center;justify-content:center;width:100%;border:0;border-radius:12px;
      padding:13px 16px;font-size:15px;font-weight:600;cursor:pointer;text-decoration:none;font-family:inherit}
    .inapp-primary{background:#10b981;color:#fff;margin-bottom:8px}
    .inapp-card p.inapp-after{font-size:13.5px;color:#71717a;text-align:center;margin:0 0 14px}
    @keyframes inapp-fade{from{opacity:0}to{opacity:1}}
    @keyframes inapp-up{from{transform:translateY(24px);opacity:0}to{transform:none;opacity:1}}
    @media (prefers-reduced-motion: reduce){.inapp-overlay,.inapp-card{animation:none}}
  `;
  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.className = "inapp-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "inapp-title");
  overlay.innerHTML = `
    <div class="inapp-card">
      <h2 id="inapp-title">Ouvrez cette page dans votre navigateur</h2>
      <p>Vous êtes dans le navigateur de ${app}. Les liens WhatsApp (chaîne, communauté, contact) ne s'y ouvrent pas.</p>
      <button type="button" class="inapp-btn inapp-primary" data-inapp-copy>Copier le lien</button>
      <p class="inapp-after">Puis collez-le dans Chrome ou Safari.</p>
      <div class="inapp-steps">
        Autre solution : appuyez sur <strong>•••</strong> en haut à droite, puis <strong>« Ouvrir dans le navigateur »</strong>.
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const copyBtn = overlay.querySelector("[data-inapp-copy]");
  copyBtn.addEventListener("click", async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(cleanUrl);
      ok = true;
    } catch (e) {
      const field = document.createElement("textarea");
      field.value = cleanUrl;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      try { ok = document.execCommand("copy"); } catch (err) {}
      field.remove();
    }
    copyBtn.textContent = ok ? "Lien copié ✓" : cleanUrl;
  });
}

requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add("ready")));
setupInAppNotice();
