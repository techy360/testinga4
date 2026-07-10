# Analytics Learning Demo Site

This project is a multi-page static website for practicing:

- Google Tag Manager (GTM)
- Google Analytics 4 (GA4)
- Custom `dataLayer` events on each page

## Pages included

- `index.html` → Home
- `product-list.html` → Product List Page (PLP)
- `product-detail.html` → Product Detail Page (PDP)
- `cart.html` → Cart
- `checkout.html` → Checkout
- `thank-you.html` → Purchase confirmation

All pages are linked through top navigation and action buttons so you can move through an ecommerce-style funnel.

## Event practice ideas

- `page_view_custom`
- `view_item_list`
- `select_item`
- `view_item`
- `add_to_cart`
- `view_cart`
- `begin_checkout`
- `add_shipping_info`
- `purchase`

## How to test

1. Open `index.html` in a browser.
2. Navigate through all pages using links and buttons.
3. Open browser DevTools Console.
4. Look for logs starting with `dataLayer push:`.
5. In GTM Preview mode, verify triggers/tags for each event.

## Shared files

- `assets/styles.css` for simple UI styles.
- `assets/analytics-events.js` for reusable click and ecommerce event pushes.
