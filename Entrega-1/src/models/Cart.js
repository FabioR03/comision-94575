import mongoose from "mongoose";

// Define el esquema del carrito
const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
      quantity: { type: Number, default: 1 }
    }
  ]
});

// Exportar el modelo
export const CartModel = mongoose.model("carts", cartSchema);
