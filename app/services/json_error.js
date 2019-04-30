function NotFound(item) {
    return {
        code : 400,
        error: `${item} is required`
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

module.exports = {
    NotFound,
    NotAuthorized,
    IsNotObject,
    OutOfBound,
    AtLeast
}