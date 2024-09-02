const customerAuthController = require("../../controller/home/customerAuthController");

const customerAuthRouter = require("express").Router();

customerAuthRouter.post(
  "/customer/customer-register",
  customerAuthController.customer_register
);
customerAuthRouter.post(
  "/customer/customer-login",
  customerAuthController.customer_login
);

module.exports = customerAuthRouter;
