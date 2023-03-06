const copyMe = document.querySelectorAll(".small-label a");

copyMe.forEach((c) => {
  c.addEventListener("click", ({ target }) => {
    if (target.tagName === "A") {
      const url = window.location.href.split("#")[0];
      navigator.clipboard.writeText(`${url}${target.hash}`);
    }
  });
});
