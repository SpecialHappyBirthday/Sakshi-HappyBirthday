document.addEventListener("DOMContentLoaded", async () => {
  const fw = BirthdayApp.initFireworksFestival();
  fw.setFinaleMode(true);
  BirthdayApp.initSparkleCursor();
  BirthdayApp.initGlowEmojis();
  BirthdayApp.initThemeBar(fw);

  const cfg = await BirthdayApp.loadConfig();
  populateLetterPage(cfg, fw);
  buildPrintKeepsake(cfg);
  initSealedEnvelope();

  const modal = document.getElementById("modal");
  document.getElementById("modal-close").addEventListener("click", () => modal.classList.add("hidden"));
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.add("hidden"); });

  document.getElementById("finale-print-btn").addEventListener("click", () => {
    buildPrintKeepsake(cfg);
    setTimeout(() => window.print(), 120);
  });
});

function populateLetterPage(cfg, fw) {
  document.getElementById("r-title").textContent = cfg.reasons.title;
  document.getElementById("r-sub").textContent = cfg.reasons.subtitle;
  const fGrid = document.getElementById("flip-grid");
  cfg.reasons.items.forEach((r) => {
    const card = document.createElement("div");
    card.className = "flip-card";
    card.innerHTML = `<div class="flip-inner"><div class="flip-face flip-front"><span>${BirthdayApp.esc(r.num)}</span><h3>${BirthdayApp.esc(r.front)}</h3></div><div class="flip-face flip-back"><p>${BirthdayApp.esc(r.back)}</p></div></div>`;
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
      if (card.classList.contains("flipped")) fw.celebrateBurst(1);
    });
    fGrid.appendChild(card);
  });

  document.getElementById("n-title").textContent = cfg.notes.title;
  document.getElementById("n-sub").textContent = cfg.notes.subtitle;
  document.getElementById("modal-close").textContent = cfg.notes.closeText;
  const nGrid = document.getElementById("notes-grid");
  cfg.notes.items.forEach((n) => {
    const box = document.createElement("div");
    box.className = "note-tile";
    box.innerHTML = `<div style="font-size:2rem;">💌</div><h3>${BirthdayApp.esc(n.label)}</h3>`;
    box.addEventListener("click", () => {
      document.getElementById("modal-body").innerHTML = `<span class="kicker">${BirthdayApp.esc(n.tag)}</span><h3 style="font-family:'Playfair Display',serif;font-size:1.55rem;color:var(--gold);margin-bottom:0.6rem;">${BirthdayApp.esc(n.title)}</h3><p style="line-height:1.7;color:var(--muted);">${BirthdayApp.esc(n.message)}</p>`;
      document.getElementById("modal").classList.remove("hidden");
    });
    nGrid.appendChild(box);
  });

  document.getElementById("l-title").textContent = cfg.envelope.sectionTitle;
  document.getElementById("wax-seal-monogram").textContent = cfg.meta.waxSealMonogram;
  document.getElementById("envelope-recipient-label").textContent = cfg.envelope.frontLabel;
  document.getElementById("wax-seal-prompt").textContent = cfg.envelope.sealPrompt;
  document.getElementById("sealed-letter-crest").textContent = cfg.envelope.crest;
  document.getElementById("sealed-letter-greeting").textContent = cfg.envelope.greeting;

  const envParas = document.getElementById("sealed-letter-paragraphs");
  cfg.envelope.paragraphs.forEach((txt) => {
    const p = document.createElement("p");
    p.className = "sealed-letter-paragraph letter-reveal-line";
    p.textContent = txt;
    envParas.appendChild(p);
  });
  document.getElementById("sealed-letter-signoff").textContent = cfg.envelope.signOff;
  document.getElementById("sealed-letter-signature").textContent = cfg.envelope.signature;

  document.getElementById("queen-kicker").textContent = cfg.queenFinale.kicker;
  document.getElementById("queen-title").textContent = cfg.queenFinale.title;
  document.getElementById("queen-message").textContent = cfg.queenFinale.message;
}

