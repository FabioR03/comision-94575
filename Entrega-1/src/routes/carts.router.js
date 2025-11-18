import { Router } from 'express'
import CartManager from '../managers/CartManager.js'
import ProductManager from '../managers/ProductManager.js'

const router = Router()
const cartManager = new CartManager()
const productManager = new ProductManager()


router.post('/', async (req, res) => {
  const newCart = await cartManager.createCart()
  res.status(201).json(newCart)
})


router.get('/:cid', async (req, res) => {
  const cid = parseInt(req.params.cid)
  const cart = await cartManager.getCartById(cid)

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' })
  }

  res.json(cart.products)
})


router.post('/:cid/product/:pid', async (req, res) => {
  const cid = parseInt(req.params.cid)
  const pid = parseInt(req.params.pid)

  // Verificar producto existente
  const productExists = await productManager.getProductById(pid)
  if (!productExists) {
    return res.status(404).json({ error: 'Producto no existe' })
  }

  const updatedCart = await cartManager.addProductToCart(cid, pid)

  if (!updatedCart) {
    return res.status(404).json({ error: 'Carrito no encontrado' })
  }

  res.json(updatedCart)
})

export default router
