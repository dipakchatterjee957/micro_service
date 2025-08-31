import invoiceService from '../service/invoice.service.js';
import utils from '../utils/utils.js';

export default new class InvoiceController {

    getInvoiceListAll = async (req, res) => {
        try {
            const data = await invoiceService.getInvoiceListAll(req);
            return utils.sendResponse(res, data, true);
        } catch (error) {
            console.error(error);
            return utils.sendResponse(res, null, false);
        }
    };

    createInvoice = async (req, res) => {
    try {
      const data = await invoiceService.createInvoice(req);
      return utils.sendResponse(res, data, true);
    } catch (error) {
      console.error(error);
      return utils.sendResponse(res, null, false);
    }
  };
}
