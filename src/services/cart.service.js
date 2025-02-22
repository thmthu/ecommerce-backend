"use strict";
const cartModel = require("../models/cart.model");
const { product } = require("../models/product.model");
const { convertStringToObjectId } = require("../utils");

const {
  ConflictRequestError,
  BadRequestError,
  ForbidenError,
  NotFoundError,
} = require("../core/error.response");
class CartService {
  static async createCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateOrInsert = {
        $addToSet: {
          cart_product: product,
        },
      },
      options = { upsert: true, new: true };
    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }
  // static async updateUserCartQuantity({ userId, product }) {
  //   const { productId, quantity } = product;
  //   const query = {
  //       cart_userId: userId,
  //       "cart_products.productId": productId,
  //       cart_state: "active",
  //     },
  //     updateSet = {
  //       $inc: { "cart_products.quantity": quantity },
  //     },
  //     option = { upsert: true, new: true };
  //   return await cartModel.findOneAndUpdate(query, updateSet, option);
  // }
  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const userCart = await cartModel.findOne({
      cart_userId: userId,
      cart_state: "active",
    });

    if (!userCart) {
      throw new NotFoundError("Cart not found");
    }

    const existingProduct = userCart.cart_products.find(
      (p) => p.productId.toString() === productId
    );

    if (existingProduct) {
      // Update quantity if product exists
      existingProduct.quantity += quantity;
    } else {
      // Add new product if it doesn't exist
      userCart.cart_products.push({ productId, quantity });
    }

    return await userCart.save();
  }

  static async addToCart({ userId, product = {} }) {
    const userCart = await cartModel.findOne({ cart_userId: userId });
    if (!userCart) {
      await CartService.createCart({ userId, product });
    }
    if (userCart.cart_products.length == 0) {
      userCart.cart_products = [product];
      return await userCart.save();
    }
    return await this.updateUserCartQuantity({ userId, product });
  }

  static async addToCartV2({ userId, shop_order_id }) {
    console.log("addToCartV2");
    const { productId, quantity, old_quantity } =
      shop_order_id[0].item_product[0];
    const foundProduct = await product.findOne({
      _id: convertStringToObjectId(productId),
    });
    if (!foundProduct) throw new NotFoundError("Product not found");
    console.log("shop id", foundProduct.product_shop, shop_order_id[0].shopId);
    if (foundProduct.product_shop != shop_order_id[0].shopId)
      throw new ForbidenError("Not allowed to add item to this shop");
    if (quantity == 0) {
      return await this.deleteProductFormCart({
        userId,
        productId: foundProduct._id,
      });
    }
    const userCart = await cartModel.findOne({ cart_userId: userId });
    if (!userCart) {
      await CartService.createCart({ userId, product });
    }
    return CartService.updateUserCartQuantity({
      userId,
      product: { productId, quantity },
    });
  }
  static async deleteProductFormCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateSet = {
        $pull: { cart_products: { productId } },
      };
    const productDelete = await product.findOneAndUpdate(query, updateSet);
    return productDelete;
  }
}
module.exports = CartService;
