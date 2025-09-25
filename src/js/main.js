// main.js
// ... (existing imports like ProductData and ProductList)
import Alert from './Alert.mjs';

// ... (existing code to set up your product list)

// Instantiate the Alert class and call its init method.
const mainElement = document.querySelector('main');
const alerts = new Alert(mainElement);
alerts.init();
