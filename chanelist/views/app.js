var chanelist = angular.module('chanelist', [
    'commService',
    'playlistController',
    'userController',
    'videoController',
    'playerController'
]);

chanelist.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
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
