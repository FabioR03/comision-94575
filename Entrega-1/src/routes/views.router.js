import { Router } from 'express'
import ProductManager from '../managers/ProductManager.js'
import path from 'path'
import { fileURLToPath } from 'url'

const router = Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const manager = new ProductManager(path.join(__dirname, '..', '..', 'products.json'))

router.get('/', async (req, res) => {
  const products = await manager.getProducts()
  res.render('home', { products })
})

router.get('/realtimeproducts', async (req, res) => {
  const products = await manager.getProducts()
  res.render('realTimeProducts', { products })
})

export default router

