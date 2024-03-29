'use strict';

angular.module('TweetReaderApp')
    .controller('MainCtrl', ['$scope', 'Tweets', 'Restangular', function ($scope, Tweets, Restangular) {
        $scope.data = Tweets.get();

        $scope.markAsRead = function (tweet) {
            console.log("beginning PUT");
            var tmpTweet = Restangular.copy(tweet);

            tweet.markAsReadInProgress = true;
            tmpTweet.metadata.read = !tweet.metadata.read;
            tmpTweet.put().then( function () {
                console.log("PUT OK");
                tweet.markAsReadInProgress = false;
                tweet.markAsReadError = false;
                tweet.metadata.read = tmpTweet.metadata.read;
            }, function () {
                tweet.markAsReadInProgress = false;
                tweet.markAsReadError = true;
            });
        };

        $scope.retweet = function (tweet) {
            tweet.metadata.retweeted = true;
            tweet.metadata.read = true;
            tweet.metadata.interesting = true;
            tweet.put();
        };

        $scope.retweetAsRT = function (tweet) {
            $scope.markAsInteresting(tweet);
            Tweets.create("RT @" + tweet.twitterData.user.pseudo + " " + tweet.twitterData.text);
        };

        $scope.markAsInteresting = function (tweet) {
            tweet.metadata.interesting = true;
            tweet.metadata.read = true;
            tweet.put();
        };

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
