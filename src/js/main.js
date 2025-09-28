import Alert from './Alert.mjs';
import { NumberOfItemsOnCart } from './NumberOfItemsOnCart.mjs';

const mainElement = document.querySelector('main');
const alerts = new Alert(mainElement);
alerts.init();

new NumberOfItemsOnCart().updateCartCount();
