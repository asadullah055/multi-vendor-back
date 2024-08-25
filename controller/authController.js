const adminModel = require("../models/adminModel");
const sendMessage = require("../utils/response");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const createToken = require("../utils/tokenCreate");
const sellerModel = require("../models/sellerModel");
const sellerCustomerModel = require("../models/chat/sellerCustomerModel");
const formidable = require("formidable");
class authController {
  admin_login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const admin = await adminModel
        .findOne({ email: email })
        .select("+password");
      if (admin) {
        const match = await bcrypt.compare(password, admin.password);
        if (match) {
          const token = await createToken({
            id: admin.id,
            role: admin.role,
          });
          res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
          sendMessage(res, 200, { token, message: "Login success" });
        } else {
          sendMessage(res, 404, { error: "Password dose not match" });
        }
      } else {
        sendMessage(res, 404, { error: "email not found" });
      }
    } catch (error) {
      sendMessage(res, 500, { error: error.message });
    }
  };
  getUer = async (req, res) => {
    const { id, role } = req;
    try {
      if (role === "admin") {
        const user = await adminModel.findById(id);
        sendMessage(res, 200, { userInfo: user });
      } else {
        const seller = await sellerModel.findById(id);
        sendMessage(res, 200, { userInfo: seller });
      }
    } catch (error) {
      sendMessage(res, 500, { error: "Internal server error" });
    }
  };
  seller_register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const getUer = await sellerModel.findOne({ email });
      if (getUer) {
        sendMessage(res, 404, { error: "Email Already Exit" });
      } else {
        const seller = await sellerModel.create({
          name,
          email,
          password: await bcrypt.hash(password, 10),
          method: "manually",
          shopeInfo: {},
        });
        await sellerCustomerModel.create({
          myId: seller.id,
        });
        const token = await createToken({ id: seller.id, role: seller.role });
        res.cookie("accessToken", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        sendMessage(res, 201, { token, message: "register success" });
      }
    } catch (error) {
      sendMessage(res, 500, { error: "Internal server error" });
    }
  };
  seller_login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const seller = await sellerModel
        .findOne({ email: email })
        .select("+password");
      if (seller) {
        const match = await bcrypt.compare(password, seller.password);
        if (match) {
          const token = await createToken({
            id: seller.id,
            role: seller.role,
          });
          res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
          sendMessage(res, 200, { token, message: "Login success" });
        } else {
          sendMessage(res, 404, { error: "Password dose not match" });
        }
      } else {
        sendMessage(res, 404, { error: "email not found" });
      }
    } catch (error) {
      sendMessage(res, 500, { error: error.message });
    }
  };
  profile_image_upload = async (req, res) => {
    const { id } = req;

    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      try {
        cloudinary.config({
          cloud_name: process.env.cloud_name,
          api_key: process.env.api_key,
          api_secret: process.env.secrete_key,
          secure: true,
        });
        const { image } = files;
        const result = await cloudinary.uploader.upload(image.filepath, {
          folder: "profiles",
        });

        if (result) {
          await sellerModel.findByIdAndUpdate(id, {
            image: result.url,
          });
          const userInfo = await sellerModel.findById(id);
          sendMessage(res, 200, {
            userInfo,
            message: "image upload success",
          });
        } else {
          sendMessage(res, 404, { error: "image upload failed" });
        }
      } catch (error) {
        sendMessage(res, 500, { error: error.message });
      }
    });
  };
  profile_info_add = async (req, res) => {
    const { division, district, shopName, sub_district } = req.body;
    const { id } = req;

    try {
      await sellerModel.findByIdAndUpdate(id, {
        shopeInfo: {
          division,
          district,
          shopName,
          sub_district,
        },
      });
      const userInfo = await sellerModel.findById(id);
      sendMessage(res, 200, {
        userInfo,
        message: "Profile info add success",
      });
    } catch (error) {
      sendMessage(res, 500, { error: error.message });
    }
  };
}

module.exports = new authController();
