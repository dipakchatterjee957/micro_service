import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const InvoiceSchema = new mongoose.Schema({
  invoice_number: { type: Number, unique: true },
  amount: { type: Number, required: true },
  details: { type: String, required: true },
  amount_divided_users: { type: Array, default: [] },
  created_by: { type: Number, required: true },
  created_on: { type: Date, default: Date.now }, // auto timestamp
});

// Auto Increment
const AutoIncrement = AutoIncrementFactory(mongoose);
InvoiceSchema.plugin(AutoIncrement, { inc_field: "invoice_number" });

const Invoice = mongoose.model("Invoice", InvoiceSchema);

export default Invoice;