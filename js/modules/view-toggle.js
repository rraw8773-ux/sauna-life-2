/*
 * Назначение файла: Переключение вида каталога (плитка / список)
 * Сохраняет выбор пользователя в localStorage.
 * Ключ: 'catalogView', значения: 'grid' | 'list', по умолчанию: 'grid'
 */

const STORAGE_KEY = "catalogView";
const DEFAULT_VIEW = "grid";

export function initViewToggle() {
  const toggleWrapper = document.querySelector(".catalog__view-toggle");
  const grid = document.querySelector(".catalog__grid");

  if (!toggleWrapper || !grid) return;

  const buttons = Array.from(toggleWrapper.querySelectorAll(".catalog__view-btn"));
  if (!buttons.length) return;

  // ── Применить вид ──────────────────────────────────────────────────────────
  function applyView(view) {
    // Обновить сетку
    if (view === "list") {
      grid.classList.add("catalog__grid--list");
    } else {
      grid.classList.remove("catalog__grid--list");
    }

    // Обновить активную кнопку
    buttons.forEach((btn) => {
      const isListBtn = btn.classList.contains("catalog__view-btn--list");
      const isGridBtn = btn.classList.contains("catalog__view-btn--grid");
      
      let viewType = isListBtn ? "list" : (isGridBtn ? "grid" : null);
      if (!viewType) return;
      
      const isActive = viewType === view;
      btn.classList.toggle("is-active", isActive);
      btn.classList.toggle("catalog__view-btn--active", isActive);
    });
  }

  // ── Прочитать сохранённое значение ─────────────────────────────────────────
  const savedView = localStorage.getItem(STORAGE_KEY) || DEFAULT_VIEW;
  applyView(savedView);

  // ── Обработчик кликов ──────────────────────────────────────────────────────
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isListBtn = btn.classList.contains("catalog__view-btn--list");
      const isGridBtn = btn.classList.contains("catalog__view-btn--grid");
      
      let view = isListBtn ? "list" : (isGridBtn ? "grid" : null);
      if (!view) return;

      applyView(view);
      localStorage.setItem(STORAGE_KEY, view);
    });
  });
}
