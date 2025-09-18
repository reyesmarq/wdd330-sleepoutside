// main.js
import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

// Create a data source instance
const dataSource = new ProductData('tents');

// Get the element where the list will be rendered
const element = document.querySelector(".product-list");

// Create a ProductList instance
const productList = new ProductList("Tents", dataSource, element);

// Call init to start the process
productList.init();