
function productCardTemplate(product) {
    console.log("product===========", product)
  const discount = Math.round(product.SuggestedRetailPrice - product.FinalPrice);
  return `
  <li class="product-card">
    <a href="product_pages/?product=${product.Id}">
      <img src="${product.Image}" alt="${product.Name}">
      <h2 class="card__brand">${product.Brand.Name}</h2>
      <h3 class="card__name">${product.Name}</h3>
      <p class="product-card__price">$ ${product.FinalPrice} ${product.FinalPrice < product.SuggestedRetailPrice ? '<span class="discount-badge">¡Sale!</span>' : ''}</p>
      <span class="product-card__price">$ ${discount}.00 off</span>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData();
    this.renderList(list);
  }

  renderList(list) {
    const htmlstring = list.map(productCardTemplate);
    this.listElement.innerHTML = htmlstring.join('');
  }
}
