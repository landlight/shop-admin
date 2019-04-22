var Item = require('../models/Item');

const add = async (req, res) => {
    console.log(req.body, "get here");
    if (!req.body.name){
        
    }
    var item = new Item(req.body);
    item.save()
        .then(item => {
            res.redirect('/');
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
}

module.exports = {
    add
}