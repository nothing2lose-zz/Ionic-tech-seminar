// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('app.rooms', {
    url: '/rooms',
    views: {
      'menuContent': {
        cache: false,
        templateUrl: 'templates/rooms.html',
        controller: 'RoomsCtrl'
      }
    }
  })
  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/rooms');
});


angular.module('starter.services', [])
// global alert
.factory('AlertView', function($ionicPopup, $rootScope, $timeout) {
  var show = function(msg, $scope) {
    $scope = $scope || $rootScope.$new();
    console.log(msg);
    var alert = $ionicPopup.alert({
      scope: $scope,
      title: msg,
      animation: 'slide-in-up'
    });
    alert.then(function(modal) {
      $scope.modal = modal;
      return modal;
    });
    $timeout(function() {
      alert.close();
    }, 1000);
  }

  return { show: show};
})

// API
.factory('apiService', function ($http) {
  var cachedItems = [];
  var lastItem = function () {
    if (cachedItems.length > 0) {
      return cachedItems[cachedItems.length - 1]
    }
    return {}
  }
  var basePath = "http://openchat.kr.pe:4000";
  var myService = {
    reset: function() {
      cachedItems.length = 0;
    },
    items: function () {
      return cachedItems;
    },
    getCategories: function() {
      var promise = $http.get(basePath + '/api/categories').then(function (response) {
        return response.data;
      });
      return promise;
    },
    getRooms: function(categoryType, limit) {
      var last = lastItem();
      //console.log("====== last");
      //console.log(last);
      var promise;
      //if ( !promise ) {
      // $http returns a promise, which has a then function, which also returns a promise
      promise = $http.get(basePath + '/api/rooms',{ params: { category_type: categoryType, start_at: last.created, limit: limit  } }).then(function (response) {
        // The then function here is an opportunity to modify the response
        //console.log(response);
        // The return value gets picked up by the then in the controller.
        //cachedItems = response.data;
        cachedItems = cachedItems.concat(response.data);
        return response.data;
      });
      //}
      // Return the promise to the controller
      return promise;
    },
    postRoom: function(name, url, categoryType, userId) {
      var promise = $http.post(basePath + '/api/rooms', { name: name, url: url, category_type: categoryType, author_id: userId }).then(function (response) {
        cachedItems.insert(0, response.data);
        return response.data;
      });
      return promise;
    },
    deleteRoom: function(room) {
      var promise = $http.delete(basePath + '/api/rooms/' + room._id).then(function (response) {
        var index = cachedItems.indexOf(room)
        cachedItems.splice(index, 1);
        return response.data;
      });
      return promise;
    }
  };
  return myService;
})

// Kakao
.factory('kakaoService', function($rootScope) {
  Kakao.init('8e733c4e965021e9c7775cf635eba63f');
  var local = { authorized : false, userInfo : {} };
  var authorized = function () { return local.authorized };
  var setAuthorized = function ( isAuthorized ) {
    local.authorized = isAuthorized;
    $rootScope.$broadcast("didChangeAuthState", isAuthorized);
  }
  var userInfo = function() { return local.userInfo };

  var svc = {
    authorized: authorized,
    userInfo: userInfo,
    auth: function(cb) {
      Kakao.Auth.login({
        persistAccessToken: true,
        persistRefreshToken: true,
        success: function (authObj) {
          console.log(JSON.stringify(authObj, null, 4));
          cb(null, authObj);
        },
        fail: function (err) {
          alert(JSON.stringify(err))
          cb(err, null);
        }
      });
    },
    logout: function(cb) {
      Kakao.Auth.logout(function(){
        setAuthorized(false);
        console.log("-- logout");
        cb(null, null);
      });
    },
    getUserInfo: function(cb) {
      Kakao.API.request({
        url: "/v1/user/me",
        success: function(info) {
          local.userInfo = info;
          setAuthorized(true);
          //console.log("user nfo ----");
          //console.log(local.userInfo);
          cb(null, info);
        },
        fail: function(err) {
          cb(err, null);
        }
      });
    }
  };
  return svc;
});
