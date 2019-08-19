const _ = require("lodash")
const ObjectId = require('mongodb').ObjectID;

const toCamel = (s) => {
    s = s.replace(/([-_][a-z])/ig, ($1) => {
      return $1.toUpperCase()
        .replace('-', '')
        .replace('_', '');
    });
    return s[0].toLowerCase() + s.substring(1);
};

const isArray = function (a) {
    return Array.isArray(a);
};

const isObject = function (o) {
    return o === Object(o) && !isArray(o) && typeof o !== 'function';
};

const camelCaseObject = function (o) {
    if (isObject(o)) {
      if (!ObjectId.isValid(o) && !(o instanceof Date)){
        const n = {};
        Object.keys(o)
            .forEach((k) => {
            n[toCamel(k)] = camelCaseObject
    (o[k]);
            });
        return n;
      }
    } else if (isArray(o)) {
      return o.map((i) => {
        return camelCaseObject
(i);
      });
    }  
    return o;
};

module.exports = {
    camelCaseObject
}