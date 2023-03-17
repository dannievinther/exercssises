import { prefix } from "./utils";

const sections = document.querySelectorAll("section");

sections.forEach((section) => {
  const styleTag = section.querySelector(".editor > style");
  const textarea = section.querySelector(".editor > textarea");
  const output = section.querySelector(".output");
  let startingCSS = textarea.textContent;
  const exerciseKey = section.dataset.exerciseKey;
  const boxKey = `box-${exerciseKey}`;
  const isExtra = section.dataset.extra;

  const boxContainer = section.querySelector(".container");

  const btnControlsContainer = section.querySelector(".controls");
  const addBtn = section.querySelector(".plus");
  const removeBtn = section.querySelector(".minus");

  let boxCount = boxContainer.children.length || 1;
  const maxBoxCount = 12;
  const saveToLocalStorage = (key, value) => localStorage.setItem(key, value);

  const reset = section.querySelector(".reset");
  const confirming = section.querySelector(".button-group-confirm");
  const resetBtns = section.querySelector(".reset-buttons");

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
    saveToLocalStorage(boxKey, boxCount);
    updateButtonState();
  }

  btnControlsContainer?.addEventListener("click", (event) => {
    const { target } = event;

    if (target.classList.contains("plus")) {
      modifyBoxes(addBox);
    } else if (target.classList.contains("minus")) {
      modifyBoxes(removeBox);
    }
  });

  function setButtonDisabledState(button, isDisabled) {
    if (!button) return;
    button.disabled = isDisabled;
  }

  function updateButtonState() {
    setButtonDisabledState(removeBtn, boxCount == 1);
    setButtonDisabledState(addBtn, boxCount >= maxBoxCount);
  }

  function updateResetButtonState() {
    reset.disabled = textarea.value === startingCSS;
  }

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

  function init() {
    if (boxCount > maxBoxCount) {
      boxCount = maxBoxCount;
      const newBoxes = Array.from({ length: maxBoxCount }, (_, index) =>
        createBox(index + 1)
      );
      boxContainer.replaceChildren(...newBoxes);
    }
    loadLocalStorageBoxes();
    updateButtonState();

    styleTag.innerHTML = prefix(textarea.value, exerciseKey);

    if (localStorage.getItem(exerciseKey)) {
      textarea.value = localStorage.getItem(exerciseKey);
      styleTag.innerHTML = prefix(textarea.value, exerciseKey);
    }

    if (localStorage.getItem(`extra-${exerciseKey}`)) {
      document.documentElement.dataset.extra = "true";
    }

    updateResetButtonState();

    textarea.addEventListener("input", (e) => {
      styleTag.innerHTML = prefix(e.target.value, exerciseKey);
      saveToLocalStorage(exerciseKey, textarea.value);

      if (isExtra) {
        saveToLocalStorage(`extra-${exerciseKey}`, true);
      }

      if (textarea.value === "") {
        localStorage.removeItem(exerciseKey);
        localStorage.removeItem(`extra-${exerciseKey}`);
      }

      updateResetButtonState();
    });
  }

  init();

  output.addEventListener("dblclick", (_) => {
    output.hasAttribute("style") && output.removeAttribute("style");
  });

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
    target.blur();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const resetBtnGroup = section.querySelectorAll(
        ".button-group-confirm button"
      );
      const focusedElement = document.activeElement;

      if (focusedElement === textarea) {
        const closestSection = focusedElement.closest("section");
        const resetButton = closestSection.querySelector(".reset");
        const btnGroup = closestSection.querySelectorAll(
          ".button-group-confirm button"
        );
        if (!resetButton.disabled) {
          resetButton.focus();
        }
        if (resetButton.inert) {
          btnGroup[0].focus();
        }
      }
      if (
        focusedElement === reset ||
        focusedElement === resetBtnGroup[0] ||
        focusedElement === resetBtnGroup[1]
      ) {
        const closestSection = focusedElement.closest("section");
        const textarea = closestSection.querySelector("textarea");
        textarea.focus();
      }
    }
  });
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
