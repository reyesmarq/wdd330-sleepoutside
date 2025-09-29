import { CheckoutProcess } from '/js/CheckoutProcess.mjs';
import { ExternalServices } from './ExternalServices.mjs';

const checkout = new CheckoutProcess('so-cart', '.order-summary');
const externalServices = new ExternalServices();
checkout.init();

const form = document.getElementById('checkout-form');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.checkValidity()) return; // native validation

  const payload = checkout.buildOrderPayload(form);

  try {
    const res = await externalServices.checkout(payload);
    // TODO: clear cart, redirect, show success, etc.
    console.log('Order placed:', res);
  } catch (err) {
    console.error('Checkout failed:', err);
    // TODO: show an error message to the user
  }
});
