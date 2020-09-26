const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
// const mongoosePaginate = require('mongoose-paginate-v2')

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: 'EMAIL_IS_NOT_VALID'
      },
      lowercase: true,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true,
      // select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    mobile_number: {
      type: String
    },
    is_active: {
      type: Boolean,
      required: true, 
      default: 0
  	},
  },
  {
    versionKey: false,
    timestamps: true
  }
)

module.exports = mongoose.model('User', UserSchema)