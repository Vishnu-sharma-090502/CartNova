document.addEventListener("DOMContentLoaded", function () {
    const favGrid = document.querySelector(".fav-grid");
    const emptyMessage = document.querySelector(".empty-favs-message");
    let favItems = JSON.parse(localStorage.getItem("favItems")) || [];
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    // Function to render all favourite items
    function renderFavourites() {
        // Clear the grid before rendering
        favGrid.innerHTML = "";

        if (favItems.length === 0) {
            emptyMessage.style.display = "block";
            favGrid.style.display = "none";
        } else {
            emptyMessage.style.display = "none";
            favGrid.style.display = "grid";
            favItems.forEach(createFavCard);
        }
    }

    // Function to create a single card
    function createFavCard(item) {
        const card = document.createElement("div");
        card.className = "fav-card";
        card.setAttribute("data-title", item.title); // Use title as unique identifier

        // Truncate description for display
        const shortDescription = item.description.split(' ').slice(0, 15).join(' ') + '...';

        card.innerHTML = `
            <div class="fav-card__image">
                <img src="${item.image}" alt="${item.title}" />
            </div>
            <h3 class="fav-card__title">${item.title}</h3>
            <p class="fav-card__description">${shortDescription}</p>
            <div class="fav-card__buttons">
                <button class="btn btn--cart">
                    <i class="fa-solid fa-cart-shopping"></i> Add to Cart
                </button>
                <button class="btn btn--remove">
                    <i class="fa-solid fa-trash"></i> Remove
                </button>
            </div>
        `;
        favGrid.appendChild(card);
    }

    // --- EVENT HANDLING ---
    favGrid.addEventListener("click", function (e) {
        const button = e.target.closest("button");
        if (!button) return;

        const card = button.closest(".fav-card");
        const title = card.dataset.title;
        const item = favItems.find((prod) => prod.title === title);

        // Handle "Add to Cart" click
        if (button.classList.contains("btn--cart")) {
            handleAddToCart(button, item);
        }
        
        // Handle "Remove" click (with 2-step confirmation)
        if (button.classList.contains("btn--remove")) {
            handleRemove(button, card, title);
        }
    });

    // Function to handle adding items to the cart
    function handleAddToCart(button, item) {
        const alreadyInCart = cartItems.some((prod) => prod.title === item.title);
        
        if (!alreadyInCart) {
            cartItems.push(item);
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            showButtonFeedback(button, "Added!", true);
        } else {
            showButtonFeedback(button, "In Cart", true, 1500); // Shorter duration
        }
    }

    // Function to handle removing items (2-step)
    function handleRemove(button, card, title) {
        // If it's already in confirm state, remove the item
        if (button.classList.contains("confirm-delete")) {
            // Clear any revert timeouts
            const timeoutId = parseInt(button.dataset.timeoutId);
            clearTimeout(timeoutId);

            // Filter out the item
            favItems = favItems.filter((prod) => prod.title !== title);
            localStorage.setItem("favItems", JSON.stringify(favItems));

            // Animate removal and then re-render
            card.classList.add("removing");
            card.addEventListener('transitionend', () => {
                renderFavourites();
            });

        } else {
            // First click: Change to "Confirm?" state
            const originalText = button.innerHTML;
            button.classList.add("confirm-delete");
            button.innerHTML = `<i class="fa-solid fa-question-circle"></i> Confirm?`;

            // Set a timeout to revert the button if not clicked again
            const timeoutId = setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove("confirm-delete");
            }, 3000); // Reverts after 3 seconds

            // Store the timeout ID so we can clear it if confirmed
            button.dataset.timeoutId = timeoutId;
        }
    }

    // Reusable function for button feedback
    function showButtonFeedback(button, message, isSuccess, duration = 2000) {
        const originalText = button.innerHTML;
        button.innerHTML = `<i class="fa-solid fa-check"></i> ${message}`;
        if(isSuccess) button.classList.add("success");
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = originalText;
            if(isSuccess) button.classList.remove("success");
            button.disabled = false;
        }, duration);
    }
    
    // Initial Render
    renderFavourites();
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
