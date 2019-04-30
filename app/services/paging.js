var camel_case = require('../services/camel');

function getPageSize(req){
    let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : parseInt(process.env.PAGE_SIZE);
    return {
        pageSize
    };
}

function pageResponse(pageSize, result, nextPageId) {
    return {
        pageInformation: {
            size: pageSize,
            numberOfItems: result.length,
            nextPageId
        },
        entities: camel_case.camelCaseObject(result)
    };
}

module.exports = {
    getPageSize,
    pageResponse
}