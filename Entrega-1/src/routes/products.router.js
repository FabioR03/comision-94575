import { Router } from "express";
import { ProductModel } from "../models/Product.js"; 

const router = Router();


// ==========================================
// GET 
// ==========================================
router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    let filter = {};

   
    if (query) {
      const [field, value] = query.split(":");
      filter[field] = value;
    }

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      lean: true,
    };

    if (sort) {
      options.sort = { price: sort === "asc" ? 1 : -1 };
    }

    const result = await ProductModel.paginate(filter, options);

    const baseUrl =
      `/products?limit=${limit}` +
      (query ? `&query=${query}` : "") +
      (sort ? `&sort=${sort}` : "");

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `${baseUrl}&page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `${baseUrl}&page=${result.nextPage}` : null,
    });
  } catch (err) {
    console.error("Error GET /products:", err);
    res.status(500).json({ status: "error", error: err.message });
  }
});


// ==========================================
// GET 
// ==========================================
router.get("/:pid", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).lean();

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ error: "ID inválido" });
  }
});


// ==========================================
// POST 
// ==========================================
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const newProduct = await ProductModel.create({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    });

   
    const updatedList = await ProductModel.find().lean();
    req.app.locals.io.emit("productList", updatedList);

    res.status(201).json({
      status: "success",
      message: "Producto agregado",
      product: newProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al agregar producto" });
  }
});


// ==========================================
// PUT 
// ==========================================
router.put("/:pid", async (req, res) => {
  try {
    const updates = req.body;

    if (updates._id) {
      return res
        .status(400)
        .json({ error: "No se puede modificar el id del producto" });
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.pid,
      updates,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});


// ==========================================
// DELETE 
// ==========================================
router.delete("/:pid", async (req, res) => {
  try {
    await ProductModel.findByIdAndDelete(req.params.pid);

    const updatedList = await ProductModel.find().lean();
    req.app.locals.io.emit("productList", updatedList);

    res.json({ status: "success", message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

export default router;
