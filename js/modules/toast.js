/*
 * Назначение: Модуль всплывающих уведомлений (Toast Notifications Module)
 * Предоставляет глобальный класс Toast для вызова премиальных анимированных уведомлений.
 * Полностью автономен, не зависит от сторонних библиотек.
 */

export class Toast {
  static container = null;

  // Пул стандартных иконок в формате SVG для разных типов уведомлений
  static icons = {
    success: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    info: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
    error: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    warning: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    remove: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
  };

  /**
   * Инициализирует контейнер для уведомлений
   */
  static _initContainer() {
    if (this.container) return;

    this.container = document.querySelector(".toast-container");
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.className = "toast-container";
      document.body.appendChild(this.container);
    }
  }

  /**
   * Отображает всплывающее уведомление
   * @param {Object} options - Настройки уведомления
   * @param {string} options.message - Текст уведомления
   * @param {string} [options.type='success'] - Тип уведомления (success, info, warning, error)
   * @param {number} [options.duration=3000] - Время отображения в мс
   */
  static show({ message, type = "success", duration = 3000 }) {
    this._initContainer();

    // Создаем элемент уведомления
    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.setAttribute("role", "alert");

    // Заполняем HTML структуру
    const iconSVG = this.icons[type] || this.icons.success;
    toast.innerHTML = `
      <div class="toast__icon">${iconSVG}</div>
      <div class="toast__content">
        <div class="toast__message">${message}</div>
      </div>
    `;

    // Добавляем в DOM контейнера
    this.container.appendChild(toast);

    // Микропауза перед запуском CSS transition
    requestAnimationFrame(() => {
      toast.classList.add("is-visible");
    });

    // Автоматическое скрытие по таймеру
    let autoHideTimer = setTimeout(() => {
      this.dismiss(toast);
    }, duration);

    // Скрытие по клику в любое место плашки (без кнопки закрытия)
    toast.addEventListener("click", () => {
      clearTimeout(autoHideTimer);
      this.dismiss(toast);
    });
  }

  /**
   * Плавно скрывает и удаляет уведомление
   * @param {HTMLElement} toast - Элемент уведомления
   */
  static dismiss(toast) {
    if (!toast || toast.classList.contains("is-leaving")) return;

    toast.classList.add("is-leaving");
    toast.classList.remove("is-visible");

    // Удаляем элемент после завершения анимации перехода
    const handleTransitionEnd = (e) => {
      if (e.propertyName === "transform" || e.propertyName === "opacity") {
        toast.remove();
        toast.removeEventListener("transitionend", handleTransitionEnd);
      }
    };

    toast.addEventListener("transitionend", handleTransitionEnd);

    // Фолбек-таймер удаления на случай, если transitionend не сработает
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 500);
  }
}
