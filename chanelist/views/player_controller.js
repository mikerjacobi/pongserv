var playerController = angular.module('playerController', []);

playerController.controller('PlayerCtrl', ['$scope', 'CtrlComms',
    function PlayerCtrl($scope, CtrlComms){
        $scope.init = function(){
            $scope.curr_video = CtrlComms.current_video;
            $scope.playerInit($scope.curr_video);
            $scope.video_index = 0;
        };

        $scope.start_playlist_from_index = function(index){
            var current_video;
            if (CtrlComms.current_playlist.playlist_id != null){
                var videos = Object.keys(JSON.parse(CtrlComms.current_playlist.videos));
                var video = videos[index];
                current_video = CtrlComms.get_video(video);
                jQuery("#youtube-player-container").tubeplayer("play", video);
            }
            $scope.current_video = current_video;
        };

        $scope.$on('curr_playlist_bc', function(){
            /*
            this function is triggered by playing a playlist
            */
            $scope.video_index = 0;
            $scope.start_playlist_from_index($scope.video_index);
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
                    $scope.$apply(function(){
                        $scope.player_next();
                    });
                },
                onUnMute: function(){} 
            });

            $.tubeplayer.defaults.afterReady = function(){
                $scope.start_playlist_from_index($scope.video_index);
                CtrlComms.signal_player_ready();
            }
            $.tubeplayer.defaults.loadSWFObject = false;
        };

        $scope.player_next = function(){
            var videos = Object.keys(JSON.parse(CtrlComms.current_playlist.videos));
            var playlist_len = videos.length;
            $scope.video_index++;
            if ($scope.video_index >= playlist_len){
                $scope.video_index = 0;
            }
            $scope.start_playlist_from_index($scope.video_index);
        };

        $scope.player_previous = function(){
            var videos = Object.keys(JSON.parse(CtrlComms.current_playlist.videos));
            var playlist_len = videos.length;
            $scope.video_index--;
            if ($scope.video_index < 0){
                $scope.video_index = playlist_len - 1;
            }
            $scope.start_playlist_from_index($scope.video_index);
            //var curr_video = $scope.curr_videos[$scope.video_index];
            //jQuery("#youtube-player-container").tubeplayer("play", curr_video);
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




