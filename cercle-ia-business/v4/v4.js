(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------- titres découpés en mots ---------- */
  $$('.sec-head h2').forEach((h) => {
    const parts = h.innerHTML.split(/(<br\s*\/?>)/);
    let i = 0;
    h.innerHTML = parts.map((p) => /^<br/.test(p) ? p : p.split(/(\s+)/).map((w) => /^\s*$/.test(w) ? w : `<span class="w" style="--i:${i++}">${w}</span>`).join('')).join('');
    h.classList.add('split');
  });

  /* ---------- barre de progression + parallaxe du hero ---------- */
  const fls = $$('.fl');
  let sr = 0;
  const onScroll = () => {
    sr = 0;
    const max = document.documentElement.scrollHeight - innerHeight;
    document.documentElement.style.setProperty('--sp', (scrollY / max).toFixed(4));
    if (scrollY < innerHeight * 1.2) fls.forEach((f, i) => f.style.setProperty('--py', (scrollY * (i % 2 ? -.22 : -.12)).toFixed(1)));
  };
  addEventListener('scroll', () => { if (!sr) sr = requestAnimationFrame(onScroll); }, { passive: true });
  onScroll();

  /* ---------- reveal ---------- */
  const visible = new Set();
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); visible.add(e.target); onShow(e.target); }
    else visible.delete(e.target);
  }), { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  $$('.rv').forEach((el) => io.observe(el));
  const alive = (el) => visible.has(el.closest('.rv'));

  /* ---------- hero : mot qui bascule lettre à lettre ---------- */
  const fw = $('.flip-word');
  if (fw && !reduce) {
    const words = ['ton restaurant', 'ta boutique', 'ton cabinet', 'ton entreprise', 'ton équipe', 'ton agence'];
    const set = (w, cls) => {
      fw.textContent = '';
      [...w].forEach((c, i) => {
        const s = document.createElement('span');
        s.className = 'ch ' + cls; s.textContent = c === ' ' ? ' ' : c;
        s.style.animationDelay = (i * (cls === 'in' ? 28 : 14)) + 'ms';
        fw.append(s);
      });
    };
    (async () => {
      let i = 0;
      for (;;) {
        await wait(2800);
        set(words[i % words.length], 'out');
        await wait(260 + words[i % words.length].length * 14);
        i++;
        set(words[i % words.length], 'in');
      }
    })();
  }

  /* ---------- exemples : boucle infinie ---------- */
  const track = $('.rail-track');
  if (track) track.append(...[...track.children].map((n) => { const c = n.cloneNode(true); c.setAttribute('aria-hidden', 'true'); return c; }));

  /* ---------- segmented controls ---------- */
  const placeInd = (seg) => {
    const on = $('[aria-selected="true"]', seg) || $('input:checked', seg)?.parentElement;
    const ind = $('.seg-ind', seg);
    if (!on || !ind) return;
    ind.style.width = on.offsetWidth + 'px';
    ind.style.transform = `translateX(${on.offsetLeft}px)`;
  };
  const segs = $$('.seg');
  const placeAll = () => segs.forEach(placeInd);
  placeAll(); addEventListener('resize', placeAll); document.fonts?.ready.then(placeAll);

  /* ---------- pour qui ---------- */
  const who = $('.who');
  const week = $('.week');
  const sets = week ? JSON.parse(week.dataset.sets) : [];
  let weekRun = 0;
  async function playWeek(k) {
    const run = ++weekRun, items = $$('li', week);
    items.forEach((li, j) => {
      li.classList.remove('done', 'enter'); void li.offsetWidth;
      $('span', li).textContent = sets[k][j]; li.classList.add('enter');
      li.style.animationDelay = j * 70 + 'ms';
    });
    if (reduce) { items.forEach((li) => li.classList.add('done')); return; }
    await wait(900);
    for (const li of items) { if (run !== weekRun) return; li.classList.add('done'); await wait(650); }
  }
  let whoTouched = false;
  const showWho = (k) => {
    $$('[data-who]', who).forEach((x) => x.setAttribute('aria-selected', +x.dataset.who === k));
    $$('.who-t', who).forEach((p, i) => p.classList.toggle('is-on', i === k));
    $$('.who-art img', who).forEach((p, i) => p.classList.toggle('is-on', i === k));
    placeInd($('.seg', who)); playWeek(k);
  };
  if (who) $$('[data-who]', who).forEach((t) => t.addEventListener('click', () => { whoTouched = true; showWho(+t.dataset.who); }));
  async function whoLoop() {
    playWeek(0);
    if (reduce) return;
    let k = 0;
    for (;;) {
      await wait(6500);
      if (whoTouched) return;
      if (!visible.has(who)) continue;
      k = (k + 1) % 3; showWho(k);
    }
  }

  /* ---------- composer ---------- */
  const typed = $('.c-typed');
  const prompts = ['Réponds aux avis Google de mon restaurant', 'Relance les devis restés sans réponse', 'Prépare mes posts de la semaine', 'Résume la réunion de ce matin', 'Trie mes mails clients par urgence'];
  async function typeLoop() {
    let i = 0;
    for (;;) {
      const s = prompts[i++ % prompts.length];
      for (let k = 1; k <= s.length; k++) { typed.textContent = s.slice(0, k); await wait(40 + Math.random() * 40); }
      await wait(2000);
      for (let k = s.length; k >= 0; k--) { typed.textContent = s.slice(0, k); await wait(15); }
      await wait(300);
    }
  }

  /* ---------- cartes animées ---------- */
  async function think(el) {
    const rows = $$('p', el);
    for (;;) {
      rows.forEach((r) => (r.className = ''));
      for (const r of rows) { r.className = 'on'; await wait(1300); r.className = 'done'; }
      await wait(1800);
      while (!alive(el)) await wait(500);
    }
  }
  async function flow(el) {
    const parts = $$('.node, .edge', el);
    for (;;) {
      parts.forEach((p) => p.classList.remove('lit'));
      await wait(500);
      for (const p of parts) { p.classList.add('lit'); await wait(p.classList.contains('edge') ? 520 : 420); }
      await wait(2000);
      while (!alive(el)) await wait(500);
    }
  }
  async function gen(el) {
    const n = $('.gen-n', el);
    for (;;) {
      el.classList.remove('done');
      for (let k = 3; k >= 1; k--) { n.textContent = k; await wait(900); }
      el.classList.add('done');
      await wait(3200);
      while (!alive(el)) await wait(500);
    }
  }

  const started = new Set();
  const once = (el, fn) => { if (started.has(el)) return; started.add(el); fn(el); };
  function onShow(el) {
    if (el === who) once(el, whoLoop);
    if (typed && el.contains(typed)) once(typed, reduce ? () => (typed.textContent = prompts[0]) : typeLoop);
    if (reduce) {
      $$('.p-gen', el).forEach((g) => g.classList.add('done'));
      $$('.p-think p', el).forEach((p) => (p.className = 'done'));
      return;
    }
    $$('.p-think', el).forEach((x) => once(x, think));
    $$('.p-flow', el).forEach((x) => once(x, flow));
    $$('.p-gen', el).forEach((x) => once(x, gen));
  }

  /* ---------- formulaire ---------- */
  const NUMBERS = { boris: '33782988589', kevin: '33781270587' };
  const NAMES = { boris: 'Boris', kevin: 'Kévin' };
  const form = $('#form');
  if (form) {
    const err = $('.form-error', form), seg = $('.seg-form', form);
    const sync = () => {
      const cercle = form.intent.value === 'cercle';
      $$('.cercle-only', form).forEach((el) => (el.style.display = cercle ? '' : 'none'));
      placeInd(seg);
    };
    $$('input[name="intent"]', form).forEach((r) => r.addEventListener('change', sync));
    $$('[data-intent]').forEach((a) => a.addEventListener('click', () => {
      const r = $(`input[name="intent"][value="${a.dataset.intent}"]`, form);
      if (r) { r.checked = true; sync(); }
    }));
    $$('select', form).forEach((s) => {
      const paint = () => (s.style.color = s.value ? '' : 'var(--ink3)');
      s.addEventListener('change', paint); paint();
    });
    sync();
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const v = (n) => (form[n] && form[n].value ? form[n].value.trim() : '');
      const cercle = form.intent.value === 'cercle';
      if (['nom', 'profil', 'activite', 'tache'].some((n) => !v(n))) {
        err.textContent = 'Merci de remplir ton nom, ton profil, ton activité et ce que tu veux confier à l’IA.';
        return;
      }
      if (cercle && !form.engage.checked) {
        err.textContent = 'Pour rejoindre le Cercle, coche l’engagement à partager où tu en es.';
        return;
      }
      err.textContent = '';
      const to = form.to.value;
      const lines = [
        `Bonjour ${NAMES[to]}, ${cercle ? 'je souhaite rejoindre le Cercle IA Business.' : 'je souhaite réserver un échange découverte.'}`,
        '',
        `Nom : ${v('nom')}`,
        `Profil : ${v('profil')}`,
        `Activité / rôle : ${v('activite')}`,
        cercle && v('equipe') ? `Équipe : ${v('equipe')}` : null,
        `Ce que j’aimerais confier à l’IA : ${v('tache')}`,
        cercle && v('invest') ? `Déjà investi dans un outil, une formation ou un prestataire : ${v('invest')}` : null,
        cercle ? 'Je m’engage à partager où j’en suis dans le Cercle.' : null,
      ].filter((l) => l !== null);
      const send = () => window.open(`https://wa.me/${NUMBERS[to]}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
      if (!cercle) { send(); return; }
      // Rejoindre le Cercle : on rappelle le prix et la durée avant d'ouvrir WhatsApp
      lines.push('J’ai bien noté l’adhésion : 150 € pour 6 mois.');
      confirmPrice(send);
    });
  }
  function confirmPrice(onOk) {
    const old = document.querySelector('.cf-overlay'); if (old) old.remove();
    const o = document.createElement('div');
    o.className = 'cf-overlay';
    o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true'); o.setAttribute('aria-labelledby', 'cf-title');
    o.innerHTML = `
      <div class="cf-card">
        <p class="cf-kicker" id="cf-title">Avant d’envoyer ta candidature</p>
        <p class="cf-title">Ta place dans le Cercle</p>
        <div class="cf-price"><span class="cf-amount">150 €</span><span class="cf-dur">pour 6 mois<br><small>renouvelable</small></span></div>
        <ul class="cf-list">
          <li><i style="--c:#1d6bff"><svg viewBox="0 0 20 20"><path d="M4 4.5h12v8H9l-4 3v-3H4z"/></svg></i><div><b>Des réponses à tes questions</b><span>Une solution adaptée à ton activité, pas une réponse générique.</span></div></li>
          <li><i style="--c:#ec4899"><svg viewBox="0 0 20 20"><rect x="3" y="4.5" width="14" height="9.5" rx="2"/><path d="M8 17h4M10 14v3"/></svg></i><div><b>Une masterclass en direct</b><span>Toutes les deux semaines, sur un cas concret.</span></div></li>
          <li><i style="--c:#8b5cf6"><svg viewBox="0 0 20 20"><path d="M10 3.5 12 8l4.8.4-3.7 3.1 1.2 4.7L10 13.6l-4.3 2.6 1.2-4.7L3.2 8.4 8 8z"/></svg></i><div><b>Des avantages membres</b><span>Formations à prix réduit, accès prioritaire.</span></div></li>
        </ul>
        <p class="cf-note">Tu règles l’adhésion après ton échange avec Boris ou Kévin.</p>
        <button type="button" class="btn btn-primary btn-wide" data-cf-ok>C’est bon pour moi, j’envoie</button>
        <button type="button" class="cf-back" data-cf-back>Revenir</button>
      </div>`;
    document.body.appendChild(o);
    requestAnimationFrame(() => o.classList.add('on'));
    const close = () => { o.classList.remove('on'); setTimeout(() => o.remove(), 250); };
    o.querySelector('[data-cf-ok]').addEventListener('click', () => { onOk(); close(); });
    o.querySelector('[data-cf-back]').addEventListener('click', close);
    o.addEventListener('click', (e) => { if (e.target === o) close(); });
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } });
    o.querySelector('[data-cf-ok]').focus();
  }
})();
