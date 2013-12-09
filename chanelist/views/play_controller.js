var playController = angular.module('playController', []);

playController.controller('PlayCtrl', ['$scope', 'CtrlComms', '$routeParams',
    function PlayCtrl($scope, CtrlComms, $routeParams) {   
        $scope.current_videos = [];
        $scope.curr_playlist = {};

        $scope.init = function(){
            if ($routeParams.playlist_id != null){
                pl = $routeParams.playlist_id;
                CtrlComms.set_current_playlist(pl);
            }
            $scope.get_current_videos();
        };

        $scope.get_current_videos = function(){
            $scope.current_videos = [];
            var video_ids = JSON.parse(CtrlComms.current_playlist.videos);
            for (video_id in video_ids){
                $scope.current_videos.push(CtrlComms.get_video(video_id));
            }
        };

        $scope.init();
    }
]);


