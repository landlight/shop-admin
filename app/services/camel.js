'use strict';

const _ = require("lodash")

function camelCaseObject(o) {
    console.log(o, "opem");
    let newO, origKey, value
    if (o instanceof Array) {
        newO = []
        for (origKey in o) {
            value = o[origKey]
            if (typeof value === 'object') {
                value = camelCaseObject(value)
            }
            newO.push(value)
        }
    } else {
        newO = {}
        for (origKey in o) {
            if (o.hasOwnProperty(origKey)) {
                newO[_.camelCase(origKey)] = o[origKey]
            }
        }
    }
    return newO
}

module.exports = {
    camelCaseObject
}