{
  // function observeHeader() {
  //   const el = document.querySelector(".main-header");
  //   if (!el) return;
  //   const observer = new IntersectionObserver(
  //     ([e]) => e.target.classList.toggle("is-pinned", e.intersectionRatio < 1),
  //     { threshold: 1 }
  //   );
  //   observer.observe(el);
  // }
  // observeHeader();

  const copyMe = document.querySelectorAll("h2 a[href]");

  copyMe.forEach((c) => {
    c.addEventListener("click", ({ target }) => {
      const url = window.location.href.split("#")[0];
      if (target.tagName === "A")
        navigator.clipboard.writeText(`${url}${c.hash}`);
    });
  });

  const sections = document.querySelectorAll("section");
  // const outputs = document.querySelectorAll(".output");
  const classReg = /(?!\s)[^,()/*{}]+(?![^{]*})/g;

  // outputs.forEach((output) => {
  //   output.addEventListener("click", ({ target }) => {
  //     target.contentEditable = true;
  //     target.focus();
  //     target.addEventListener(
  //       "mouseout",
  //       ({ target }) => {
  //         target.contentEditable = false;
  //       },
  //       { once: true }
  //     );
  //   });
  // });

  const options = {
    threshold: [0.1, 0.5, 0.9],
    // rootMargin: "-250px 0px -250px 0px",
    rootMargin: `${-window.innerHeight / 3}px 0px ${
      -window.innerHeight / 3
    }px 0px`,
  };

  function callback(entries, observer) {
    entries.forEach((entry, i) => {
      const { target, intersectionRatio, boundingClientRect, isIntersecting } =
        entry;
      if (isIntersecting) {
        // document.documentElement.dataset.section = target.dataset.exerciseKey;
        target.classList.add("in-view");
      } else {
        target.classList.remove("in-view");
      }
    });
  }

  const observer = new IntersectionObserver(callback, options);

  sections.forEach((section) => {
    observer.observe(section);
    const styleTag = section.querySelector(".editor > style");
    const _tA = section.querySelector(".editor > textarea");
    const exerciseKey = section.dataset.exerciseKey;
    const boxKey = `box-${exerciseKey}`;
    let isExtra = section.dataset.extra;
    let boxes = 0;
    let startingCSS = _tA.innerHTML;

    const output = section.querySelector(".output");

    const parent = section.querySelector(".container");
    // const resetBtns = section.querySelectorAll(".reset");
    const reset = section.querySelector(".reset");
    const confirming = section.querySelector(".button-group-confirm");
    const resetBtns = section.querySelector(".reset-buttons");
    const plus = section.querySelector(".plus");
    const minus = section.querySelector(".minus");

    const popup = section.querySelector(".popup");
    const popupSum = popup.querySelector("summary");

    popup.addEventListener("click", dismiss, { once: true });

    function dismiss() {
      document.addEventListener("click", ({ target }) => {
        if (target !== popupSum) {
          popup.open = false;
          return;
        }
      });
    }

    reset.addEventListener("click", (e) => {
      if (_tA.value === "") {
        resetUI();
      } else {
        resetBtns.classList.add("active");
        confirming.querySelector(":scope > :first-child").focus();
      }
    });

    confirming.addEventListener("click", ({ target }) => {
      let option = target.dataset.accept;
      if (option === "true") {
        resetBtns.classList.remove("active");
        resetUI();
      } else {
        resetBtns.classList.remove("active");
      }
    });

    function resetUI() {
      if (localStorage.getItem(exerciseKey) || _tA.value === "") {
        localStorage.removeItem(exerciseKey);
        if (localStorage.getItem(`extra-${exerciseKey}`)) {
          localStorage.removeItem(`extra-${exerciseKey}`);
        }
        if (localStorage.getItem(boxKey)) {
          localStorage.removeItem(boxKey);
          boxes = 0;
        }
        styleTag.innerHTML = null;
        _tA.value = startingCSS;
        _tA.focus(); /* ensure that the UI updates */
        reset.disabled = true;
        output.getAttribute("style") && output.removeAttribute("style");
        init();
      } else {
        reset.disabled = false;
      }
    }

    output.addEventListener("dblclick", (_) => {
      output.getAttribute("style") && output.removeAttribute("style");
    });

    function prefix(str) {
      return str.replaceAll(
        classReg,
        (match) => `[data-exercise-key="${exerciseKey}"] .output ${match}`
      );
    }

    function addButtonListeners() {
      if (!plus && !minus) return;

      if (localStorage.getItem(boxKey)) {
        boxes = localStorage.getItem(boxKey);
        minus.disabled = boxes > 0 ? false : true;
      } else {
        minus.disabled = boxes > 0 ? false : true;
      }

      plus.addEventListener("click", (e) => {
        addBox();

        boxes++;

        minus.disabled = false;

        boxCount();
      });

      minus.addEventListener("click", (e) => {
        removeBox();

        minus.disabled = parent.children.length <= 1 ? true : false;

        if (boxes === 0) return;
        boxes--;

        boxCount();
      });
    }

    addButtonListeners();

    function addBox() {
      const count = parent.children.length;
      const box = document.createElement("div");
      box.className = `box box-${count + 1}`;
      box.textContent = `.box-${count + 1}`;
      // box.setAttribute("contenteditable", true);
      parent.appendChild(box);
    }

    function addClasses() {
      [...parent.children].forEach((b, i) => {
        b.className = `box box-${i + 1}`;
      });
    }

    function removeBox() {
      if (parent.children.length - 1) {
        const last = parent.lastElementChild;
        parent.removeChild(last);
      }
    }

    function boxCount() {
      if (boxes < 0) return;
      localStorage.setItem(boxKey, boxes);
    }

    addClasses();

    const init = () => {
      // const parentClass =
      //   "exercise-" + section.querySelector("article>div").className;
      // const parentDataset = `${i + 1}`;

      // section.dataset.exerciseKey = `${i + 1}`;

      styleTag.innerHTML = prefix(_tA.value);

      if (localStorage.getItem(exerciseKey)) {
        _tA.value = localStorage.getItem(exerciseKey);
        styleTag.innerHTML = prefix(_tA.value);
      }

      if (localStorage.getItem(`extra-${exerciseKey}`)) {
        document.documentElement.dataset.extra = "true";
      }

      if (localStorage.getItem(boxKey)) {
        boxes = localStorage.getItem(boxKey);
        for (let i = 0; i < boxes; i++) {
          addBox(i);
        }
      }

      if (_tA.value !== startingCSS) {
        reset.disabled = false;
      } else {
        reset.disabled = true;
      }

      _tA.addEventListener("input", (e) => {
        styleTag.innerHTML = prefix(e.target.value);
        localStorage.setItem(exerciseKey, _tA.value);

        if (isExtra) {
          localStorage.setItem(`extra-${exerciseKey}`, true);
        }

        if (_tA.value === "") {
          localStorage.removeItem(exerciseKey);
          localStorage.removeItem(`extra-${exerciseKey}`);
        }

        if (_tA.value !== startingCSS) {
          reset.disabled = false;
        } else {
          reset.disabled = true;
        }
      });
    };

    init();
  });

  // const downloadBtn = document.querySelector("#download");

  // downloadBtn.addEventListener("click", (_) => {
  //   const array = [];

  //   let keys = Object.keys(localStorage);
  //   for (let key of keys) {
  //     array.push(`Exercise ${key}:\n${localStorage.getItem(key)}`);
  //   }
  //   const copy = [...array].filter((el) => !el.includes("box")).join("\n\n");
  //   download("exercises.txt", copy);
  // });

  // function download(filename, text) {
  //   const element = document.createElement("a");
  //   element.setAttribute(
  //     "href",
  //     "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  //   );
  //   element.setAttribute("download", filename);

  //   element.style.display = "none";
  //   document.body.appendChild(element);

  //   element.click();

  //   document.body.removeChild(element);
  // }

  const footerBtn = document.querySelector(".dbclick");

  footerBtn.addEventListener("dblclick", (e) => {
    document.documentElement.dataset.extra = "true";
    document
      .querySelectorAll("section[data-extra='true']")[0]
      .scrollIntoView({ behavior: "smooth" });
  });

  const keySequence = [];
  let konamiString = "";
  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];

  document.addEventListener("keyup", function (e) {
    keySequence.push(e.key);
    keySequence.splice(
      -konamiCode.length - 1,
      keySequence.length - konamiCode.length
    );
    konamiString = konamiCode.join("");

    if (
      keySequence.join("").includes(konamiString) &&
      !document.documentElement.dataset.extra
    ) {
      document.documentElement.dataset.extra = "true";

      document
        .querySelectorAll("section[data-extra='true']")[0]
        .scrollIntoView({ behavior: "smooth" });
    }
  });
}
