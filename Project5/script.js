const products = [
    { id: 1, name: "Wireless Mouse", price: 29.99 },
    { id: 2, name: "Bluetooth Headphones", price: 89.99 },
    { id: 3, name: "USB-C Hub", price: 49.99 },
    { id: 4, name: "Laptop Stand", price: 39.99 },
    { id: 5, name: "Mechanical Keyboard", price: 79.99 },
    { id: 6, name: "Gaming Monitor", price: 199.99 }
];

const PROMO_CODES = new Map([
    ['STUDENT10', 10],
    ['CAMPUS20', 20],
    ['GRADUATE15', 15]
]);

let selectedItems = [];
let currentMaxDiscount = 50;

function initialize() {
    renderProducts();
    setupEventListeners();
}

function renderProducts() {
    const productsGrid = document.getElementById('products');
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="toggleSelection(${product.id})">Select</button>
        </div>
    `).join('');
}

function toggleSelection(productId) {
    selectedItems.push(productId);  // Allow selecting the same product multiple times
    updateSelectionDisplay();
    updatePricing();
}

function updateSelectionDisplay() {
    const selectedItemsDiv = document.getElementById('selectedItems');
    
    const itemCounts = selectedItems.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
    }, {});

    selectedItemsDiv.innerHTML = Object.entries(itemCounts)
        .map(([id, count]) => {
            const product = products.find(p => p.id == id);
            return `
                <div class="selected-item">
                    <span>${product.name} (x${count})</span>
                    <span>$${(product.price * count).toFixed(2)}</span>
                </div>
            `;
        }).join('');
}

function calculateDiscount() {
    const rollNumber = document.getElementById('rollNumber').value;
    const promoCode = document.getElementById('promoCode').value.toUpperCase();
    
    // Calculate base discount from roll number
    const rollDigits = rollNumber.split('-')[1] || '';
    const middleDigits = rollDigits.slice(1, 3) || '00';
    let discount = parseInt(middleDigits) || 0;
    
    // Apply promo code discount
    discount += PROMO_CODES.get(promoCode) || 0;
    
    // Update max discount based on selected items
    currentMaxDiscount = selectedItems.length >= 2 ? 60 : 50;
    
    return Math.min(discount, currentMaxDiscount);
}

function updatePricing() {
    const discount = calculateDiscount();
    const totalPrice = selectedItems
        .map(id => products.find(p => p.id === id).price)
        .reduce((acc, price) => acc + price, 0);
    
    const discountedPrice = totalPrice * (1 - discount / 100);
    
    document.getElementById('totalDiscount').textContent = discount;
    document.getElementById('finalPrice').textContent = discountedPrice.toFixed(2);
}

function setupEventListeners() {
    document.getElementById('rollNumber').addEventListener('input', updatePricing);
    document.getElementById('promoCode').addEventListener('input', updatePricing);
}

// Initialize the application
initialize();
