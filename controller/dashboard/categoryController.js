const formidable = require("formidable");
const sendMessage = require("../../utils/response");
const categoryModel = require("../../models/categoryModel");
const cloudinary = require("cloudinary").v2;
class categoryController {
  add_category = async (req, res) => {
    const form = formidable();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        sendMessage(res, 400, { error: "something error" });
      } else {
        let { name } = fields;
        let { image } = files;

        name = name.trim();
        const slug = name.split(" ").join("-");
        cloudinary.config({
          cloud_name: process.env.cloud_name,
          api_key: process.env.api_key,
          api_secret: process.env.secrete_key,
          secure: true,
        });
        try {
          const result = await cloudinary.uploader.upload(image.filepath, {
            folder: "category",
          });

          if (result) {
            const category = await categoryModel.create({
              name,
              slug,
              image: result.url,
            });
            sendMessage(res, 201, {
              category,
              message: "category add success",
            });
          } else {
            sendMessage(res, 400, { error: "Image upload failed" });
          }
        } catch (error) {
          console.log(error);

          sendMessage(res, 500, { error: "Internal server error" });
        }
      }
    });
  };
  get_category = async (req, res) => {
    const { perPage, page, searchValue } = req.query;
    
    try {
        let skipPage = ''
        if (perPage && page) {
            skipPage = parseInt(perPage) * (parseInt(page) - 1)
        }
      if (searchValue && perPage && page) {
        const category = await categoryModel
          .find({
            $text: { $search: searchValue },
          })
          .skip(skipPage)
          .limit(perPage)
          .sort({ createdAt: -1 });
        const totalCategory = await categoryModel
          .find({
            $text: { $search: searchValue },
          })
          .countDocuments();
        sendMessage(res, 200, { category, totalCategory });
      } else if (searchValue === "" && perPage && page) {
        const category = await categoryModel
          .find({})
          .skip(skipPage)
          .limit(perPage)
          .sort({ createdAt: -1 });
        const totalCategory = await categoryModel.find({}).countDocuments();
        sendMessage(res, 200, { category, totalCategory });
      } else {
        const category = await categoryModel.find({}).sort({ createdAt: -1 });
        const totalCategory = await categoryModel.find({}).countDocuments();
        sendMessage(res, 200, { category, totalCategory });
      }
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = new categoryController();
