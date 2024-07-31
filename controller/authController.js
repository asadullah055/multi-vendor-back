const adminModel = require("../models/adminModel");
const sendMessage = require("../utils/response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createToken = require("../utils/tokenCreate");
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
          sendMessage(res, 200, {token, message: "Login success" });
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
  getUer = async(req, res)=>{
    const {id, role}= req
    try {
      if(role === 'admin'){
        const user = await adminModel.findById(id)
        sendMessage(res, 404, { userInfo : user });
      }else{
        console.log('seller info');
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = new authController();
