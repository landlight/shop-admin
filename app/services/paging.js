const camelcaseKeys = require('camelcase-keys');

function getPageSize(req){
    let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : parseInt(process.env.PAGE_SIZE);
    return {
        pageSize
    };
}

function pageResponse(pageSize, results, nextPageId) {
    items = []
    for(let i in results){
        items.push(results[i].toObject());
    }
    return {
        pageInformation: {
            size: pageSize,
            numberOfItems: results.length,
            nextPageId
        },
        entities: camelcaseKeys(items)
    };
}

module.exports = {
    getPageSize,
    pageResponse
}