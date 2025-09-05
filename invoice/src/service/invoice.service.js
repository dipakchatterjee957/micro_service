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

  async getInvoiceById(req) {
    try {
      const { id } = req.params;
      const invoice = await Invoice.findById(id);
      return invoice;
    } catch (error) {
      throw error;
    }
  }

  async createInvoice(req) {
    try {
      const { amount, details, amount_divided_users, created_by } = req.body;
      const newInvoice = new Invoice({
        amount,
        details,
        amount_divided_users,
        created_by,
      });
      return await newInvoice.save();
    } catch (error) {
      throw error;
    }
  }

  async updateInvoiceById(req) {
    try {
      const { id } = req.params;  
      const { amount, details } = req.body;
      const updatedInvoice = await Invoice.findByIdAndUpdate(
        id,
        { amount, details },
        { new: true } // return the updated document
      );
      return updatedInvoice;
    } catch (error) {
      throw error;
    }
  }

  async deleteInvoiceById(req) {
    try {
      const { id } = req.params;
      const deletedInvoice = await Invoice.findByIdAndDelete(id);
      return deletedInvoice;
    } catch (error) {
      throw error;
    }
  }

};