// Configuration using the Azure URLs provided by the user
const CONFIG = {
    ORDER_SERVICE_URL: 'https://ctse-order-service.thankfuldune-f67cd50d.centralindia.azurecontainerapps.io',
    PRODUCT_SERVICE_URL: 'https://ctse-product-service.thankfuldune-f67cd50d.centralindia.azurecontainerapps.io',
    // Known product IDs from our backend implementation
    PRODUCT_IDS: ['101', '102']
};

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

async function loadProducts() {
    const grid = document.getElementById('productGrid');
    
    try {
        const products = [];
        // Fetch details for each known product from the Product Service
        for (const id of CONFIG.PRODUCT_IDS) {
            const response = await fetch(`${CONFIG.PRODUCT_SERVICE_URL}/products/${id}`);
            if (response.ok) {
                products.push(await response.json());
            }
        }

        renderProducts(products);
    } catch (error) {
        grid.innerHTML = `<div class="loader" style="color: #ef4444">Failed to load products. Make sure CORS is enabled and services are running.</div>`;
        console.error("Error loading products:", error);
    }
}

function renderProducts(products) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    products.forEach(product => {
        // Determine a simple emoji icon based on product name
        const icon = product.name.toLowerCase().includes('laptop') ? '💻' : '🖱️';
        
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image-placeholder">
                ${icon}
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-stock">Stock Available: ${product.stock}</div>
            </div>
            <button class="buy-btn" onclick="placeOrder('${product.id}')" ${product.stock <= 0 ? 'disabled' : ''}>
                ${product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
            </button>
        `;
        grid.appendChild(card);
    });
}

async function placeOrder(productId) {
    const userId = document.getElementById('userSelect').value;
    const btn = event.target;
    const originalText = btn.innerText;
    
    // UI Feedback
    btn.innerText = 'Processing...';
    btn.disabled = true;

    try {
        const response = await fetch(`${CONFIG.ORDER_SERVICE_URL}/orders/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                product_id: productId,
                quantity: 1
            })
        });

        const data = await response.json();

        if (response.ok) {
            showToast('Order Successful', `Total amount charged: $${data.order_details.total_price.toFixed(2)}`, 'success');
        } else {
            showToast('Order Failed', data.detail || 'Failed to place order', 'error');
        }
    } catch (error) {
        showToast('Network Error', 'Cannot reach Order Service', 'error');
        console.error("Order error:", error);
    } finally {
        // Reset button
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

function showToast(title, message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
    `;
    
    container.appendChild(toast);

    // Remove from DOM after animation completes (4s + 0.4s)
    setTimeout(() => {
        toast.remove();
    }, 4500);
}
