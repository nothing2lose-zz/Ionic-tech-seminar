var Room = require('../models/rooms');

var allRoomsByCategoryType = function (categoryType, startAt, limit, cb) {
    var query = {};
    if (categoryType) { query.cate_type = categoryType; }
    if (startAt) { query.created = { "$lt": startAt } }

    var cursor = Room.find(query).sort([[ 'created', 'descending']]);
    if (limit) { cursor = cursor.limit(limit) }
    cursor.exec(function(err, results) {
        cb(err, results);
    });
}

var createRoom = function(name, url, categoryType, authorId, cb) {
    var room = new Room({ name: name, url: url, author_id: authorId});
    if (categoryType) {
        room.cate_type = categoryType;
    }
    room.save(function(err, result) {
        if (err) {
            if (err.code === 11000) {
                // duplicated
                var error = new Error("이미 존재하는 링크입니다.");
                cb(error, null);
            } else {
                cb(err, null);
            }
        } else {
            cb(null, room);
        }
    });
}

var removeRoom = function(roomId, cb) {
    Room.remove({_id: roomId}).exec(function (err, result) {
        cb(err, result);
    });
}

/**
 * Module exports.
 */

module.exports = {
    createRoom: createRoom,
    removeRoom: removeRoom,
    allRoomsByCategoryType: allRoomsByCategoryType,
}
