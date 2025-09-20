import Invoice from "../models/invoice.model.js";
import amqp from "amqplib";

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
      const { amount, details, amount_divided_users, created_by,customer_email } = req.body;
      const newInvoice = new Invoice({
        amount,
        details,
        amount_divided_users,
        created_by,
        customer_email
      });
      const savedInvoice = await newInvoice.save();
      await this.piblishInvoiceCreate(savedInvoice); // publish message to RabbitMQ
      return savedInvoice;
    } catch (error) {
      throw error;
    }
  }

  async piblishInvoiceCreate(invoice) {
    try{
      const connection = await amqp.connect("amqp://guest:guest@localhost:5672");
      const channel = await connection.createChannel();
      const queue = "invoice_created_queue";

      await channel.assertQueue(queue, {durable: true});
      const invoiceData = JSON.stringify(invoice);
      channel.sendToQueue(queue,Buffer.from(invoiceData),{persistent:true});
      console.log("Invoice creation message sent to queue");
    }catch(error){
      console.error("Failed to publish invoice creation message:", error);
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