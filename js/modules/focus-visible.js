/*
 * Назначение: Полифил для :focus-visible.
 * Позволяет разделять фокус клавиатуры от фокуса мыши/тача, добавляя класс .focus-visible на сфокусированный элемент.
 */

export function initFocusVisible() {
  let hadKeyboardEvent = true;

  // Клавиши-модификаторы, которые сами по себе не должны включать клавиатурную модальность
  const modifierKeys = {
    Alt: true,
    Control: true,
    Meta: true,
    Shift: true,
  };

  // Элементы, которые по своей природе требуют ввода текста и всегда получают кольцо фокуса
  function isTextControl(el) {
    const tagName = el.tagName;
    const type = el.type;

    if (
      tagName === "INPUT" &&
      !["button", "submit", "reset", "checkbox", "radio", "file", "color", "image", "range", "hidden"].includes(type)
    ) {
      return true;
    }
    if (tagName === "TEXTAREA") {
      return true;
    }
    if (el.hasAttribute("contenteditable") || el.getAttribute("contenteditable") === "true") {
      return true;
    }
    return false;
  }

  // Признак клавиатурного ввода
  function onKeyDown(e) {
    if (e.metaKey || e.altKey || e.ctrlKey) {
      return;
    }
    if (!modifierKeys[e.key]) {
      hadKeyboardEvent = true;
    }
  }

  // Признак клика мыши/тача
  function onPointerDown(e) {
    hadKeyboardEvent = false;
  }

  // Обработка фокуса (перехват/capturing для поддержки динамических элементов)
  function onFocus(e) {
    const el = e.target;
    if (el === document || el === window || !el.classList) {
      return;
    }

    if (hadKeyboardEvent || isTextControl(el)) {
      el.classList.add("focus-visible");
      el.setAttribute("data-focus-visible-added", "");
    }
  }

  // Обработка потери фокуса (перехват/capturing)
  function onBlur(e) {
    const el = e.target;
    if (el === document || el === window || !el.classList) {
      return;
    }

    if (el.classList.contains("focus-visible")) {
      el.classList.remove("focus-visible");
      el.removeAttribute("data-focus-visible-added");
    }
  }

  // Добавляем маркер работы полифила на корневой элемент html
  document.documentElement.classList.add("js-focus-visible");

  // Вешаем обработчики на фазу перехвата (true) для максимальной надежности
  document.addEventListener("keydown", onKeyDown, true);
  document.addEventListener("mousedown", onPointerDown, true);
  if (window.PointerEvent) {
    document.addEventListener("pointerdown", onPointerDown, true);
  }
  document.addEventListener("touchstart", onPointerDown, true);

  document.addEventListener("focus", onFocus, true);
  document.addEventListener("blur", onBlur, true);
}

// Автоинициализация при загрузке модуля
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFocusVisible);
} else {
  initFocusVisible();
}
