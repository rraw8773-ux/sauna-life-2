/*
 * Назначение файла: Логика "липкого" сайдбара (Catalog page specific)
 */

export function initStickySidebar() {
  const sidebar = document.getElementById("filters-sidebar");
  if (!sidebar) return;

  const HEADER_OFFSET = 100; // Отступ от верхнего края (с учетом липкой шапки)
  const BOTTOM_OFFSET = 24; // Отступ от нижнего края экрана

  let lastScrollY = window.scrollY;
  let topOffset = HEADER_OFFSET;

  sidebar.style.alignSelf = "start";
  sidebar.style.willChange = "top";

  function updateSticky() {
    if (window.innerWidth < 768) {
      sidebar.style.position = "";
      sidebar.style.top = "";
      return;
    }

    const currentScrollY = window.scrollY;
    const deltaY = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    sidebar.style.position = "sticky";

    const sidebarHeight = sidebar.offsetHeight;
    const windowHeight = window.innerHeight;

    if (sidebarHeight <= windowHeight - HEADER_OFFSET - BOTTOM_OFFSET) {
      topOffset = HEADER_OFFSET;
      sidebar.style.top = `${topOffset}px`;
      return;
    }

    const minTop = windowHeight - sidebarHeight - BOTTOM_OFFSET;

    if (deltaY > 0) {
      topOffset = Math.max(minTop, topOffset - deltaY);
    } else if (deltaY < 0) {
      topOffset = Math.min(HEADER_OFFSET, topOffset - deltaY);
    }

    sidebar.style.top = `${topOffset}px`;
  }

  function initPosition() {
    if (window.innerWidth >= 768) {
      const rect = sidebar.getBoundingClientRect();
      const sidebarHeight = sidebar.offsetHeight;
      const windowHeight = window.innerHeight;
      const minTop = windowHeight - sidebarHeight - BOTTOM_OFFSET;

      topOffset = Math.max(minTop, Math.min(HEADER_OFFSET, rect.top));
      sidebar.style.position = "sticky";
      sidebar.style.top = `${topOffset}px`;
    }
  }

  initPosition();

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
