const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {    
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    surname : {
      type: String,
      required: true
    }, 
    creator: {
      type:Schema.Types.ObjectId,
      ref:'User',
      required:true
    }
  } 
  ,
  { timestamps: true }  
);

module.exports = mongoose.model('Contact', contactSchema);
