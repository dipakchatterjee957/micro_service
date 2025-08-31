import Invoice from "../models/invoice.model.js";

export default new class InvoiceService {
  async getInvoiceListAll(req) {
    try {
      const invoices = await Invoice.find().sort({ created_on: -1 }); // latest first
      return invoices;
    } catch (error) {
      throw error;
    }
  }

  async createInvoice(req) {
    try {
      const { amount, details, created_by } = req.body;
      const newInvoice = new Invoice({
        amount,
        details,
        created_by,
      });
      return await newInvoice.save();
    } catch (error) {
      throw error;
    }
  }
};