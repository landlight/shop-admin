var camel = require('./camel');

function getPageSize(req) {
    let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : parseInt(process.env.PAGE_SIZE);
    return {
        pageSize
    };
}

function pageResponse(pageNo, pageSize, result) {
    return {
        pageInformation: {
            page: pageNo,
            size: pageSize,
            numberOfItems: result.length,
        },
        entities: camel.camelCaseObject(result)
    };
}

function getSkipValue(pageNo, pageSize) {
    if (pageNo == 0 || pageNo == 1) {
        return 0;
    } else {
        return (pageNo - 1) * pageSize;
    }
}

function initializePaging(pageNo, pageSize) {
    return {
        pageNo: !pageNo ? 1: parseInt(pageNo),
        pageSize: !pageSize ? 10: parseInt(pageSize),
    }
}

function camelCase(items){
    return camel.camelCaseObject(items);
}

module.exports = {
    getPageSize,
    pageResponse,
    camelCase,
    initializePaging,
    getSkipValue
}