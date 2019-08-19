const db = require('../../database');
const ObjectId = require('mongodb').ObjectID;

function manageProductTag(productId, tag, isTag) {
    return new Promise((resolve, reject) => {
        try {  
            let productCollection = db.get().collection('products');
            let query = {_id: ObjectId(productId)};
            productCollection.findOne(
                query, 
                (err, post) => {
                    console.log(post);
                    if (err) {
                        return reject(err);
                    }
                    if (!post) {
                        return reject('Product not found');
                    }
                    let updateQuery = {};
                    let description = '';
                    if (isTag) {
                        updateQuery = {$addToSet: {tags: tag}};
                        description = 'add';
                    } else {
                        updateQuery = {$pull: {tags: tag}};
                        description = 'delete'
                    }
                    productCollection.updateOne(
                        query,
                        updateQuery,
                        {upsert: false},
                        (err, updated) => {
                            if (err) {
                                return reject(err);
                            }
                            if (updated.modifiedCount != 1) {
                                return reject(`${description} tag failed`);
                            }
                            return resolve('success');
                        }
                    )
                })
        } catch (err) {
            return reject(err);
        }
    })
}

module.exports = {
    manageProductTag
}