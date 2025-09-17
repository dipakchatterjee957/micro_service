import mongoose from "mongoose";

const userLoginEventSchema = new mongoose.Schema(
  {
    user_master_id: { type: Number, required: true },
    login_id: { type: String, required: true },
    login_count: { type: Number, default: 1 },
    last_login_time: { type: Date, default: Date.now },
  },
  { collection: 'user_login_event' } // explicit collection name
);

export default mongoose.model('UserLoginEvent', userLoginEventSchema);
