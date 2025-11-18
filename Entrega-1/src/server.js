import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'http'
import { Server } from 'socket.io'
import exphbs from 'express-handlebars'

import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'
import ProductManager from './managers/ProductManager.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

const productManager = new ProductManager(path.join(__dirname, '..', 'products.json'))


app.use(express.json())
app.use('/public', express.static(path.join(__dirname, '..', 'src', 'public')))


app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))


app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)


io.on('connection', async (socket) => {
  console.log('🟢 Cliente conectado')

  const products = await productManager.getProducts()
  socket.emit('productList', products)
})


app.locals.io = io


const PORT = 8080
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`)
})
