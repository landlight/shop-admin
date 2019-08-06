function IsRequired(item) {
    return {
        code : 400,
        error: `${item} is required`
    }
}

function NotFound(item) {
    return {
        code : 400,
        error: `${item} not found`
    }
}

function Invalidate(){
    return {
        code: 401, 
        error: `username or password is incorrect`
    }
}

function NotAuthorized() {
    return {
        code: 401,
        error: `not authorized`
    }
}

function IsNotObject(item, type) {
    return {
        code: 400,
        error: `${item} must be type: ${type}`
    }
}

function OutOfBound(item, start, end) {
    return {
        code: 400,
        error: `${item} must be between ${start} and ${end}`
    }
}

function AtLeast(item, length){
    return {
        code: 400, 
        error: `${item} length must be at least ${length}`
    }
}

function DefaultError(error, res) {
    let errMessage = !error.message? error: error.message;
    return res.status(500).json({message: errMessage});
}

module.exports = {
    IsRequired,
    DefaultError,
    NotFound,
    NotAuthorized,
    IsNotObject,
    OutOfBound,
    AtLeast,
    Invalidate
}