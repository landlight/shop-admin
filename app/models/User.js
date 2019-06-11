const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

var Users = new Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String   
    },
    role: {
        type: Number,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
}, {
    collection: 'users'
});

Users.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) {return next()};
    bcrypt.hash(user.password,10).then((hashedPassword) => {
        user.password = hashedPassword;
        next();
    })
}, function (err) {
    next(err)
})

Users.methods.comparePassword=function(candidatePassword,next){    
    bcrypt.compare(candidatePassword,this.password,function(err,isMatch){
        if(err) return next(err);
        next(null,isMatch)
    })
}

module.exports = mongoose.model('users', Users);