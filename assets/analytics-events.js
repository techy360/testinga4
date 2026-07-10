const DEBUG_ANALYTICS = true;
const CURRENCY = 'AUD';
const DEFAULT_ITEM_LIST_NAME = 'Demo Product Listing';

window.dataLayer = window.dataLayer || [];

function getPageName() {
    return document.body?.dataset?.pageName || 'unknown';
}

function getDefaultItem() {
    return {
        item_id: 'SKU-001',
        item_name: 'Analytics T-Shirt',
        price: 49.99,
        quantity: 1
    };
}

function getDefaultItems() {
    return [getDefaultItem()];
}

function getDefaultValue(items) {
    return items.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 1)), 0);
}

function getItemFromElement(element) {
    if (!element) {
        return null;
    }

    const itemId = element.dataset.itemId;
    if (!itemId) {
        return null;
    }

    return {
        item_id: itemId,
        item_name: element.dataset.itemName || 'Unknown Item',
        price: Number(element.dataset.price || 0),
        quantity: Number(element.dataset.quantity || 1)
    };
}

function pushDataLayerEvent(eventName, params) {
    const payload = {
        event: eventName,
        page_name: getPageName(),
        ...params
    };

    window.dataLayer.push(payload);

    if (DEBUG_ANALYTICS) {
        console.log(`[GA4] ${eventName}`);
        console.log(payload);
    }
}

// Fires on every page load to track page context.
function setupPageViewEvent() {
    pushDataLayerEvent('page_view_custom', {
        page_title: document.title,
        page_name: getPageName()
    });
}

// GA4 view_item_list on Product List page load.
function setupViewItemListEvent() {
    if (getPageName() !== 'product_list') {
        return;
    }

    const productLinks = document.querySelectorAll('[data-track-click][data-item-id]');
    const items = Array.from(productLinks)
        .map((link) => getItemFromElement(link))
        .filter(Boolean);

    if (!items.length) {
        return;
    }

    pushDataLayerEvent('view_item_list', {
        ecommerce: {
            currency: CURRENCY,
            item_list_name: DEFAULT_ITEM_LIST_NAME,
            items
        }
    });
}

// GA4 view_item on Product Detail page load.
function setupViewItemEvent() {
    if (getPageName() !== 'product_detail') {
        return;
    }

    const item = getItemFromElement(document.querySelector('[data-add-to-cart]')) || getDefaultItem();

    pushDataLayerEvent('view_item', {
        ecommerce: {
            currency: CURRENCY,
            value: Number(item.price),
            items: [item]
        }
    });
}

// GA4 add_to_cart when Add to Cart is clicked.
function setupAddToCartEvent() {
    const addToCartButton = document.querySelector('[data-add-to-cart]');
    if (!addToCartButton) {
        return;
    }

    addToCartButton.addEventListener('click', () => {
        const item = getItemFromElement(addToCartButton) || getDefaultItem();

        pushDataLayerEvent('add_to_cart', {
            currency: CURRENCY,
            value: Number(item.price),
            items: [item]
        });
    });
}

// GA4 view_cart on Cart page load.
function setupViewCartEvent() {
    if (getPageName() !== 'cart') {
        return;
    }

    const items = getDefaultItems();

    pushDataLayerEvent('view_cart', {
        currency: CURRENCY,
        value: getDefaultValue(items),
        items
    });
}

// GA4 begin_checkout on Checkout page load.
function setupBeginCheckoutEvent() {
    if (getPageName() !== 'checkout') {
        return;
    }

    const items = getDefaultItems();

    pushDataLayerEvent('begin_checkout', {
        currency: CURRENCY,
        value: getDefaultValue(items),
        coupon: '',
        items
    });
}

// GA4 add_shipping_info on shipping selection / continue interaction.
function setupAddShippingInfoEvent() {
    if (getPageName() !== 'checkout') {
        return;
    }

    const items = getDefaultItems();
    const emit = (shippingTier) => {
        pushDataLayerEvent('add_shipping_info', {
            shipping_tier: shippingTier || 'Standard',
            currency: CURRENCY,
            value: getDefaultValue(items),
            items
        });
    };

    const shippingOptions = document.querySelectorAll('[name="shipping_tier"], [data-shipping-tier]');
    shippingOptions.forEach((option) => {
        option.addEventListener('change', () => {
            emit(option.value || option.dataset.shippingTier || 'Standard');
        });
    });

    const continueButton = document.querySelector('[data-complete-purchase], [data-continue], [data-add-shipping-info]');
    if (continueButton) {
        continueButton.addEventListener('click', () => {
            emit(continueButton.dataset.shippingTier || 'Standard');
        });
    }
}

// GA4 purchase on Thank You page load.
function setupPurchaseEvent() {
    if (getPageName() !== 'thank_you') {
        return;
    }

    const items = getDefaultItems();
    const value = getDefaultValue(items);

    pushDataLayerEvent('purchase', {
        transaction_id: `ORDER-${Date.now()}`,
        currency: CURRENCY,
        value,
        tax: 0,
        shipping: 0,
        coupon: '',
        items
    });
}

// GA4 select_item on product click in PLP.
function setupSelectItemEvent() {
    if (getPageName() !== 'product_list') {
        return;
    }

    const productLinks = document.querySelectorAll('[data-track-click][data-event-name="select_item"]');
    productLinks.forEach((link) => {
        link.addEventListener('click', () => {
            const item = getItemFromElement(link);
            if (!item) {
                return;
            }

            pushDataLayerEvent('select_item', {
                item_list_name: link.dataset.itemListName || DEFAULT_ITEM_LIST_NAME,
                items: [item]
            });
        });
    });
}

// Generic custom click tracking for non-ecommerce custom events.
function setupClickTracking() {
    const trackableElements = document.querySelectorAll('[data-track-click]');

    trackableElements.forEach((element) => {
        element.addEventListener('click', () => {
            const eventName = element.dataset.eventName || 'custom_click';
            if (eventName === 'select_item' || eventName === 'add_to_cart') {
                return;
            }

            pushDataLayerEvent(eventName, {
                event_category: element.dataset.eventCategory || 'interaction',
                event_label: element.dataset.eventLabel || element.textContent.trim()
            });
        });
    });
}

function initializeAnalytics() {
    setupPageViewEvent();
    setupViewItemListEvent();
    setupViewItemEvent();
    setupViewCartEvent();
    setupBeginCheckoutEvent();
    setupPurchaseEvent();
    setupSelectItemEvent();
    setupAddToCartEvent();
    setupAddShippingInfoEvent();
    setupClickTracking();
}

document.addEventListener('DOMContentLoaded', initializeAnalytics);
