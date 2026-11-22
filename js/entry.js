document.addEventListener("DOMContentLoaded", async () => {
  const fw = BirthdayApp.initFireworksFestival();
  BirthdayApp.initSparkleCursor();
  BirthdayApp.initThemeBar(fw);
  const cfg = await BirthdayApp.loadConfig();
  BirthdayApp.initAudioDock(cfg);
  initCurtainStage(cfg, fw);
  initVaultGate(cfg, fw);
});
function initCurtainStage(cfg, fw) {
  const stage = document.getElementById("curtain-stage");
  const ctaEl = document.getElementById("curtain-cta");
  if (!stage) return;
  document.getElementById("curtain-badge").textContent = cfg.curtain.badge;
  document.getElementById("curtain-title").textContent = cfg.curtain.title;
  document.getElementById("curtain-sub").textContent = cfg.curtain.subtitle;
  let canOpen = false;
  const targetTs = new Date(cfg.curtain.curtainOpenTimeISO).getTime();
  const tick = () => {
    const now = Date.now();
    if (isNaN(targetTs) || now >= targetTs) {
      canOpen = true;
      ["cd-days","cd-hours","cd-mins","cd-secs"].forEach(id => document.getElementById(id).textContent = "00");
      if (ctaEl) ctaEl.textContent = cfg.curtain.ctaText;
      return;
    }
    const d = targetTs - now;
    document.getElementById("cd-days").textContent = String(Math.floor(d / 86400000)).padStart(2, "0");
    document.getElementById("cd-hours").textContent = String(Math.floor((d / 3600000) % 24)).padStart(2, "0");
    document.getElementById("cd-mins").textContent = String(Math.floor((d / 60000) % 60)).padStart(2, "0");
    document.getElementById("cd-secs").textContent = String(Math.floor((d / 1000) % 60)).padStart(2, "0");
    if (ctaEl) ctaEl.textContent = cfg.curtain.lockedMessage;
  };
  tick(); setInterval(tick, 1000);
  stage.addEventListener("click", () => {
    if (!canOpen) return;
    stage.classList.add("opened");
    setTimeout(() => stage.classList.add("hidden"), 900);
    fw.celebrateBurst(2);
  });
}
function initVaultGate(cfg, fw) {
  document.getElementById("v-kicker").textContent = cfg.vault.kicker;
  document.getElementById("v-title").textContent = cfg.vault.title;
  document.getElementById("v-sub").textContent = cfg.vault.subtitle;
  document.getElementById("v-input").placeholder = cfg.vault.placeholder;
  document.getElementById("v-btn").textContent = cfg.vault.button;
  document.getElementById("v-hint").textContent = cfg.vault.hint;
  document.getElementById("v-hint-btn").addEventListener("click", () => document.getElementById("v-hint").classList.toggle("hidden"));
  document.getElementById("v-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const val = document.getElementById("v-input").value.trim().toLowerCase();
    if (cfg.vault.passcodes.map(x => x.toLowerCase()).includes(val)) {
      document.getElementById("vault-overlay").classList.add("unlocked");
      document.getElementById("loading-screen").classList.remove("hidden");
      setTimeout(() => { window.location.href = "celebration.html"; }, 1100);
    } else {
      document.getElementById("v-err").textContent = cfg.vault.wrong;
    }
  });
}