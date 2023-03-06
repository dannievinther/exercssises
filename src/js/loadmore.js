const footerBtn = document.querySelector(".load-more");

footerBtn?.addEventListener("click", (e) => {
  document.documentElement.dataset.extra = "true";
  document
    .querySelectorAll("section[data-extra='true']")[0]
    .scrollIntoView({ behavior: "smooth" });
});
