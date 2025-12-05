import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  status: { type: Boolean, default: true },
  thumbnails: { type: [String], default: [] }
});

// Añadir paginación
productSchema.plugin(mongoosePaginate);

// Exportar el modelo
export const ProductModel = mongoose.model("products", productSchema);
