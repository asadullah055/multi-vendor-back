const homeController = require("../../controller/home/homeController");

const homeRouter = require("express").Router();

homeRouter.get("/get-categorys", homeController.get_categorys);
homeRouter.get("/get-products", homeController.get_products);
homeRouter.get("/price-range-latest-product", homeController.price_range_product);
homeRouter.get("/query-products", homeController.query_products);

module.exports = homeRouter;
