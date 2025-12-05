import { Router } from "express";
import { CartModel } from "../dao/models/Cart.js";
import { ProductModel } from "../dao/models/Product.js";

const router = Router();


// ======================================================
// POST  Crear un carrito vacío
// ======================================================
router.post("/", async (req, res) => {
  const newCart = await CartModel.create({ products: [] });
  res.status(201).json({ status: "success", cart: newCart });
});


// ======================================================
// GET Obtener carrito con populate
// ======================================================
router.get("/:cid", async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid)
      .populate("products.product")
      .lean();

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json({ status: "success", cart });

  } catch (err) {
    res.status(400).json({ error: "ID inválido" });
  }
});


// ======================================================
// POST  Agregar producto
// ======================================================
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const product = await ProductModel.findById(pid);
    if (!product) return res.status(404).json({ error: "Producto no existe" });

   
    const item = cart.products.find(p => p.product.toString() === pid);

    if (item) {
      item.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();

    res.json({ status: "success", cart });

  } catch (err) {
    res.status(500).json({ error: "Error agregando producto" });
  }
});


// ======================================================
// DELETE  eliminar 1 producto del carrito
// ======================================================
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = cart.products.filter(
      p => p.product.toString() !== pid
    );

    await cart.save();

    res.json({ status: "success", cart });

  } catch (err) {
    res.status(500).json({ error: "Error eliminando producto" });
  }
});


// ======================================================
// PUT  reemplazar todo el carrito
// ======================================================
router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = products; /
    await cart.save();

    res.json({ status: "success", cart });

  } catch (err) {
    res.status(500).json({ error: "Error actualizando carrito" });
  }
});


// ======================================================
// PUT actualizar SOLO cantidad
// ======================================================
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const item = cart.products.find(p => p.product.toString() === pid);
    if (!item) return res.status(404).json({ error: "Producto no existe en carrito" });

    item.quantity = quantity;

    await cart.save();

    res.json({ status: "success", cart });

  } catch (err) {
    res.status(500).json({ error: "Error actualizando cantidad" });
  }
});


// ======================================================
// DELETE  vaciar carrito
// ======================================================
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = [];
    await cart.save();

    res.json({ status: "success", cart });

  } catch (err) {
    res.status(500).json({ error: "Error limpiando carrito" });
  }
});


export default router;
