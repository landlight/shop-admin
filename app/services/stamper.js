function stamp(item) {
    item.created_at = new Date(),
    item.updated_at = new Date()
    return item;
}

module.exports = {
    stamp
}