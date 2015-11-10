var Category = require(__dirname + '/../models/category');

var allCategories = function(cb) {
    Category.find({}).sort([['order', 'ascending']]).exec(function(err, results) {
        cb(err, results);
    });
}

/**
 * name: String
 * type: Number
 * */
var createCategory = function(name, type, order, cb) {
    var cate = new Category({ name: name, type: type, order: order });
    cate.save(function(err, result) {
        if (err) {
            if (err.code === 11000) {
                // duplicated
                var error = new Error("이미 존재하는 카테고리입니다.");
                cb(error, null);
            } else {
                cb(err, null);
            }
        } else {
            cb(null, cate);
        }
    });
}
/**
 * Module exports.
 */

module.exports = {
    createCategory: createCategory,
    allCategories: allCategories
}
