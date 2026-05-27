/*
 * Назначение файла: Модуль высокотехнологичного таймера обратного отсчета для промо-блока (Promo Block Countdown Timer)
 * Поддерживает гибкую настройку через data-атрибуты (например, data-countdown="2026-05-30T18:00:00").
 * Если атрибут пуст или отсутствует, автоматически задается отсчет до конца текущего дня для создания маркетингового эффекта срочности.
 */

export function initPromoTimer(root = document) {
  const timers = root.querySelectorAll(".promo-block__timer, .js-promo-timer");

  timers.forEach((timer) => {
    // Предотвращаем повторную инициализацию
    if (timer.classList.contains("is-initialized")) return;
    timer.classList.add("is-initialized");

    let countdownTarget = timer.getAttribute("data-countdown");

    // Если дата не задана, создаем отсчет до конца текущего дня (эффект срочности)
    if (!countdownTarget) {
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
      countdownTarget = endOfToday.toISOString();
      timer.setAttribute("data-countdown", countdownTarget);
    }

    const targetDate = new Date(countdownTarget).getTime();

    // Проверяем валидность полученной даты
    if (isNaN(targetDate)) {
      console.warn("Невалидная дата для таймера в формате ISO/UTC:", countdownTarget);
      return;
    }

    // Собираем ссылки на элементы для обновления
    const daysContainer = timer.querySelector("[data-days-container]");
    const daysDivider = timer.querySelector("[data-days-divider]");
    const daysVal = timer.querySelector("[data-days]");
    const hoursVal = timer.querySelector("[data-hours]");
    const minutesVal = timer.querySelector("[data-minutes]");
    const secondsVal = timer.querySelector("[data-seconds]");

    let timerInterval;

    function updateCountdown() {
      const now = new Date().getTime();
      const difference = targetDate - now;

      // Если акция завершилась
      if (difference <= 0) {
        clearInterval(timerInterval);
        if (daysContainer) daysContainer.style.display = "none";
        if (daysDivider) daysDivider.style.display = "none";
        if (hoursVal) hoursVal.textContent = "00";
        if (minutesVal) minutesVal.textContent = "00";
        if (secondsVal) secondsVal.textContent = "00";
        
        // Меняем лейбл на "Акция завершена"
        const label = timer.querySelector(".promo-timer__label");
        if (label) {
          label.textContent = "Акция завершена";
          label.style.color = "var(--color-gray)";
        }
        timer.classList.add("promo-timer--expired");
        return;
      }

      // Вычисляем показатели времени
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Логика отображения дней (показываем только если дней больше 0)
      if (days > 0) {
        if (daysContainer) daysContainer.style.display = "flex";
        if (daysDivider) daysDivider.style.display = "flex";
        if (daysVal) daysVal.textContent = String(days).padStart(2, "0");
      } else {
        if (daysContainer) daysContainer.style.display = "none";
        if (daysDivider) daysDivider.style.display = "none";
      }

      // Форматируем с ведущими нулями
      if (hoursVal) hoursVal.textContent = String(hours).padStart(2, "0");
      if (minutesVal) minutesVal.textContent = String(minutes).padStart(2, "0");
      if (secondsVal) secondsVal.textContent = String(seconds).padStart(2, "0");
    }

    // Первичный запуск без ожидания секунды
    updateCountdown();
    timerInterval = setInterval(updateCountdown, 1000);

    // Сохраняем интервал в элементе, чтобы можно было очистить при удалении из DOM
    timer._timerInterval = timerInterval;
  });
}
