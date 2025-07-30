document.addEventListener("DOMContentLoaded", () => {
    // --- MOCK DATA: Add prices to your items ---
    // In a real app, prices would come from a database.
    // For now, we'll create a price map.
    const priceMap = {
        'APPLE IPHONE 16 PRO MAX': 149999,
        'PRO HEADPHONES': 4999,
        'SAMSUNG GALAXY WATCH': 24999,
        'IFB SMART WASHER': 32990,
        'MODERN ULTRABOOK': 75500,
        'BOSE PORTABLE SPEAKER': 12999,
        'SMART CONVERTIBLE REFRIGERATOR': 59990,
        'AIR-PODS PRO': 21000,
        'TEFAL EXPRESS STEAM IRON': 3499,
        'IFB CONVECTION MICROWAVE': 15990,
        'VOLTAS INVERTER AC': 35999,
        'SWAGGER COUNTING MACHINE': 4500,
    };

    // --- ELEMENTS ---
    const cartItemsList = document.querySelector(".cart-items-list");
    const emptyCartMessage = document.querySelector(".empty-cart-message");
    const cartLayout = document.querySelector(".cart-layout");

    // --- STATE ---
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    // Initialize quantities and prices if they don't exist
    cartItems.forEach(item => {
        if (!item.quantity) item.quantity = 1;
        if (!item.price) item.price = priceMap[item.title] || 0;
    });

    // --- RENDER FUNCTIONS ---
    function renderCart() {
        if (cartItems.length === 0) {
            emptyCartMessage.style.display = "block";
            cartLayout.style.display = "none";
            return;
        }

        emptyCartMessage.style.display = "none";
        cartLayout.style.display = "grid";
        cartItemsList.innerHTML = ""; // Clear existing items
        cartItems.forEach(createCartItem);
        updateSummary();
    }

    function createCartItem(item) {
        const itemEl = document.createElement("div");
        itemEl.className = "cart-item";
        itemEl.dataset.title = item.title;

        itemEl.innerHTML = `
            <div class="cart-item__image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item__info">
                <h3>${item.title}</h3>
                <p class="price">₹${item.price.toLocaleString()}</p>
            </div>
            <div class="cart-item__actions">
                <div class="quantity-control">
                    <button class="qty-btn qty-btn-minus">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="qty-input" readonly>
                    <button class="qty-btn qty-btn-plus">+</button>
                </div>
                <button class="remove-btn" title="Remove Item"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        cartItemsList.appendChild(itemEl);
    }

    function updateSummary() {
        const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shipping = subtotal > 0 ? 49 : 0;
        const total = subtotal + shipping;

        document.getElementById("summary-subtotal").textContent = `₹${subtotal.toLocaleString()}`;
        document.getElementById("summary-shipping").textContent = `₹${shipping.toLocaleString()}`;
        document.getElementById("summary-total").textContent = `₹${total.toLocaleString()}`;
    }

    // --- EVENT HANDLING (DELEGATION) ---
    cartItemsList.addEventListener("click", (e) => {
        const target = e.target;
        const itemEl = target.closest(".cart-item");
        if (!itemEl) return;
        const title = itemEl.dataset.title;

        if (target.matches(".qty-btn-plus")) {
            updateQuantity(title, 1);
        } else if (target.matches(".qty-btn-minus")) {
            updateQuantity(title, -1);
        } else if (target.matches(".remove-btn, .remove-btn *")) {
            handleRemove(target.closest('.remove-btn'), itemEl, title);
        }
    });

    // --- LOGIC FUNCTIONS ---
    function updateQuantity(title, change) {
        const item = cartItems.find(i => i.title === title);
        if (item) {
            item.quantity += change;
            if (item.quantity < 1) {
                item.quantity = 1;
            }
            saveAndRerender();
        }
    }

    function handleRemove(button, itemEl, title) {
        if (button.classList.contains("confirm-delete")) {
            clearTimeout(parseInt(button.dataset.timeoutId));
            cartItems = cartItems.filter(i => i.title !== title);
            itemEl.classList.add("removing");
            itemEl.addEventListener('transitionend', saveAndRerender);
        } else {
            const originalIcon = button.innerHTML;
            button.innerHTML = `<i class="fa-solid fa-question-circle"></i>`;
            button.classList.add("confirm-delete");
            const timeoutId = setTimeout(() => {
                button.innerHTML = originalIcon;
                button.classList.remove("confirm-delete");
            }, 3000);
            button.dataset.timeoutId = timeoutId;
        }
    }

    function saveAndRerender() {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        renderCart();
    }

    // --- INITIAL RENDER ---
    renderCart();
});

// --- NAVBAR SCRIPT ---
// This code makes the hamburger menu work

const hamburgerMenu = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');

hamburgerMenu.addEventListener('click', () => {
    // Toggle 'active' class on both the hamburger and the nav links container
    hamburgerMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
});
