import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, default: '' },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel