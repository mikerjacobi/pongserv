var playerController = angular.module('playerController', []);

playerController.controller('PlayerCtrl', ['$scope', 'CtrlComms',
    function PlayerCtrl($scope, CtrlComms){
        $scope.init = function(){
            $scope.curr_video = CtrlComms.current_video;
            $scope.playerInit($scope.curr_video);
            $scope.video_index = 0;
        };

        $scope.start_playlist = function(){
            $scope.curr_playlist = CtrlComms.current_playlist;
            alert($scope.curr_playlist.playlist_id);
            if ($scope.curr_playlist.playlist_id != null){
                var videos = Object.keys(JSON.parse($scope.curr_playlist.videos));
                $scope.curr_videos = videos;
                var first_video = videos[$scope.video_index];
                jQuery("#youtube-player-container").tubeplayer("play", first_video);
            }
        };

        $scope.$on('curr_playlist_bc', function(){
            /*
            this function is triggered by playing a playlist
            */

            $scope.start_playlist();
        });

        $scope.$on('curr_video_bc', function(){
            $scope.curr_video = CtrlComms.current_video;
            jQuery("#youtube-player-container").tubeplayer("play", $scope.curr_video);
        });

        $scope.playerInit = function(passed_video){
            jQuery("#youtube-player-container").tubeplayer({
                width: 300,
                height: 300,
                allowFullScreen: "true",
                initialVideo: passed_video, 
                autoPlay: true,
                preferredQuality: "small",
                onPlay: function(id){},
                onPause: function(){},
                onStop: function(){},
                onSeek: function(time){},
                onMute: function(){},
                onPlayerEnded: function(){
                    //TODO increment a play count right here
                    $scope.player_next();
                },
                onUnMute: function(){} 
            });
            $.tubeplayer.defaults.afterReady = function(){
                $scope.start_playlist();
            }
            $.tubeplayer.defaults.loadSWFObject = false;
        };

        $scope.player_next = function(){
            var playlist_len = $scope.curr_videos.length;
            $scope.video_index++;
            if ($scope.video_index >= playlist_len){
                $scope.video_index = 0;
            }
            var curr_video = $scope.curr_videos[$scope.video_index];
            jQuery("#youtube-player-container").tubeplayer("play", curr_video);
        };

        $scope.player_previous = function(){
            var playlist_len = $scope.curr_videos.length;
            $scope.video_index--;
            if ($scope.video_index < 0){
                $scope.video_index = playlist_len - 1;
            }
            var curr_video = $scope.curr_videos[$scope.video_index];
            jQuery("#youtube-player-container").tubeplayer("play", curr_video);
        };

        $scope.player_play = function(){
            jQuery("#youtube-player-container").tubeplayer("play");
        };

        $scope.player_pause = function(){
            jQuery("#youtube-player-container").tubeplayer("pause");
        };



        $scope.init();
    }
]);




