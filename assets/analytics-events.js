window.dataLayer = window.dataLayer || [];

function pushDataLayerEvent(eventName, params) {
    const payload = {
        event: eventName,
        page_name: document.body.dataset.pageName || 'unknown',
        ...params
    };

    window.dataLayer.push(payload);
    console.log('dataLayer push:', payload);
}

function setupPageViewEvent() {
    const pageName = document.body.dataset.pageName || 'unknown';
    pushDataLayerEvent('page_view_custom', {
        page_title: document.title,
        page_name: pageName
    });
}

function setupClickTracking() {
    const trackableElements = document.querySelectorAll('[data-track-click]');

    trackableElements.forEach((element) => {
        element.addEventListener('click', () => {
            pushDataLayerEvent(element.dataset.eventName || 'custom_click', {
                event_category: element.dataset.eventCategory || 'interaction',
                event_label: element.dataset.eventLabel || element.textContent.trim()
            });
        });
    });
}

function setupEcommerceButtons() {
    const addToCartButton = document.querySelector('[data-add-to-cart]');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', () => {
            pushDataLayerEvent('add_to_cart', {
                currency: 'USD',
                value: 49.99,
                items: [{
                    item_id: 'SKU-001',
                    item_name: 'Analytics T-Shirt',
                    price: 49.99,
                    quantity: 1
                }]
            });
        });
    }

    const beginCheckoutButton = document.querySelector('[data-begin-checkout]');
    if (beginCheckoutButton) {
        beginCheckoutButton.addEventListener('click', () => {
            pushDataLayerEvent('begin_checkout', {
                currency: 'USD',
                value: 49.99
            });
        });
    }

    const purchaseButton = document.querySelector('[data-complete-purchase]');
    if (purchaseButton) {
        purchaseButton.addEventListener('click', () => {
            pushDataLayerEvent('purchase', {
                transaction_id: `ORDER-${Date.now()}`,
                value: 49.99,
                currency: 'USD'
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupPageViewEvent();
    setupClickTracking();
    setupEcommerceButtons();
});
