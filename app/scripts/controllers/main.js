'use strict';

angular.module('TweetReaderApp')
    .controller('MainCtrl', ['$scope', 'Tweets', function ($scope, Tweets) {
        $scope.data = Tweets.get();

        $scope.markAsRead = function (tweet) {
            tweet.metadata.read = !tweet.metadata.read;
            tweet.put();
        };

        $scope.getReadLabel = function (tweet) {
            if (tweet.metadata.read) return "Mark as unread";
            else return "Mark as read";
        }

    }])
    .controller('LoginCtrl', ['$scope', '$http', 'Restangular', 'localStorageService', 'Tweets',
                function ($scope, $http, Restangular, localStorageService, Tweets) {
        $scope.isLoggedIn = false;
        $scope.serverUrl = localStorageService.get("serverUrl") || "/url";
        $scope.authToken = localStorageService.get("authToken") || "auth token";

        function checkLogin () {
            console.log("checking login");
            localStorageService.set("serverUrl", $scope.serverUrl);
            localStorageService.set("authToken", $scope.authToken);

            $http({method: 'GET', url: $scope.serverUrl, params: { auth_token: $scope.authToken }}).
                success(function(data, status, headers, config) {
                    Restangular.setBaseUrl($scope.serverUrl);
                    Restangular.setDefaultRequestParams({"auth_token": $scope.authToken});
                    Tweets.refresh();
                    $scope.isLoggedIn = true;
                }).
                error(function(data, status, headers, config) {
                    $scope.isLoggedIn = false;
                });
        }
        $scope.checkLogin = checkLogin;

        $scope.loginOpts = {
            backdropFade: true,
            dialogFade: true,
            backdropClick: false
        };

        checkLogin();
    }]);
