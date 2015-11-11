//var server = require('./bin/www');
//var Category = require('./models/category');

var categoryCtrl = require('./controllers/category');

var menus = [
    { "name": "전체보기",   type:0 , order: 0 },
    { "name": "잡담",     type:100, order: 1 },
    { "name": "친목",     type:101, order: 2 },
    { "name": "정치",     type:105, order: 3 },
    { "name": "사회",     type:110, order: 4 },
    { "name": "연예",     type:115, order: 5 },
    { "name": "이슈",     type:120, order: 6 },
    { "name": "뉴스",     type:125, order: 7 },
    { "name": "기타",    type:3000, order: 8 } // warning! '3000' default value hardcoded on `rooms` schema.
]



for (var index in menus) {
    var menu = menus[index];
    (function(name, type, order) {
        categoryCtrl.createCategory(name, type, order,  function(err, result) {
            if (err) {
                //console.log("실패한 결과가 있네요.");
            }
        });
    })(menu.name, menu.type, menu.order)
}


