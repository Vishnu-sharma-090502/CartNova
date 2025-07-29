document.addEventListener("DOMContentLoaded", () => {
  updateCartTotal();

  // Handle quantity buttons
  document.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const input = e.target.closest(".quantity-control").querySelector(".qty-input");
      let value = parseInt(input.value);
      if (e.target.textContent === "+") {
        input.value = value + 1;
      } else if (e.target.textContent === "-" && value > 1) {
        input.value = value - 1;
      }
      updateCartTotal();
    });
  });

  // Handle manual input changes
  document.querySelectorAll(".qty-input").forEach((input) => {
    input.addEventListener("change", () => {
      if (parseInt(input.value) < 1 || isNaN(input.value)) {
        input.value = 1;
      }
      updateCartTotal();
    });
  });

  // Handle item removal
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest(".cart-item").remove();
      updateCartTotal();
    });
  });
});

// Function to update total price
function updateCartTotal() {
  const cartItems = document.querySelectorAll(".cart-item");
  let total = 0;

  cartItems.forEach((item) => {
    const priceText = item.querySelector("p").textContent;
    const price = parseInt(priceText.replace(/[^\d]/g, ""));
    const qty = parseInt(item.querySelector(".qty-input").value);
    total += price * qty;
  });

  document.querySelector(".cart-summary h3").textContent = `Total: ₹${total.toLocaleString()}`;
}
