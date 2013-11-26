var chanelist = angular.module('chanelist', [
    'commService',
    'playlistController',
    'userController',
    'videoController',
    'playerController',
    'playController',
    'searchController',
    'alertController'
    ]);

chanelist.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/search', {
            templateUrl: 'html/search.html',
            controller: 'SearchCtrl'
        }).
        when('/play', {
            templateUrl: 'html/play.html',
            controller: 'PlayCtrl'
        }).
        when('/play/:playlist_id', {
            templateUrl: 'html/play.html',
            controller: 'PlayCtrl'
        }).
        when('/video', {
            templateUrl: 'html/videos.html',
            controller: 'VideoCtrl'
        }).
        when('/playlist', {
            templateUrl: 'html/playlists.html',
            controller: 'PlaylistCtrl'
        }).
        when('/user', {
            templateUrl: 'html/users.html',
            controller: 'UserCtrl'
        }).

        otherwise({
            redirectTo: '/playlist'
        });
    }
]);
