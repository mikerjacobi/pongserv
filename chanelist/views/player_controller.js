var playerController = angular.module('playerController', []);

playerController.controller('PlayerCtrl', ['$scope', 'CtrlComms',
    function PlayerCtrl($scope, CtrlComms){
        $scope.init = function(){
            $scope.curr_video = CtrlComms.current_video;
            $scope.youtubeInit($scope.curr_video);
            $scope.soundcloudInit();
            $scope.video_index = 0;
        };

        $scope.start_playlist_from_index = function(index){
            var current_video;
            if (CtrlComms.current_playlist.playlist_id != null){
                var videos = Object.keys(JSON.parse(CtrlComms.current_playlist.videos));
                var video = videos[index];
                current_video = CtrlComms.get_video(video);
                if (current_video.provider == 'soundcloud'){
                    $('#soundcloud-player-container').show();
                    $('#youtube-player-container').hide();
                    $scope.player_pause();
                    var html = current_video.src_url;
                    var iframe = document.querySelector('.iframe');
                    iframe.src = html;
                    var widget = SC.Widget(iframe);
                    widget.bind(SC.Widget.Events.READY, function() {
                        widget.play(true);
                    });
                }
                else if (current_video.provider == 'youtube'){
                    $('#youtube-player-container').show();
                    $('#soundcloud-player-container').hide();
                    var iframe = document.querySelector('.iframe');
                    var widget = SC.Widget(iframe);
                    widget.bind(SC.Widget.Events.READY, function() {
                        widget.pause(true);
                    });
                    jQuery("#youtube-player-container").tubeplayer("play", video);
                }
            }
            $scope.current_video = current_video;
        };

        $scope.$on('curr_playlist_bc', function(){
            /*
            this function is triggered by playing a playlist
            */
            $scope.video_index = 0;
            $scope.start_playlist_from_index($scope.video_index);
            $scope.curr_playlist = CtrlComms.current_playlist;
        });

        $scope.soundcloudInit = function(){
        
        };
        
        $scope.youtubeInit = function(passed_video){
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
                CtrlComms.signal_player_ready();
            }
            $.tubeplayer.defaults.loadSWFObject = false;
        };

        $scope.sc_play = function(){

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




