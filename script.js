// Load existing cart/fav data from localStorage
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let favItems = JSON.parse(localStorage.getItem('favItems')) || [];

// Utility function to extract product data
function getProductData(button) {
  const productOverview = button.closest('.product-overview');
  if (!productOverview) return null;

  const productInfo = productOverview.querySelector('.product-info');
  const title = productInfo?.querySelector('h2')?.innerText || 'No Title';
  const description = productInfo?.querySelector('p')?.innerText || '';
  const image = productOverview.querySelector('img')?.src || '';

  return { title, description, image };
}

// Save data to localStorage
function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Handle add-to-cart or fav
document.addEventListener('click', function (e) {
  const button = e.target.closest('.icon-button');
  if (!button) return;

  const type = button.dataset.type; // 'cart' or 'fav'
  const productData = getProductData(button);
  if (!productData) return;

  if (type === 'cart') {
    const alreadyInCart = cartItems.some(item => item.title === productData.title);
    if (!alreadyInCart) {
      cartItems.push(productData);
      saveToStorage('cartItems', cartItems);
    }
  }

  if (type === 'fav') {
    const alreadyInFav = favItems.some(item => item.title === productData.title);
    if (!alreadyInFav) {
      favItems.push(productData);
      saveToStorage('favItems', favItems);
    }
  }
});
