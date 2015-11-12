
/* WARNNING prototype... */
Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};


angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, kakaoService, AlertView) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Open the login modal
  $scope.login = function() {
    //$scope.modal.show();

    // kakao auth
    kakaoService.auth(function(err, result) {
      if (null === err && result) {
        $scope.authorized = true;
        if (!$scope.$$phase) $scope.$apply();
        if (result) {
          AlertView.show("로그인 성공");
          console.log("login sucess!!");
        } else {
          AlertView.show("로그인 실팽...");
        }
        kakaoService.getUserInfo(function(err, result){
          if (result) {

          }
        });
      }
      console.log("kakao login result");
      console.log(result);
    })
  };

  $scope.didLogin = function () {
    return kakaoService.authorized();
  }

})


.controller('RoomsCtrl', function($scope, $rootScope, $ionicPopup, $ionicModal, $timeout, apiService, kakaoService, AlertView) {
  $scope.rooms = [];
  $scope.room = {}; // create form


  <!-- ************ initialize ************ -->
  $scope.$on('$ionicView.enter', function(e) {
    $scope.loadRooms();
  });


  <!--  -->
  $scope.loadRooms = function (cb) {
    apiService.getRooms().then(function (data) {
      $scope.rooms = apiService.items()
      console.log(data);
      if (cb) {
        cb()
      }
    });
  };

  <!-- ************ refersh rooms ************ -->
  $scope.doRefresh = function() {
    $scope.loadRooms(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  <!-- ************ delete room ************ -->
  $scope.isMyRoom = function(index) {
    var room = $scope.rooms[index];
    if (kakaoService.authorized()) {
      var userInfo = kakaoService.userInfo();
      return room.author_id === userInfo["id"];
    } else {
      return false;
    }
  }

  $scope.doDeleteRoom = function (index) {
    if (true !== $scope.isMyRoom(index)) {
      AlertView.show("내 소유권한 아님염");
      return;
    }
    var room = $scope.rooms[index];
    apiService.deleteRoom(room).then(function (result) {

      AlertView.show("삭제 성공!");
      $scope.loadRooms(); // 멍청한 reload
    }, function (err) {
      AlertView.show("삭제 실패!");
    });
  }


  <!-- ************ create room ************ -->
  $ionicModal.fromTemplateUrl('templates/createRoom.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.showCreateRoomView = function() {
    var userInfo = kakaoService.userInfo();
    var userId = userInfo.id;
    if (!userId) {
      AlertView.show("로그인을 먼저 해주세요");
      return;
    }

    $scope.modal.show()
  }

  $scope.hideCreateRoomView = function() {
    $scope.modal.hide();
  };

  $scope.doCreateRoom = function() {
    console.log('Doing createRoom', $scope.room);
    var userInfo = kakaoService.userInfo();
    var userId = userInfo.id;
    if (!userId) {
      AlertView.show("로그인을 먼저 해주세요");
      $scope.hideCreateRoomView()
      return;
    }
    console.log("==== userid : " + userId);
    console.log($scope.room);
    //apiService.postRoom($scope.form.name, $scope.form.url, $scope.selectedCategory.type, userId).then(
    apiService.postRoom($scope.room.name, $scope.room.url, 0, userId).then(
      function(result){
        $scope.hideCreateRoomView()
        //$rootScope.$broadcast("didChangeRoomData");
        $scope.loadRooms();
        console.log("success!");
      },
      function (err) {
        AlertView.show(JSON.stringify(err.data));
        //$scope.hideCreateRoomView()
        console.log("====== fail to create!");
      });

  };


})
