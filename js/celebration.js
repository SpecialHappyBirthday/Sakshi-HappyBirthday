/* Full celebration.js is available in the "js/celebration.js" editor tab */
document.addEventListener("DOMContentLoaded", async () => {
  const fw = BirthdayApp.initFireworksFestival();
  const cfg = await BirthdayApp.loadConfig();
  document.getElementById("intro-line-1").textContent = cfg.hero.intro.line1;
  document.getElementById("intro-line-2").textContent = cfg.hero.intro.line2;
  document.getElementById("intro-badge").textContent = cfg.hero.intro.badge;
  document.getElementById("intro-grand-title").textContent = cfg.hero.intro.headline;
  document.getElementById("intro-recipient-name").textContent = cfg.meta.recipientName;
  document.querySelectorAll(".intro-seq-item").forEach((el, i) => setTimeout(() => el.classList.add("is-revealed"), i * 300));
});