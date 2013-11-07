var playController = angular.module('playController', []);

playController.controller('PlayCtrl', ['$scope', 'CtrlComms', '$routeParams',
    function PlayCtrl($scope, CtrlComms, $routeParams) {   
        $scope.init = function(){
            if ($routeParams.playlist_id != null){
                pl = String($routeParams.playlist_id);
                CtrlComms.set_current_playlist(pl);
            }
        };
        $scope.init();

        $scope.$on('curr_playlist_bc', function(){
            $scope.curr_playlist = CtrlComms.current_playlist;
            var videos = JSON.parse($scope.curr_playlist.videos);
            $scope.current_videos = videos;
            $scope.$apply(function(){
                $scope.playlist_id = $scope.curr_playlist.playlist_id;
            });
        });
        

    }
]);


