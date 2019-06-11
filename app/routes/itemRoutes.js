var itemController = require('../controllers/itemController')

var express = require('express');
var itemRouter = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb){
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

const upload = multer({storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5       
    },
    fileFilter: fileFilter
});

itemRouter.use(upload.single('productImage')).route('/')
    .post(itemController.add);

itemRouter.route('/')
    .get(itemController.get);

itemRouter.route('/search')
    .get(itemController.search);

itemRouter.route('/getByCategory')
          .post(itemController.getItemsByCategory);

module.exports = itemRouter;