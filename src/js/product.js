import { setLocalStorage } from './utils.mjs';
import ProductData from './ProductData.mjs';

const dataSource = new ProductData('tents');

function addProductToCart(product) {
  try {
    const cartItems = JSON.parse(localStorage.getItem('so-cart')) || [];
    setLocalStorage('so-cart', [...cartItems, product]);
  } catch (error) {
    if (error.message.includes('is not iterable')) {
      // means that probably the user runs the older version of the code and we have an object instead of an array
      // So we have to convert it to an array and add the new product
      const cartItems = JSON.parse(localStorage.getItem('so-cart'));
      setLocalStorage('so-cart', [cartItems, product]);
    }

    throw new Error(`Can't add product to cart`);
  }
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById('addToCart')
  .addEventListener('click', addToCartHandler);
