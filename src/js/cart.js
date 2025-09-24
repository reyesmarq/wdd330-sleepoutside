import { getLocalStorage } from './utils.mjs';

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart');
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');
  renderCartTotal();
}

/**@param {import("../types/product.d.ts").Product} item
 * @returns {string} HTML string
 */
function cartItemTemplate(item) {
  const newItem = `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img
          src="${item.Image}"
          alt="${item.Name}"
        />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
      <button class="cart-card__delete-btn" data-id=${item.Id} id="deleteFromCart">Delete</button>
    </li>
  `;

  return newItem;
}

// Function to calculate and render the cart total
function renderCartTotal() {
  const cartItems = getLocalStorage('so-cart');
  const totalFooter = document.querySelector('.cart-footer');

  if (cartItems && cartItems.length > 0) {
    totalFooter.classList.remove('hide');
    const total = cartItems.reduce((acc, item) => acc + item.FinalPrice, 0);
    document.querySelector('.cart-total').textContent = total.toFixed(2);
  } else {
    totalFooter.classList.add('hide');
  }
}

renderCartContents();

document.querySelector('.product-list').addEventListener('click', (e) => {
  if (e.target && e.target.id === 'deleteFromCart') {
    const cartItems = getLocalStorage('so-cart') ?? [];
    const itemToRemoveIndex = cartItems.findIndex(
      (item) => item.Id === e.target.dataset.id,
    );
    if (itemToRemoveIndex > -1) {
      cartItems.splice(itemToRemoveIndex, 1);
      localStorage.setItem('so-cart', JSON.stringify(cartItems));
      renderCartContents();
    }
  }
});
