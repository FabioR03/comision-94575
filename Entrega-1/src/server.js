import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import { ProductModel } from "./models/Product.js";
import { CartModel } from "./models/Cart.js";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () =>
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
);

const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("Cliente conectado");

  const products = await ProductModel.find().lean();
  socket.emit("productsUpdated", products);

  socket.on("newProduct", async (product) => {
    await ProductModel.create(product);
    const updatedProducts = await ProductModel.find().lean();
    io.emit("productsUpdated", updatedProducts);
  });
});
