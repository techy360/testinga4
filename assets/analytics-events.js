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

function getItemFromElement(element) {
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

function setupClickTracking() {
    const trackableElements = document.querySelectorAll('[data-track-click]');

    trackableElements.forEach((element) => {
        element.addEventListener('click', () => {
            const eventName = element.dataset.eventName || 'custom_click';
            const payload = {
                event_category: element.dataset.eventCategory || 'interaction',
                event_label: element.dataset.eventLabel || element.textContent.trim()
            };

            if (eventName === 'select_item') {
                const item = getItemFromElement(element);
                if (item) {
                    payload.item_list_name = element.dataset.itemListName || 'Demo Product Listing';
                    payload.items = [item];
                    payload.currency = 'AUD';
                    payload.value = item.price;
                }
            }

            pushDataLayerEvent(eventName, payload);
        });
    });
}

function setupEcommerceButtons() {
    const addToCartButton = document.querySelector('[data-add-to-cart]');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', () => {
            const item = getItemFromElement(addToCartButton) || {
                item_id: 'SKU-001',
                item_name: 'Analytics T-Shirt',
                price: 49.99,
                quantity: 1
            };

            pushDataLayerEvent('add_to_cart', {
                currency: 'AUD',
                value: item.price,
                items: [item]
            });
        });
    }

    const beginCheckoutButton = document.querySelector('[data-begin-checkout]');
    if (beginCheckoutButton) {
        beginCheckoutButton.addEventListener('click', () => {
            pushDataLayerEvent('begin_checkout', {
                currency: 'AUD',
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
                currency: 'AUD'
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupPageViewEvent();
    setupClickTracking();
    setupEcommerceButtons();
});
