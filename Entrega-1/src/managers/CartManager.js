import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const cartsPath = path.join(__dirname, '../../carts.json')

export default class CartManager {
  async _readFile() {
    try {
      const data = await fs.readFile(cartsPath, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      return []
    }
  }

  async _writeFile(data) {
    await fs.writeFile(cartsPath, JSON.stringify(data, null, 2))
  }

  async createCart() {
    const carts = await this._readFile()

    const newCart = {
      id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
      products: []
    }

    carts.push(newCart)
    await this._writeFile(carts)
    return newCart
  }

  async getCartById(id) {
    const carts = await this._readFile()
    return carts.find((c) => c.id === id)
  }

  async addProductToCart(cid, pid) {
    const carts = await this._readFile()
    const cartIndex = carts.findIndex((c) => c.id === cid)

    if (cartIndex === -1) return null

    const cart = carts[cartIndex]

    const existingProduct = cart.products.find((p) => p.product === pid)

    if (existingProduct) {
      existingProduct.quantity += 1
    } else {
      cart.products.push({ product: pid, quantity: 1 })
    }

    carts[cartIndex] = cart
    await this._writeFile(carts)

    return cart
  }
}
