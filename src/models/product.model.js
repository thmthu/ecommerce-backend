const { maxBy } = require("lodash");
const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";
const slugify = require("slugify");
const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_color: { type: String, required: true },
    product_size: { type: String, required: true },
    product_quantity: { type: Number, required: true },
    product_slug: { type: String, required: true },
    product_ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, "rating must above 1.0"],
      maxByax: [5, "rating must below 5.0"],
      set: (value) => Math.round(value * 10) / 10,
    },
    product_type: {
      type: String,
      required: true,
      enum: ["MaleClothe", "FemaleClothe"],
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPubliced: { type: Boolean, default: false, index: true, select: false },
    product_shop: { type: Schema.Types.ObjectId, ref: "Customer" },
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },

  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

const maleClotheSchema = new Schema(
  {
    brand: { type: String, required: true },
    material: { type: String },
    pattern: { type: String },
  },
  {
    timestamps: true,
    collection: "male_clothes",
  }
);
const femaleClotheSchema = new Schema(
  {
    brand: { type: String, required: true },
    material: { type: String },
    pattern: { type: String },
  },
  {
    timestamps: true,
    collection: "female_clothes",
  }
);
module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  femaleClothe: model("FemaleClothe", femaleClotheSchema),
  maleClothe: model("MaleClothe", maleClotheSchema),
};
