function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Bad Response');
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    // this.path = `${location.origin}/json/${this.category}.json`;
    // HACK: Temporary fix for loading JSON from GitHub
    this.path = `https://raw.githubusercontent.com/reyesmarq/wdd330-sleepoutside/refs/heads/main/src/json/${this.category}.json`;
  }

  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data);
  }

  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }
}
