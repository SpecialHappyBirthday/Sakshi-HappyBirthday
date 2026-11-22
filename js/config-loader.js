window.BirthdayApp = (() => {
  const THEMES = {
    lunarRose: { label: "Lunar Rose", bg: "#03040a", accent: "#ff4d88", accent2: "#e2c9a6", gold: "#ffe4b5", panel: "rgba(10, 12, 24, 0.92)", sceneBg: 0x03040a, moonTint: 0xfff8eb, envBody: "#18111a", envFlap: "#221625", envMetal: "#e2c9a6", envMetalSoft: "rgba(226, 201, 166, 0.34)", envSealBg: "radial-gradient(circle at 32% 28%, #fff8eb 0%, #ffe4b5 26%, #ff4d88 72%, #9d174d 100%)", envSealText: "#2a0816", letterPaperBg: "linear-gradient(180deg, #fffdfb 0%, #fff4f7 100%)", letterInk: "#241921", letterInkSoft: "#6e4558", letterAccent: "#b5175c", letterRule: "rgba(226, 201, 166, 0.45)" },
    cosmicBlue: { label: "Cosmic Blue", bg: "#020612", accent: "#38bdf8", accent2: "#bae6fd", gold: "#fde68a", panel: "rgba(6, 15, 36, 0.92)", sceneBg: 0x020612, moonTint: 0xf0f7ff, envBody: "#0d1629", envFlap: "#13203b", envMetal: "#bae6fd", envMetalSoft: "rgba(186, 230, 253, 0.34)", envSealBg: "radial-gradient(circle at 32% 28%, #ffffff 0%, #bae6fd 30%, #0284c7 74%, #0c4a6e 100%)", envSealText: "#06192e", letterPaperBg: "linear-gradient(180deg, #fcfdff 0%, #eef7ff 100%)", letterInk: "#132136", letterInkSoft: "#466385", letterAccent: "#0369a1", letterRule: "rgba(186, 230, 253, 0.5)" },
    nebulaViolet: { label: "Nebula Gold", bg: "#070312", accent: "#c084fc", accent2: "#f5d0fe", gold: "#fde047", panel: "rgba(18, 8, 36, 0.92)", sceneBg: 0x070312, moonTint: 0xfff5e4, envBody: "#160e26", envFlap: "#211538", envMetal: "#f5d0fe", envMetalSoft: "rgba(245, 208, 254, 0.34)", envSealBg: "radial-gradient(circle at 32% 28%, #fffbeb 0%, #fde047 28%, #9333ea 74%, #581c87 100%)", envSealText: "#230b38", letterPaperBg: "linear-gradient(180deg, #fefcff 0%, #f7f0ff 100%)", letterInk: "#231733", letterInkSoft: "#624880", letterAccent: "#7e22ce", letterRule: "rgba(245, 208, 254, 0.5)" },
    auroraEmerald: { label: "Aurora Mint", bg: "#020b09", accent: "#34d399", accent2: "#a7f3d0", gold: "#f3d184", panel: "rgba(5, 24, 19, 0.92)", sceneBg: 0x020b09, moonTint: 0xf4fff9, envBody: "#0d1f1b", envFlap: "#132d27", envMetal: "#a7f3d0", envMetalSoft: "rgba(167, 243, 208, 0.34)", envSealBg: "radial-gradient(circle at 32% 28%, #fffbeb 0%, #f3d184 28%, #059669 74%, #064e3b 100%)", envSealText: "#05241b", letterPaperBg: "linear-gradient(180deg, #fcfffd 0%, #edfaf4 100%)", letterInk: "#132922", letterInkSoft: "#446e61", letterAccent: "#047857", letterRule: "rgba(167, 243, 208, 0.5)" }
  };
  let activeThemeKey = sessionStorage.getItem("bday_theme") || "cosmicBlue";
  const themeListeners = [];
  function onThemeChange(fn) { if (typeof fn === "function") themeListeners.push(fn); }
  function getActiveThemeKey() { return activeThemeKey; }
  function applyTheme(key) {
    const th = THEMES[key] || THEMES.cosmicBlue;
    activeThemeKey = THEMES[key] ? key : "cosmicBlue";
    sessionStorage.setItem("bday_theme", activeThemeKey);
    document.querySelectorAll(".theme-dot").forEach((b) => b.classList.toggle("active", b.dataset.theme === activeThemeKey));
    const labelEl = document.getElementById("theme-name");
    if (labelEl) labelEl.textContent = th.label;
    const r = document.documentElement.style;
    r.setProperty("--bg", th.bg); r.setProperty("--accent", th.accent); r.setProperty("--accent-2", th.accent2); r.setProperty("--gold", th.gold); r.setProperty("--panel-bg", th.panel);
    r.setProperty("--env-body", th.envBody); r.setProperty("--env-flap", th.envFlap); r.setProperty("--env-metal", th.envMetal); r.setProperty("--env-metal-soft", th.envMetalSoft);
    r.setProperty("--env-seal-bg", th.envSealBg); r.setProperty("--env-seal-text", th.envSealText);
    r.setProperty("--letter-paper-bg", th.letterPaperBg); r.setProperty("--letter-ink", th.letterInk); r.setProperty("--letter-ink-soft", th.letterInkSoft); r.setProperty("--letter-accent", th.letterAccent); r.setProperty("--letter-rule", th.letterRule);
    themeListeners.forEach((fn) => fn(activeThemeKey, th));
  }
  function initThemeBar(fw) {
    document.querySelectorAll(".theme-dot").forEach((btn) => btn.addEventListener("click", () => { applyTheme(btn.dataset.theme); if (fw) fw.celebrateBurst(1); }));
    const fwBtn = document.getElementById("fw-toggle-btn");
    if (fwBtn && fw) {
      fwBtn.classList.toggle("active", fw.isEnabled());
      fwBtn.addEventListener("click", () => { const n = !fw.isEnabled(); fw.setEnabled(n); fwBtn.classList.toggle("active", n); });
    }
  }
  function initFireworksFestival() {
    const cvs = document.getElementById("fireworks-canvas");
    const ctx = cvs ? cvs.getContext("2d") : null;
    let enabled = true, finaleMode = false, shells = [], sparks = [], lastTime = performance.now();
    const resize = () => { if (cvs) { cvs.width = window.innerWidth; cvs.height = window.innerHeight; } };
    resize(); window.addEventListener("resize", resize);
    const launch = () => {
      if (!enabled || !cvs) return;
      const sx = cvs.width * (0.15 + Math.random() * 0.7), tx = sx + (Math.random() - 0.5) * 180, ty = cvs.height * (0.15 + Math.random() * 0.32), ft = 0.95;
      shells.push({ x: sx, y: cvs.height, vx: (tx - sx) / ft, vy: (ty - cvs.height) / ft - 140 * ft, age: 0, ft });
    };
    const celebrateBurst = (n = 2) => { for (let i = 0; i < n; i++) setTimeout(launch, i * 240); };
    setInterval(() => { if (enabled && document.visibilityState === "visible") launch(); }, 1800);
    const step = (now) => {
      requestAnimationFrame(step); if (!ctx || !cvs) return;
      const dt = Math.min(0.05, (now - lastTime) / 1000); lastTime = now;
      ctx.clearRect(0, 0, cvs.width, cvs.height); if (!enabled) return;
      ctx.globalCompositeOperation = "lighter";
      for (let i = shells.length - 1; i >= 0; i--) {
        const s = shells[i]; s.age += dt; s.vy += 280 * dt; s.x += s.vx * dt; s.y += s.vy * dt;
        ctx.fillStyle = "#ffe4b5"; ctx.beginPath(); ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2); ctx.fill();
        if (s.age >= s.ft) {
          for (let k = 0; k < 90; k++) {
            const a = (Math.PI * 2 * k) / 90, sp = 140 + Math.random() * 140;
            sparks.push({ x: s.x, y: s.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, maxLife: 1.4, color: k % 2 ? "#38bdf8" : "#fde68a" });
          }
          shells.splice(i, 1);
        }
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i]; p.life += dt; if (p.life >= p.maxLife) { sparks.splice(i, 1); continue; }
        p.vx *= 0.96; p.vy = p.vy * 0.96 + 55 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        ctx.globalAlpha = 1 - p.life / p.maxLife; ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    };
    requestAnimationFrame(step);
    return { setEnabled(v) { enabled = !!v; }, isEnabled() { return enabled; }, setFinaleMode(v) { finaleMode = !!v; }, celebrateBurst };
  }
  function initSparkleCursor() {}
  function initGlowEmojis() {}
  function initAudioDock(cfg) {
    const audioEl = document.getElementById("bg-audio"), playBtn = document.getElementById("dock-play");
    if (!audioEl || !playBtn || !cfg.music?.enabled) return;
    document.getElementById("dock-song").textContent = cfg.music.title;
    document.getElementById("dock-artist").textContent = cfg.music.artist;
    audioEl.src = cfg.music.file;
    let playing = false;
    playBtn.addEventListener("click", () => {
      if (playing) { audioEl.pause(); playing = false; playBtn.textContent = cfg.music.playLabel; }
      else { audioEl.play().then(() => { playing = true; playBtn.textContent = cfg.music.pauseLabel; }).catch(() => {}); }
    });
  }
  async function loadConfig() {
    const res = await fetch("config.json", { cache: "no-store" });
    const cfg = await res.json();
    document.title = cfg.meta.pageTitle;
    applyTheme(sessionStorage.getItem("bday_theme") || cfg.meta.defaultTheme || "cosmicBlue");
    return cfg;
  }
  function esc(s) { return String(s ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  return { THEMES, loadConfig, applyTheme, getActiveThemeKey, onThemeChange, initThemeBar, initFireworksFestival, initSparkleCursor, initGlowEmojis, initAudioDock, esc };
})();