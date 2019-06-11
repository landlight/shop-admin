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
        let item = results[i].toObject()
        if (item.password){
            delete item.password;
        }
        items.push(item);
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