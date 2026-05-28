/*
 * Назначение: Универсальный модуль переключения табов (Tabs component logic)
 * Поддерживает новые BEM-классы (.product-tabs) и старые (.sl-tabs),
 * а также автоматически активирует первую вкладку на странице при ее загрузке.
 */

export function initTabs() {
  const tabsContainers = document.querySelectorAll(".product-tabs, .widget-tabs");

  tabsContainers.forEach((container) => {
    const triggers = container.querySelectorAll("[data-tab-trigger]");
    const panels = container.querySelectorAll("[data-tab-panel], [data-tab-pane]");

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = trigger.getAttribute("data-tab-trigger");

        triggers.forEach((t) => {
          t.classList.remove("product-tabs__trigger--active");
          t.classList.remove("widget-tabs__trigger--active");
          t.classList.remove("product-tab--active");
          t.classList.remove("btn-tab--active");
        });

        panels.forEach((p) => {
          p.classList.remove("product-tabs__panel--active");
          p.classList.remove("widget-tabs__pane--active");
          p.classList.remove("product-tab-pane--active");
        });

        // 3. Активируем текущую кнопку
        trigger.classList.add("product-tabs__trigger--active");
        trigger.classList.add("widget-tabs__trigger--active");
        
        // Дополнительная legacy-совместимость
        if (trigger.classList.contains("product-tab")) {
          trigger.classList.add("product-tab--active");
        }
        if (trigger.classList.contains("btn-tab")) {
          trigger.classList.add("btn-tab--active");
        }

        // 4. Активируем целевую панель (если она есть)
        if (targetId) {
          const targetPanel = container.querySelector(
            `[data-tab-panel="${targetId}"], [data-tab-pane="${targetId}"]`
          );
          if (targetPanel) {
            targetPanel.classList.add("product-tabs__panel--active");
            targetPanel.classList.add("widget-tabs__pane--active");
            targetPanel.classList.add("product-tab-pane--active");
          } else {
            // Резервный поиск по ID для совместимости с внешними элементами
            const legacyPane = document.getElementById("tab-" + targetId);
            if (legacyPane) {
              legacyPane.classList.add("product-tabs__panel--active");
              legacyPane.classList.add("product-tab-pane--active");
            }
          }
        }

        // 5. Автоматическая плавная прокрутка табов на мобильных устройствах
        const wrapper = trigger.closest(
          ".product-tabs__nav-wrapper, .widget-tabs__nav-wrapper, .sl-tabs__nav-wrapper"
        );
        if (wrapper) {
          requestAnimationFrame(() => {
            const nav = trigger.parentElement;
            if (!nav) return;
            const wrapperRect = wrapper.getBoundingClientRect();
            const triggerRect = trigger.getBoundingClientRect();
            
            // Вычисляем положение триггера относительно прокручиваемого контейнера
            const relativeLeft = triggerRect.left - wrapperRect.left + wrapper.scrollLeft;
            
            // Получаем динамический отступ (padding-left) для красивого выравнивания
            const offset = parseFloat(window.getComputedStyle(nav).paddingLeft) || 20;
            
            wrapper.scrollTo({
              left: relativeLeft - offset,
              behavior: "smooth"
            });
          });
        }
      });
    });

    // Автоматическая инициализация вкладки по умолчанию при загрузке:
    // Если на странице нет ни одной активной вкладки, активируем первую.
    let hasActive = false;
    triggers.forEach((t) => {
      if (
        t.classList.contains("product-tabs__trigger--active") ||
        t.classList.contains("widget-tabs__trigger--active") ||
        t.classList.contains("product-tab--active")
      ) {
        hasActive = true;
      }
    });

    if (!hasActive && triggers.length > 0) {
      // Активируем первый триггер (например, "Описание") программно
      triggers[0].dispatchEvent(new Event("click"));
    }
  });
}
