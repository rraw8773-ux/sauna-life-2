# Catalog Slick Migration Backlog

## Status

- `completed` Inspect current gallery implementation and seed migration state
- `completed` Rewrite catalog gallery module from old slider API to SlickSlider
- `completed` Replace catalog card gallery markup in `new-catalog.html`
- `completed` Update product card and catalog CSS for Slick dots, zoom, and `3 / 4` image frame
- `completed` Update module entrypoints and AJAX re-init flow for appended products
- `completed` Make product-card initialization safe for repeated partial re-runs
- `completed` Update component documentation in `documentation/`
- `completed` Verify no remaining active references to removed gallery library in current project files
- `pending` Manual browser verification by user

## Notes

- Working plan source: `migration/catalog-slick-migration-plan.md`
- User requested no browser launch and no automated screenshots
- User will perform manual visual verification
- Backlog must stay current enough that another model can resume implementation
- Active gallery contract now uses `.product-card__slider.js-product-card-slider`
- AJAX append now dispatches `catalog:products-appended`
- `initProductCards(root)` is now idempotent for partial re-runs
- No automated browser verification was executed in this run
- `new-catalog.html` was restored from `new-catalog-old.html` after mojibake corruption, then Slick changes were re-applied
- Zoom no longer relies on `overflow: visible`; it is bounded inside `.product-card__image-frame` and resets on frame leave, slider leave, `Escape`, and slide change

## Resume Checklist

- Open `migration/catalog-slick-migration-plan.md` for the original implementation plan
- Use `migration/catalog-slick-migration-backlog.md` as the authoritative handoff status
- Check `js/modules/sliders.js`
- Check `js/modules/product-card.js`
- Check `js/main.js`
- Check `css/modules/product-card.css`
- Check `css/pages/catalog.css`
- Check `new-catalog.html`
- Check `documentation/product-card.md`
- If manual QA finds layout drift in list view, adjust `css/pages/catalog.css` around `.catalog__grid--list .product-card`
- If manual QA still finds zoom issues, inspect `js/modules/sliders.js` and `css/modules/product-card.css` together before changing only CSS
