import express from 'express'
import fs from 'fs/promises'
import path from 'path'

const servidor = express()
const PORT = 8080
servidor.use(express.json())


const productsPath = path.resolve('./products.json')
const cartsPath = path.resolve('./carts.json')


async function readFileJSON(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // Si no existe el archivo, devolvemos un array vacío
    return []
  }
}

async function writeFileJSON(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2))
}


const productsRouter = express.Router()


productsRouter.get('/', async (req, res) => {
  const products = await readFileJSON(productsPath)
  res.json(products)
})


productsRouter.post('/', async (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' })
  }

  const products = await readFileJSON(productsPath)

  const newProduct = {
    id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
    title,
    description,
    code,
    price,
    status: status ?? true,
    stock,
    category,
    thumbnails: thumbnails || []
  }

  products.push(newProduct)
  await writeFileJSON(productsPath, products)

  res.status(201).json({ message: 'Producto creado correctamente', product: newProduct })
})


const cartsRouter = express.Router()


cartsRouter.post('/', async (req, res) => {
  const carts = await readFileJSON(cartsPath)

  const newCart = {
    id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
    products: []
  }

  carts.push(newCart)
  await writeFileJSON(cartsPath, carts)

  res.status(201).json({ message: 'Carrito creado correctamente', cart: newCart })
})


servidor.use('/api/products', productsRouter)
servidor.use('/api/carts', cartsRouter)


servidor.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`)
})
