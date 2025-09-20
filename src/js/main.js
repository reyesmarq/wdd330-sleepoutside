import ProductData from './ProductData.mjs'
import ProductList from './ProductList.mjs'

const dataSource = new ProductData("tents")
const element = document.querySelector(".product-list")

const productList = new ProductList("tents", dataSource, element)
productList.init()

// main.js
// ... (existing imports like ProductData and ProductList)
import Alert from './Alert.mjs';

// ... (existing code to set up your product list)

// Instantiate the Alert class and call its init method.
const mainElement = document.querySelector('main');
const alerts = new Alert(mainElement);
alerts.init();