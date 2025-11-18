import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const productsPath = path.join(__dirname, '../../products.json')

export default class ProductManager {
  async _readFile() {
    try {
      const data = await fs.readFile(productsPath, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      return []
    }
  }

  async _writeFile(data) {
    await fs.writeFile(productsPath, JSON.stringify(data, null, 2))
  }

  async getProducts() {
    return await this._readFile()
  }

  async getProductById(id) {
    const products = await this._readFile()
    return products.find((p) => p.id === id)
  }

  async addProduct(productData) {
    const products = await this._readFile()

    const newProduct = {
      id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
      status: true,
      thumbnails: [],
      ...productData
    }

    products.push(newProduct)
    await this._writeFile(products)
    return newProduct
  }

  async updateProduct(id, updateData) {
    const products = await this._readFile()
    const index = products.findIndex((p) => p.id === id)

    if (index === -1) return null

    const updatedProduct = {
      ...products[index],
      ...updateData,
      id: products[index].id
    }

    products[index] = updatedProduct
    await this._writeFile(products)

    return updatedProduct
  }

  async deleteProduct(id) {
    const products = await this._readFile()
    const filtered = products.filter((p) => p.id !== id)

    if (filtered.length === products.length) return false

    await this._writeFile(filtered)
    return true
  }
}
