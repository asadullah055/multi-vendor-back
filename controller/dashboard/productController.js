const formidable = require("formidable");
const productModel = require("../../models/productModel");
const sendMessage = require("../../utils/response");
const cloudinary = require("cloudinary").v2;
class productController {
  add_product = async (req, res) => {
    const { id } = req;
    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
      let {
        name,
        category,
        brand,
        description,
        discount,
        price,
        stock,
        shopName,
      } = fields;

      const { images } = files;
      name = name.trim();
      const slug = name.split(" ").join("-");
      cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.secrete_key,
        secure: true,
      });

      try {
        let allImageUrl = [];

        if (Array.isArray(images)) {
          // If multiple images are uploaded
          for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.uploader.upload(
              images[i].filepath,
              {
                folder: "products",
              }
            );
            allImageUrl.push(result.url);
          }
        } else {
          // If only a single image is uploaded
          const result = await cloudinary.uploader.upload(images.filepath, {
            folder: "products",
          });
          allImageUrl.push(result.url);
        }

        const product = await productModel.create({
          sellerId: id,
          name,
          slug,
          shopName,
          category: category.trim(),
          description: description.trim(),
          stock: parseInt(stock),
          price: parseInt(price),
          discount: parseInt(discount),
          images: allImageUrl,
          brand: brand.trim(),
        });
        sendMessage(res, 201, { message: "Product add success" });
      } catch (error) {
        sendMessage(res, 500, { error: error.message });
      }
    });
  };
  get_products = async (req, res) => {
    const { perPage, page, searchValue } = req.query;
    const { id } = req;
    let skipPage = parseInt(perPage) * (parseInt(page) - 1);
    try {
      if (searchValue) {
        const products = await productModel
          .find({
            $text: { $search: searchValue },
            sellerId: id,
          })
          .skip(skipPage)
          .limit(perPage)
          .sort({ createdAt: -1 });
        const totalProduct = await productModel
          .find({
            $text: { $search: searchValue },
            sellerId: id,
          })
          .countDocuments();
        sendMessage(res, 200, { totalProduct, products });
      } else {
        const products = await productModel
          .find({ sellerId: id })
          .skip(skipPage)
          .limit(perPage)
          .sort({ createdAt: -1 });
        const totalProduct = await productModel
          .find({ sellerId: id })
          .countDocuments();
        sendMessage(res, 200, { totalProduct, products });
      }
    } catch (error) {
      console.log(error);
    }
  };
  get_product = async (req, res) => {
    const { productId } = req.params;
    try {
      const product = await productModel.findById(productId);
      sendMessage(res, 200, { product });
    } catch (error) {
      sendMessage(res, 500, { message: error.message });
    }
  };
  update_product = async (req, res) => {
    let { name, description, discount, price, brand, productId, stock } =
      req.body;
    name = name.trim();
    const slug = name.split(" ").join("-");
    try {
      await productModel.findByIdAndUpdate(productId, {
        name,
        description,
        discount,
        price,
        brand,
        productId,
        stock,
        slug,
      });
      const product = await productModel.findById(productId);
      sendMessage(res, 200, { product, message: "product update success" });
    } catch (error) {
      sendMessage(res, 500, { error: error.message });
    }
  };
  update_image_product = async (req, res) => {
    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
      const { productId, oldImage } = fields;
      const { newImage } = files;

      if (err) {
        sendMessage(res, 404, { error: err.message });
      } else {
        try {
          cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.secrete_key,
            secure: true,
          });
          const result = await cloudinary.uploader.upload(newImage.filepath, {
            folder: "products",
          });

          if (result) {
            let { images } = await productModel.findById(productId);
            const index = images.findIndex((img) => img === oldImage);
            images[index] = result.url;

            await productModel.findByIdAndUpdate(productId, {
              images,
            });

            const product = await productModel.findById(productId);
            sendMessage(res, 200, {
              product,
              message: "product image update success",
            });
          } else {
            sendMessage(res, 404, { error: "image upload failed" });
          }
        } catch (error) {
          sendMessage(res, 404, { error: error.message });
        }
      }
    });
  };
}

module.exports = new productController();
