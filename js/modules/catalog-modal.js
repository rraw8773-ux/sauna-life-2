/*
 * Назначение файла: Логика модального окна каталога
 * Открытие/закрытие по кнопке «Каталог», смена иконки, Escape,
 * переключение панелей при наведении на категорию
 */

export function initCatalogModal() {
  const btn = document.getElementById("catalog-btn");
  const modal = document.getElementById("catalog-modal");
  if (!btn || !modal) return;

  const btnIcon = btn.querySelector(".button__icon");
  const iconOpen = "./!FILES/NEW-HTML/assets/icons/header/hamburger.svg";
  const iconClose = "./!FILES/NEW-HTML/assets/icons/interfaces/close-light.svg";

  const categoryLinks = modal.querySelectorAll(".catalog-modal__category-link");
  const panels = modal.querySelectorAll(".catalog-modal__panel");

  // --- Toggle modal ---
  function openModal() {
    modal.classList.add("is-open");
    btn.classList.add("is-active");
    document.body.classList.add("catalog-modal-open");
    if (btnIcon) btnIcon.src = iconClose;
  }

  function closeModal() {
    modal.classList.remove("is-open");
    btn.classList.remove("is-active");
    document.body.classList.remove("catalog-modal-open");
    if (btnIcon) btnIcon.src = iconOpen;
  }

  function toggleModal() {
    if (modal.classList.contains("is-open")) {
      closeModal();
    } else {
      openModal();
    }
  }

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleModal();
  });

  // --- Close on Escape ---
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  // --- Close on Outside Click ---
  document.addEventListener("click", (e) => {
    if (
      modal.classList.contains("is-open") &&
      !e.target.closest(".catalog-modal__inner") &&
      !e.target.closest("#catalog-btn")
    ) {
      closeModal();
    }
  });

  // --- Category hover → switch panels ---
  function activateCategory(link) {
    const categoryId = link.dataset.category;
    if (!categoryId) return;

    // Deactivate all
    categoryLinks.forEach((l) => l.classList.remove("is-active"));
    panels.forEach((p) => p.classList.remove("is-active"));

    // Activate hovered
    link.classList.add("is-active");
    const targetPanel = modal.querySelector(
      `.catalog-modal__panel[data-panel="${categoryId}"]`,
    );
    if (targetPanel) targetPanel.classList.add("is-active");
  }

  categoryLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      activateCategory(link);
    });

    // Prevent navigation on click (for now)
    link.addEventListener("click", (e) => {
      e.preventDefault();
    });
  });
}
