/*
 * Назначение файла: Логика "липкого" сайдбара, который может быть больше высоты экрана
 */

export function initStickySidebar() {
  const sidebar = document.getElementById("filters-sidebar");
  if (!sidebar) return;

  const HEADER_OFFSET = 100; // Отступ от верхнего края (с учетом липкой шапки)
  const BOTTOM_OFFSET = 24; // Отступ от нижнего края экрана

  let lastScrollY = window.scrollY;
  // Начинаем с предположения, что мы в самом верху.
  // Если мы загрузили страницу уже прокрученной, updateSticky скорректирует позицию.
  let topOffset = HEADER_OFFSET;

  // Применяем необходимые стили. alignSelf: start критичен для работы sticky в сетке (иначе растянется на всю высоту).
  sidebar.style.alignSelf = "start";
  sidebar.style.willChange = "top";

  function updateSticky() {
    // На мобильных и планшетах (где сайдбар в offcanvas) отключаем логику
    if (window.innerWidth < 768) {
      sidebar.style.position = "";
      sidebar.style.top = "";
      return;
    }

    const currentScrollY = window.scrollY;
    // Определяем разницу в прокрутке
    const deltaY = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    sidebar.style.position = "sticky";

    // Получаем реальную высоту сайдбара
    const sidebarHeight = sidebar.offsetHeight;
    const windowHeight = window.innerHeight;

    // Если сайдбар помещается в экран, просто приклеиваем его к верху экрана
    if (sidebarHeight <= windowHeight - HEADER_OFFSET - BOTTOM_OFFSET) {
      topOffset = HEADER_OFFSET;
      sidebar.style.top = `${topOffset}px`;
      return;
    }

    // Если сайдбар больше высоты экрана, вычисляем его поведение
    const minTop = windowHeight - sidebarHeight - BOTTOM_OFFSET;

    if (deltaY > 0) {
      // Скролл вниз - позволяем сайдбару уезжать вверх до тех пор, пока его низ не покажется на экране
      topOffset = Math.max(minTop, topOffset - deltaY);
    } else if (deltaY < 0) {
      // Скролл вверх - позволяем сайдбару возвращаться вниз до тех пор, пока его верх не упрется в HEADER_OFFSET
      topOffset = Math.min(HEADER_OFFSET, topOffset - deltaY);
    }

    sidebar.style.top = `${topOffset}px`;
  }

  // Инициализация при загрузке: корректируем topOffset по фактическому положению на экране
  function initPosition() {
    if (window.innerWidth >= 768) {
      const rect = sidebar.getBoundingClientRect();
      const sidebarHeight = sidebar.offsetHeight;
      const windowHeight = window.innerHeight;
      const minTop = windowHeight - sidebarHeight - BOTTOM_OFFSET;

      // Если верх сайдбара уже выше HEADER_OFFSET, значит мы где-то в середине
      topOffset = Math.max(minTop, Math.min(HEADER_OFFSET, rect.top));
      sidebar.style.position = "sticky";
      sidebar.style.top = `${topOffset}px`;
    }
  }

  initPosition();

  // Используем passive: true для производительности
  window.addEventListener("scroll", updateSticky, { passive: true });
  window.addEventListener(
    "resize",
    () => {
      initPosition();
      updateSticky();
    },
    { passive: true },
  );
}
