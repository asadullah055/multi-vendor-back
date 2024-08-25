const sellerModel = require("../../models/sellerModel");
const sendMessage = require("../../utils/response");

class sellerController {
  get_seller_request = async (req, res) => {
    const { perPage, page, searchValue } = req.query;
    const skipPage = parseInt(perPage) * (parseInt(page) - 1);
    try {
      const sellers = await sellerModel
        .find({ status: "pending" })
        .skip(skipPage)
        .limit(perPage)
        .sort({ createdAt: -1 });
      const totalSeller = await sellerModel
        .find({ status: "pending" })
        .countDocuments();
      sendMessage(res, 200, { sellers, totalSeller });
    } catch (error) {
      sendMessage(res, 500, { error: error.message });
    }
  };
  get_seller = async (req, res) => {
    const { sellerId } = req.params;

    try {
      const seller = await sellerModel.findById(sellerId);

      sendMessage(res, 200, { seller });
    } catch (error) {
      sendMessage(res, 500, { error: error.message });
    }
  };
  seller_status_update = async (req, res) => {
    const { sellerId, status } = req.body;
    
    try {
      await sellerModel.findByIdAndUpdate(sellerId, {
        status,
      });
      const seller = await sellerModel.findById(sellerId);
      sendMessage(res, 200, {
        seller,
        message: "seller status update success",
      });
    } catch (error) {
      console.log(error);

      sendMessage(res, 500, { error: error.message });
    }
  };
}

module.exports = new sellerController();
