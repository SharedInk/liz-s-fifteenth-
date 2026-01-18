document.addEventListener("DOMContentLoaded", () => {
  // ENTRY
  const entry = document.getElementById("entry");
  const site = document.getElementById("site");
  const nameInput = document.getElementById("nameInput");
  const enterBtn = document.getElementById("enterBtn");

  enterBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (!name) return;

    document.getElementById("titleText").textContent =
      "Happy Birthday, " + name;
    document.getElementById("homeText").textContent =
      "Happy 15th, " + name;

    entry.classList.add("hidden");
    site.classList.remove("hidden");
  });

  // TABS
  const tabs = document.querySelectorAll(".tab");
  const pages = document.querySelectorAll(".page");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      pages.forEach(p => p.classList.remove("show"));

      tab.classList.add("active");
      document.getElementById(tab.dataset.page).classList.add("show");
    });
  });

  // CARD
  const cardInput = document.getElementById("cardInput");
  const saveCard = document.getElementById("saveCard");
  const cardPreview = document.getElementById("cardPreview");

  saveCard.addEventListener("click", () => {
    cardPreview.textContent = cardInput.value || "Your message will appear here.";
  });

  // ABOUT NOTES
  document.querySelectorAll(".note").forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById("noteOutput").textContent = btn.dataset.text;
    });
  });
});
