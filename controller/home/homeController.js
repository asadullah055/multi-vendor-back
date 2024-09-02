const categoryModel = require("../../models/categoryModel");
const productModel = require("../../models/productModel");
const queryProducts = require("../../utils/queryProdut");
const sendMessage = require("../../utils/response");

class homeController {
  formateProduct = (products) => {
    const productArray = [];
    for (let i = 0; i < products.length; i++) {
      if (i % 3 === 0) {
        productArray.push([]);
      }
      productArray[productArray.length - 1].push(products[i]);
    }
    return productArray;
  };

  get_categorys = async (req, res) => {
    try {
      const categorys = await categoryModel.find({});
      sendMessage(res, 200, { categorys });
    } catch (error) {
      console.log(error.message);

      sendMessage(res, 500, { error: error.message });
    }
  };
  get_products = async (req, res) => {
    try {
      const products = await productModel.find({}).limit(16).sort({
        createdAt: -1,
      });
      const allProduct1 = await productModel.find({}).limit(9).sort({
        createdAt: -1,
      });
      const latest_product = this.formateProduct(allProduct1);
      const allProduct2 = await productModel.find({}).limit(9).sort({
        rating: -1,
      });
      const topRated_product = this.formateProduct(allProduct2);
      const allProduct3 = await productModel.find({}).limit(9).sort({
        discount: -1,
      });
      const discount_product = this.formateProduct(allProduct3);

      sendMessage(res, 200, {
        products,
        latest_product,
        topRated_product,
        discount_product,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  price_range_product = async (req, res) => {
    try {
      const priceRange = {
        low: 0,
        high: 0,
      };
      const product = await productModel.find({}).limit(9).sort({
        createdAt: -1,
      });
      const latest_product = this.formateProduct(product);
      const getForPrice = await productModel.find({}).sort({ price: 1 });
      if (getForPrice.length > 0) {
        priceRange.high = getForPrice[getForPrice.length - 1].price;
        priceRange.low = getForPrice[0].price;
      }

      sendMessage(res, 200, {
        latest_product,
        priceRange,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  query_products = async (req, res) => {
    const parPage = 12;
    req.query.parPage = parPage;
    try {
      const products = await productModel.find({}).sort({
        createdAt: -1,
      });
      const totalProduct = new queryProducts(products, req.query)
        .categoryQuery()
        .searchQuery()
        .priceQuery()
        .ratingQuery()
        .sortByPrice()
        .countProducts();

      const result = new queryProducts(products, req.query)
        .categoryQuery()
        .searchQuery()
        .ratingQuery()
        .priceQuery()
        .sortByPrice()
        .skip()
        .limit()
        .getProducts();

      sendMessage(res, 200, {
        products: result,
        totalProduct,
        parPage,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
}

module.exports = new homeController();