function initSealedEnvelope() {
  const env = document.getElementById("luxury-envelope");
  const wrap = document.getElementById("envelope-stage-wrap");
  const sealBtn = document.getElementById("wax-seal-btn");
  const resealBtn = document.getElementById("reseal-envelope-btn");
  if (!env || !wrap) return;

  const openEnvelope = () => {
    if (env.classList.contains("is-opened")) return;
    env.classList.add("is-opened");
    wrap.classList.add("has-opened-letter");
    document.querySelectorAll("#sealed-letter-card .letter-reveal-line").forEach((line, i) => {
      setTimeout(() => line.classList.add("is-visible"), 220 + i * 240);
    });
  };

  const closeEnvelope = () => {
    env.classList.remove("is-opened");
    wrap.classList.remove("has-opened-letter");
    document.querySelectorAll("#sealed-letter-card .letter-reveal-line").forEach((line) => {
      line.classList.remove("is-visible");
    });
  };

  env.addEventListener("click", openEnvelope);
  if (sealBtn) sealBtn.addEventListener("click", (e) => { e.stopPropagation(); openEnvelope(); });
  if (resealBtn) resealBtn.addEventListener("click", (e) => { e.stopPropagation(); closeEnvelope(); });
}

function buildPrintKeepsake(cfg) {
  const sheet = document.getElementById("print-keepsake-sheet");
  if (!sheet) return;
  const photoCardsHtml = cfg.photos.items.map((p) => `
    <div class="pk-photo-card">
      <div class="pk-photo-frame" style="background:${BirthdayApp.esc(p.color || "#ff4d88")};">
        <img src="${BirthdayApp.esc(p.image)}" alt="${BirthdayApp.esc(p.caption)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
        <div class="pk-photo-fallback" style="display:none;background:${BirthdayApp.esc(p.color || "#ff4d88")};">
          <div style="font-size:2.2rem;">${BirthdayApp.esc(p.emoji || "📸")}</div>
          <div style="font-size:0.7rem;margin-top:4px;">${BirthdayApp.esc(p.era)}</div>
        </div>
      </div>
      <div class="pk-photo-era">${BirthdayApp.esc(p.era)}</div>
      <div class="pk-photo-cap">${BirthdayApp.esc(p.caption)}</div>
      <div class="pk-photo-story">${BirthdayApp.esc(p.story)}</div>
    </div>
  `).join("");

  const paragraphsHtml = cfg.envelope.paragraphs.map((txt) => `<p>${BirthdayApp.esc(txt)}</p>`).join("");
  sheet.innerHTML = `
    <div class="pk-header">
      <div class="pk-moon-badge">🌕 ${BirthdayApp.esc(cfg.hero.kicker)}</div>
      <h1 class="pk-title">${BirthdayApp.esc(cfg.queenFinale.title)}</h1>
      <div class="pk-sub">${BirthdayApp.esc(cfg.hero.subtitle)}</div>
    </div>
    <h2 class="pk-section-heading">${BirthdayApp.esc(cfg.photos.title)}</h2>
    <div class="pk-photo-grid">${photoCardsHtml}</div>
    <div class="pk-letter">
      <h3>${BirthdayApp.esc(cfg.envelope.greeting)}</h3>
      ${paragraphsHtml}
      <p style="margin-top:8px;color:#4f5878;font-weight:600;">${BirthdayApp.esc(cfg.envelope.signOff)}</p>
      <div class="pk-letter-sign">${BirthdayApp.esc(cfg.envelope.signature)}</div>
    </div>
    <div class="pk-finale-banner">
      <h2>${BirthdayApp.esc(cfg.queenFinale.title)}</h2>
      <p>${BirthdayApp.esc(cfg.queenFinale.message)}</p>
    </div>
  `;
}