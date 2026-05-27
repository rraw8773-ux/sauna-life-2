/*
 * Назначение файла: Логика фиксированного (sticky) заголовка
 */

export const initStickyHeader = () => {
  const header = document.querySelector(".header");

  if (!header) return;

  const topBar = document.querySelector(".header__top");
  const middleBar = document.querySelector(".header__middle");

  const onScroll = () => {
    const threshold = topBar ? topBar.offsetHeight : 0;
    if (window.scrollY >= threshold) {
      header.classList.add("is-sticky");
      middleBar.classList.add("header__middle--sticky");
    } else {
      header.classList.remove("is-sticky");
      middleBar.classList.remove("header__middle--sticky");
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
};
