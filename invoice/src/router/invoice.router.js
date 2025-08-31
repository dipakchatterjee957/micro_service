import express from 'express';
import invoiceController from '../controller/invoice.controller.js';

const invoiceRouter =  express.Router();

invoiceRouter.get(`/getInvoiceListAll`, invoiceController.getInvoiceListAll);
invoiceRouter.post(`/createInvoice`, invoiceController.createInvoice);

export default invoiceRouter;