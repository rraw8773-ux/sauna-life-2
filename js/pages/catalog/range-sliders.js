/*
 * Назначение файла: Логика фильтров (Range Sliders) (Catalog page specific)
 */

const slidersConfig = [
  {
    id: "price-slider",
    minId: "price-min",
    maxId: "price-max",
    start: [0, 350000],
    min: 0,
    max: 350000,
    step: 100,
  },
  {
    id: "volume-slider",
    minId: "volume-min",
    maxId: "volume-max",
    start: [0, 83],
    min: 0,
    max: 200,
    step: 1,
  },
  {
    id: "filter-power-slider",
    minId: "filter-power-min",
    maxId: "filter-power-max",
    start: [2, 72],
    min: 0,
    max: 100,
    step: 1,
  },
];

export function initRangeSliders() {
  if (typeof noUiSlider === "undefined") return;

  slidersConfig.forEach((config) => {
    const slider = document.getElementById(config.id);
    const minInput = document.getElementById(config.minId);
    const maxInput = document.getElementById(config.maxId);

    if (slider && minInput && maxInput) {
      noUiSlider.create(slider, {
        start: config.start,
        connect: true,
        range: {
          min: config.min,
          max: config.max,
        },
        step: config.step,
        format: {
          to: function (value) {
            return Math.round(value);
          },
          from: function (value) {
            return Number(value);
          },
        },
      });

      slider.noUiSlider.on("update", function (values, handle) {
        if (handle) {
          maxInput.value = values[handle];
        } else {
          minInput.value = values[handle];
        }
      });

      minInput.addEventListener("change", function () {
        slider.noUiSlider.set([this.value, null]);
      });

      maxInput.addEventListener("change", function () {
        slider.noUiSlider.set([null, this.value]);
      });
    }
  });
}
