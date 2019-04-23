function NotFound(item) {
    return {
        error: `${item} is required`
    }
}

function NotAuthorized() {
    return {
        error: `not authorized`
    }
}

function IsNotObject(item, type) {
    return {
        error: `${item} must be type: ${type}`
    }
}

function OutOfBound(item, start, end) {
    return {
        error: `${item} must be between ${start} and ${end}`
    }
}

module.exports = {
    NotFound,
    NotAuthorized,
    IsNotObject,
    OutOfBound
}