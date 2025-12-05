import { Router } from "express";
import { ProductModel } from "../models/Product.js";

const router = Router();


// ==========================================
//  Lista de productos con paginación
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

    if (sort) options.sort = { price: sort === "asc" ? 1 : -1 };

    const result = await ProductModel.paginate(filter, options);

    const baseUrl =
      `/?limit=${limit}` + (query ? `&query=${query}` : "") + (sort ? `&sort=${sort}` : "");

    res.render("products", {
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
    console.error(err);
    res.status(500).send("Error al cargar productos");
  }
});


// ==========================================
// RealTime Products
// ==========================================
router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await ProductModel.find().lean();
    res.render("realTimeProducts", { products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al cargar productos en tiempo real");
  }
});


// ==========================================
// Detalle de producto individual
// ==========================================
router.get("/products/:pid", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).lean();
    if (!product) return res.status(404).send("Producto no encontrado");

    res.render("productDetail", { product });
  } catch (err) {
    res.status(400).send("ID inválido");
  }
});

export default router;

