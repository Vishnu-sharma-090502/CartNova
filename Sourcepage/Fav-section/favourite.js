document.addEventListener("DOMContentLoaded", function () {
  const favContainer = document.querySelector(".fav-products");
  let favItems = JSON.parse(localStorage.getItem("favItems")) || [];
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  if (favItems.length === 0) {
    favContainer.innerHTML = "<p style='text-align:center; font-size:1.2rem;'>No favourite products added yet.</p>";
    return;
  }

  // Render each favourite item
  favItems.forEach((item) => {
    const card = document.createElement("div");
    card.className = "fav-card";

    card.setAttribute("data-title", item.title); // Use title as identifier

    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}" />
      <h3>${item.title}</h3>
      <p>${item.description || ""}</p>
      <div class="fav-buttons">
        <button class="add-to-cart">
          <i class="fa-solid fa-cart-shopping"></i> Add to Cart
        </button>
        <button class="remove-fav">
          <i class="fa-solid fa-trash"></i> Remove
        </button>
      </div>
    `;

    favContainer.appendChild(card);
  });

  // Event delegation for buttons
  favContainer.addEventListener("click", function (e) {
    const card = e.target.closest(".fav-card");
    if (!card) return;

    const title = card.dataset.title;
    const item = favItems.find((prod) => prod.title === title);

    if (e.target.closest(".add-to-cart")) {
      const alreadyInCart = cartItems.some((prod) => prod.title === title);
      if (!alreadyInCart) {
        cartItems.push(item);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        alert(`${item.title} added to Cart`);
      } else {
        alert(`${item.title} is already in Cart`);
      }
    }

    if (e.target.closest(".remove-fav")) {
      const confirmDelete = confirm("Remove this item from favourites?");
      if (confirmDelete) {
        favItems = favItems.filter((prod) => prod.title !== title);
        localStorage.setItem("favItems", JSON.stringify(favItems));
        card.remove(); // Remove card from DOM
        if (favItems.length === 0) {
          favContainer.innerHTML = "<p style='text-align:center; font-size:1.2rem;'>No favourite products added yet.</p>";
        }
      }
    }
  });
});
