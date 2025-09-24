import { getParam } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductDetails from './ProductDetails.mjs';

const dataSource = new ProductData('tent');
const productId = getParam('product');
const productDetails = new ProductDetails(productId, dataSource);

async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  productDetails.addProductToCart(product);
}

async function bootstrap() {
  document.getElementById('product-detail').innerHTML =
    await productDetails.renderProductDetails();

  const btn = document.getElementById('addToCart');

  if (btn) {
    btn.addEventListener('click', addToCartHandler);
  }
}

bootstrap();
