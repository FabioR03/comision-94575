import { Router } from 'express'
import ProductManager from '../managers/ProductManager.js'

const router = Router()
const productManager = new ProductManager()


router.get('/', async (req, res) => {
  const products = await productManager.getProducts()
  res.json(products)
})


router.get('/:pid', async (req, res) => {
  const pid = parseInt(req.params.pid)
  const product = await productManager.getProductById(pid)

  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' })
  }

  res.json(product)
})


router.post('/', async (req, res, next) => {
  try {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' })
    }

    const newProduct = await productManager.addProduct({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails
    })

    // 🔥 EMITIR LISTA ACTUALIZADA A TODOS LOS CLIENTES
    req.app.locals.io.emit('productList', await productManager.getProducts())

    res.status(201).json({ message: 'Producto agregado', product: newProduct })

  } catch (error) {
    next(error)
  }
})

router.put('/:pid', async (req, res) => {
  const pid = parseInt(req.params.pid)
  const updateData = req.body

  if (updateData.id) {
    return res.status(400).json({ error: 'No se puede modificar el id del producto' })
  }

  const updated = await productManager.updateProduct(pid, updateData)

  if (!updated) {
    return res.status(404).json({ error: 'Producto no encontrado' })
  }

  res.json(updated)
})


router.delete('/:pid', async (req, res, next) => {
  try {
    const { pid } = req.params

    await productManager.deleteProduct(Number(pid))

    // 🔥 EMITIR LISTA ACTUALIZADA
    req.app.locals.io.emit('productList', await productManager.getProducts())

    res.json({ message: 'Producto eliminado' })

  } catch (error) {
    next(error)
  }
})

export default router

