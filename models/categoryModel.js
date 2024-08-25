const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    
    image: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    
  },
  { timestamps: true, versionKey: false }
);

categorySchema.index({
    name: 'text'
})
module.exports = model("categorys", categorySchema);
