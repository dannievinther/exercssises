const options = {
  threshold: [0.1, 0.5, 0.9],
  rootMargin: `${-window.innerHeight / 3}px 0px ${
    -window.innerHeight / 3
  }px 0px`,
};

function callback(entries, observer) {
  entries.forEach((entry, i) => {
    const { target, intersectionRatio, boundingClientRect, isIntersecting } =
      entry;
    if (isIntersecting) {
      target.classList.add("in-view");
    } else if (intersectionRatio <= 0.1) {
      target.classList.remove("in-view");
    }
  });
}

const observer = new IntersectionObserver(callback, options);

const sections = document.querySelectorAll("section");

sections.forEach((section) => {
  observer.observe(section);
});
