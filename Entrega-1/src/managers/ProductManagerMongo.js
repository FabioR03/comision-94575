import Product from "../dao/models/Product.js";

export default class ProductManagerMongo {
  async getProductsPaginated({ limit = 10, page = 1, sort, query }) {
    const filter = query ? { category: query } : {};

    const options = {
      limit,
      page,
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : {}
    };

    return await Product.paginate(filter, options);
  }

  async getProducts() {
    return await Product.find();
  }

  async getProductById(id) {
    return await Product.findById(id);
  }

  async addProduct(data) {
    return await Product.create(data);
  }

  async updateProduct(id, data) {
    return await Product.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }
}
