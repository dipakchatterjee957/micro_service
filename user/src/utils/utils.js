const sendResponse = (res, data, status, message = null) => {
    return res.status(200).send({
        status: status == true ? true : false,
        success: status == true ? 'Success' : 'Failure',
        message: message,
        response: data
    })
}

const getCurrentDateTime = () => {
    let now = new Date();
    let date = now.toISOString();
    let time = now.toTimeString();
    let dateTime = date.slice(0, date.indexOf('T')) + ' ' + time.split(" ")[0];
    return dateTime;
}

const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

const convertToDateTime = (date) => {
    let now = new Date(date);
    let dateConvarted = now.toISOString().replace('T', ' ').split('.')[0];
    return date ? dateConvarted : null;
}

const convertToDate = (date) => {
    let now = new Date(date);
    let dateConvarted = now.toISOString().split('T')[0];
    return date ? dateConvarted : null;
}

const convertArrayDateField = (array, ...item) => {
    array.forEach(i => {
        for (let x = 0; x < item.length; x++) {
            i[item[x]] = i[item[x]] ? convertToDate(i[item[x]]) : null;
        }
    });
    // return array;
}
const convertArrayDateTimeField = (array, ...item) => {
    array.forEach(i => {
        for (let x = 0; x < item.length; x++) {
            i[item[x]] = i[item[x]] ? convertToDateTime(i[item[x]]) : null;
        }
    });
    // return array;
}

const formatDateDDMMYYYY = (timestamp) => {
    const date = new Date(timestamp); // Convert timestamp to Date object

    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with 0 if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, pad with 0
    const year = date.getFullYear(); // Get full year

    return `${day}-${month}-${year}`; // Return formatted date
}

export default {
    sendResponse,
    getCurrentDateTime,
    catchAsync,
    convertToDateTime,
    convertToDate,
    convertArrayDateField,
    convertArrayDateTimeField,
    formatDateDDMMYYYY
};