document.addEventListener('DOMContentLoaded', function () {
    // --- FEATURE 1: INTERACTIVE HEADER ON SCROLL ---
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { header.classList.add('scrolled'); } 
        else { header.classList.remove('scrolled'); }
    });

    // --- FEATURE 2: FADE-IN ANIMATION ON SCROLL ---
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    scrollElements.forEach(el => observer.observe(el));

    // --- FEATURE 3: LOCAL STORAGE & BUTTON FEEDBACK ---
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let favItems = JSON.parse(localStorage.getItem('favItems')) || [];

    // UPDATED function to get all product data, including price
    function getProductData(button) {
        const productCard = button.closest('.product-card');
        if (!productCard) return null;

        const title = productCard.querySelector('.product-title')?.innerText || 'No Title';
        const description = productCard.querySelector('.product-description')?.innerText || '';
        const image = productCard.querySelector('img')?.src || '';
        const priceText = productCard.querySelector('.product-price')?.innerText || '₹0';
        const price = parseInt(priceText.replace(/[^\d]/g, ''));

        return { title, description, image, price };
    }

    function saveToStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // --- FEATURE 4: "SEE MORE" BUTTON LOGIC ---
    const seeMoreBtn = document.getElementById('see-more-btn');
    if (seeMoreBtn) {
        seeMoreBtn.addEventListener('click', () => {
            document.querySelectorAll('.product-card.hidden-product').forEach(p => {
                p.classList.remove('hidden-product');
                if (p.classList.contains('animate-on-scroll')) {
                    p.classList.add('is-visible');
                }
            });
            seeMoreBtn.style.display = 'none';
        });
    }

    // --- NEW: FEATURE 5 - "SEE SIMILAR PRODUCTS" MODAL LOGIC ---
    const modalOverlay = document.getElementById('similar-modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    function openSimilarModal(category, currentTitle) {
        modalTitle.textContent = `Similar in ${category}`;
        modalContent.innerHTML = '';
        
        const allProducts = document.querySelectorAll('.product-card');
        const similarProducts = Array.from(allProducts).filter(p => 
            p.dataset.category === category && p.dataset.title !== currentTitle
        );

        if (similarProducts.length > 0) {
            similarProducts.forEach(p => {
                const title = p.dataset.title;
                const imageSrc = p.querySelector('.product-image img').src;
                const price = p.querySelector('.product-price').innerText;
                
                const itemHTML = `
                    <div class="similar-product-item">
                        <img src="${imageSrc}" alt="${title}">
                        <h4>${title}</h4>
                        <p>${price}</p>
                    </div>
                `;
                modalContent.insertAdjacentHTML('beforeend', itemHTML);
            });
        } else {
            modalContent.innerHTML = '<p>No other similar products found.</p>';
        }
        modalOverlay.classList.add('active');
    }

    function closeSimilarModal() {
        modalOverlay.classList.remove('active');
    }

    function showFeedback(button, message, isAlreadyAdded = false) {
        const originalText = button.querySelector('.btn-text').innerText;
        const icon = button.querySelector('i');
        const originalIconClass = icon.className;

        if (!isAlreadyAdded) {
            button.classList.add('success');
            icon.className = 'fa-solid fa-check';
        }
        
        button.querySelector('.btn-text').innerText = message;

        setTimeout(() => {
            if (!isAlreadyAdded) { button.classList.remove('success'); }
            button.querySelector('.btn-text').innerText = originalText;
            icon.className = originalIconClass;
        }, 2000);
    }
    
    // --- GLOBAL CLICK LISTENER FOR BUTTONS & LINKS ---
    document.addEventListener('click', function (e) {
        // Add to Cart/Fav buttons
        const iconButton = e.target.closest('.icon-button');
        if (iconButton) {
            const type = iconButton.dataset.type;
            const productData = getProductData(iconButton);
            if (!productData) return;

            if (type === 'cart') {
                if (!cartItems.some(item => item.title === productData.title)) {
                    cartItems.push(productData);
                    saveToStorage('cartItems', cartItems);
                    showFeedback(iconButton, 'Added!');
                } else { showFeedback(iconButton, 'In Cart', true); }
            } else if (type === 'fav') {
                if (!favItems.some(item => item.title === productData.title)) {
                    favItems.push(productData);
                    saveToStorage('favItems', favItems);
                    showFeedback(iconButton, 'Added!');
                } else { showFeedback(iconButton, 'In Faves', true); }
            }
            return;
        }

        // See Similar link
        const similarLink = e.target.closest('.see-similar-link');
        if (similarLink) {
            e.preventDefault();
            const productCard = similarLink.closest('.product-card');
            const category = productCard.dataset.category;
            const currentTitle = productCard.dataset.title;
            openSimilarModal(category, currentTitle);
            return;
        }

        // Close Modal
        if (e.target === modalOverlay || e.target === modalCloseBtn) {
            closeSimilarModal();
        }
    });
});
