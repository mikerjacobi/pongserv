var chanelist = angular.module('chanelist', [
    'commService',
    'playlistController',
    'userController',
    'videoController',
    'playerController',
    'playController'
]);

chanelist.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
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
