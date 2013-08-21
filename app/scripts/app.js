'use strict';

angular.module('TweetReaderApp', ['restangular', 'LocalStorageModule'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  .filter('parseUrl', function () {
    return function ( input ) {
        return input.replace( /(https?:\/\/[^\s]+)/gi , '<a href="$1">$1</a>');
    }
  })
  // from http://stackoverflow.com/questions/16397707/angularjs-directive-to-replace-text-with-ng-click-in-it
  // Would be cleaner as a directive
  .filter('parseUrlFilter', function() {
        var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi;
        return function(text, target) {
            angular.forEach(text.match(urlPattern), function(url) {
                text = text.replace(url, "<a target=\"" + target + "\" href="+ url + ">" + url +"</a>");
            });
            return text;
        };
  })
  .service('Tweets', [ 'Restangular', function(Restangular) {

       var data = { tweets: [] };

       var Tweets = {
           get: function () {
               return data;
           },

           refresh: function () {
               console.log("refreshing tweets");
               data.tweets = Restangular.all('tweets').getList({read: false});

               data.tweets.then( function(tweets) {
                   console.log("fetched " + tweets.length + " tweets");
               });
           },

           create: function (text) {
               console.log("creating tweet: " + text);
               Restangular.all('tweets').post({text: text});
           }
       };

       Tweets.refresh();

       return Tweets;
    }]);
