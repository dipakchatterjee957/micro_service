import express from 'express';
import invoiceController from '../controller/invoice.controller.js';

const invoiceRouter =  express.Router();

invoiceRouter.get(`/getInvoiceListAll`, invoiceController.getInvoiceListAll);
invoiceRouter.post(`/createInvoice`, invoiceController.createInvoice);
invoiceRouter.get(`/getInvoiceById/:id`, invoiceController.getInvoiceById);
invoiceRouter.put(`/updateInvoiceById/:id`, invoiceController.updateInvoiceById);
invoiceRouter.delete(`/deleteInvoiceById/:id`, invoiceController.deleteInvoiceById);

export default invoiceRouter;