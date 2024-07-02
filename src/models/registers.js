const mongoose = require("mongoose");
const { default: isEmail } = require("validator/lib/isEmail");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },

  lastname: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: [true, "Email is already Present"],
    validate: [isEmail, 'invalid email']
  },

  gender: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true,
    unique: true,
    maxlength: 10,
    minlength: 10,
  },

  password: {
    type: String,
    required: true,
    min: 4,
  },

  confirmpassword: {
    type: String,
    required: true
  },

  country: {
    type: String,
    required: true
  },

  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
});


// generate jwt token
employeeSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign({ _id: this._id }, "mynameisnishagargfromhindauncitykarauli");  //(unique_id, secreat key)  /// [header].[payload].[signature]
    this.tokens = this.tokens.concat({ token: token })
    console.log("token is " + token);
    await this.save();
    return token;
  } catch (err) {
    throw new Error(err);
    console.log("the error is " + error);
  }
}



//here create middleware to hash password, before save the data in db
employeeSchema.pre("save", async function (next) {
  // console.log(`current password is ${this.password}`);
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  // console.log(`password after hashing is ${this.password}`);

  // Do not store confirmpassword in the database
  // this.confirmpassword = undefined;
  this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10);
  next();
});

// Create collection
const Register = mongoose.model("Register", employeeSchema);

module.exports = Register;
