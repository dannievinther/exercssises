const sections = document.querySelectorAll("section");
// const classReg = /[^,/*{}\s]+(?![^{]*})/g;
const classReg = /(?!\s)[^,()/*{}]+(?![^{]*})/g;

sections.forEach((section) => {
  const styleTag = section.querySelector(".editor > style");
  const textarea = section.querySelector(".editor > textarea");
  const output = section.querySelector(".output");
  let startingCSS = textarea.innerHTML;
  const exerciseKey = section.dataset.exerciseKey;
  const boxKey = `box-${exerciseKey}`;
  let isExtra = section.dataset.extra;

  const boxContainer = section.querySelector(".container");

  const addBtn = section.querySelector(".plus");
  const removeBtn = section.querySelector(".minus");

  let boxCount = boxContainer.children.length || 1;
  const maxBoxCount = 12;
  const saveLocally = () => localStorage.setItem(boxKey, boxCount);

  const reset = section.querySelector(".reset");
  const confirming = section.querySelector(".button-group-confirm");
  const resetBtns = section.querySelector(".reset-buttons");

  output.addEventListener("dblclick", (_) => {
    output.hasAttribute("style") && output.removeAttribute("style");
  });

  function createBox(count) {
    const box = document.createElement("div");
    box.classList.add("box");
    box.classList.add(`box-${count}`);
    box.textContent = `box-${count}`;
    return box;
  }

  function loadLocalStorageBoxes() {
    const localStorageBoxes = localStorage.getItem(boxKey);

    if (localStorageBoxes && localStorageBoxes !== boxCount) {
      localStorageBoxes == 1 && localStorage.removeItem(boxKey);
      boxCount = localStorageBoxes;
      const newBoxes = Array.from({ length: boxCount }, (_, index) =>
        createBox(index + 1)
      );
      boxContainer.replaceChildren(...newBoxes);
      updateButtonState();
    }
  }

  function addBox() {
    if (boxCount == maxBoxCount) return;
    const count = boxContainer.children.length;
    const newBox = createBox(count + 1);
    boxContainer.appendChild(newBox);

    boxCount++;
  }

  function removeBox() {
    if (boxCount == 1) return;

    const lastBox = boxContainer.lastElementChild;
    lastBox && boxContainer.removeChild(lastBox);

    boxCount--;
  }

  function modifyBoxes(action) {
    action();
    saveLocally();
    updateButtonState();
  }

  addBtn?.addEventListener("click", () => modifyBoxes(addBox));
  removeBtn?.addEventListener("click", () => modifyBoxes(removeBox));

  function setButtonDisabledState(button, isDisabled) {
    if (!button) return;
    button.disabled = isDisabled;
  }

  function updateButtonState() {
    setButtonDisabledState(removeBtn, boxCount == 1);
    setButtonDisabledState(addBtn, boxCount >= maxBoxCount);
  }

  const init = () => {
    if (boxCount > maxBoxCount) {
      boxCount = maxBoxCount;
      const newBoxes = Array.from({ length: maxBoxCount }, (_, index) =>
        createBox(index + 1)
      );
      boxContainer.replaceChildren(...newBoxes);
    }
    loadLocalStorageBoxes();
    updateButtonState();

    styleTag.innerHTML = prefix(textarea.value);

    if (localStorage.getItem(exerciseKey)) {
      textarea.value = localStorage.getItem(exerciseKey);
      styleTag.innerHTML = prefix(textarea.value);
    }

    if (localStorage.getItem(`extra-${exerciseKey}`)) {
      document.documentElement.dataset.extra = "true";
    }

    if (textarea.value !== startingCSS) {
      reset.disabled = false;
    } else {
      reset.disabled = true;
    }

    textarea.addEventListener("input", (e) => {
      styleTag.innerHTML = prefix(e.target.value);
      localStorage.setItem(exerciseKey, textarea.value);

      if (isExtra) {
        localStorage.setItem(`extra-${exerciseKey}`, true);
      }

      if (textarea.value === "") {
        localStorage.removeItem(exerciseKey);
        localStorage.removeItem(`extra-${exerciseKey}`);
      }

      if (textarea.value !== startingCSS) {
        reset.disabled = false;
      } else {
        reset.disabled = true;
      }
    });
  };

  init();

  function prefix(str) {
    return str.replaceAll(
      classReg,
      (match) => `[data-exercise-key="${exerciseKey}"] .output ${match}`
    );
  }

  reset.addEventListener("click", (e) => {
    if (textarea.value === "") {
      resetUI();
    } else {
      reset.setAttribute("inert", "");
      resetBtns.classList.add("active");
      confirming.querySelector(":scope > :first-child").focus();
    }
  });

  confirming.addEventListener("click", ({ target }) => {
    let option = target.dataset.accept;
    if (option === "true") resetUI();
    resetBtns.classList.remove("active");
    reset.removeAttribute("inert");
  });

  function resetUI() {
    if (localStorage.getItem(exerciseKey) || textarea.value === "") {
      localStorage.removeItem(exerciseKey);
      if (localStorage.getItem(`extra-${exerciseKey}`)) {
        localStorage.removeItem(`extra-${exerciseKey}`);
      }
      if (localStorage.getItem(boxKey)) {
        localStorage.removeItem(boxKey);
        boxCount = boxContainer.children.length;
      }
      styleTag.innerHTML = null;
      textarea.value = startingCSS;
      textarea.focus(); /* ensure that the UI updates */
      reset.disabled = true;
      output.getAttribute("style") && output.removeAttribute("style");
      init();
    } else {
      reset.disabled = false;
    }
  }
});

// const keySequence = [];
// let konamiString = "";
// const konamiCode = [
//   "ArrowUp",
//   "ArrowUp",
//   "ArrowDown",
//   "ArrowDown",
//   "ArrowLeft",
//   "ArrowRight",
//   "ArrowLeft",
//   "ArrowRight",
//   "b",
//   "a",
// ];

// document.addEventListener("keyup", function (e) {
//   keySequence.push(e.key);
//   keySequence.splice(
//     -konamiCode.length - 1,
//     keySequence.length - konamiCode.length
//   );
//   konamiString = konamiCode.join("");

//   if (
//     keySequence.join("").includes(konamiString) &&
//     !document.documentElement.dataset.extra
//   ) {
//     document.documentElement.dataset.extra = "true";

//     document
//       .querySelectorAll("section[data-extra='true']")[0]
//       .scrollIntoView({ behavior: "smooth" });
//   }
// });
