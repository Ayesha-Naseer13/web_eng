const products = [
    {
        name: "Quantum Watch",
        price: "$299",
        image: "images/quantum-watch.jpg",
        description: "A timepiece that bends space-time continuum with quantum mechanics."
    },
    {
        name: "Holo Speaker",
        price: "$199",
        image: "images/holo-speaker.jpg",
        description: "3D holographic sound system with immersive audio experience."
    },
    {
        name: "Neon Drone",
        price: "$499",
        image: "images/neon-drone.jpg",
        description: "AI-powered drone with adaptive learning and night vision capabilities."
    }
];

const container = document.querySelector('.container');

products.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('product-card');

    card.innerHTML = `
        <div class="card-inner">
            <div class="card-side front">
                <img class="product-image" src="${product.image}" alt="${product.name}">
                <div class="product-name">${product.name}</div>
                <div class="product-price">${product.price}</div>
            </div>
            <div class="card-side back">
                <div class="product-description">${product.description}</div>
                <button class="buy-button">Buy Now</button>
            </div>
        </div>
    `;

    container.appendChild(card);

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('buy-button')) {
            const productName = event.target.getAttribute('data-product');
            console.log(`Added ${productName} to cart`);
        }
    });
});

// Dark Mode Toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
});
