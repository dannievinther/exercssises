const popup = Array.from(document.querySelectorAll(".popup"));
popup.forEach((pop) => {
  const popupSum = pop.querySelector("summary");
  if (popupSum.length === 0) return;
  pop.addEventListener(
    "click",
    () => {
      dismiss(pop);
    },
    { once: true }
  );
});

function dismiss(details) {
  document.addEventListener("click", ({ target }) => {
    if (!target.closest("summary")) {
      details.open = false;
    }
  });
}
