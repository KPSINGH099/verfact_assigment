
const mongoose = require('mongoose');

// Map the string "ObjectId" to the actual Mongoose Schema Type

const formatSchema = (obj) => {
  for (let key in obj) {
    if (obj[key].type === 'ObjectId') {
      obj[key].type = mongoose.Schema.Types.ObjectId;
    }
  }
  return obj;
};

module.exports={
    formatSchema
}