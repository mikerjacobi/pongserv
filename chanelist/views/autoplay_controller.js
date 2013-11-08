var playController = angular.module('playController', []);

playController.controller('PlayCtrl', ['$scope', 'CtrlComms', '$routeParams',
    function PlayCtrl($scope, CtrlComms, $routeParams) {   
        $scope.init = function(){
            if ($routeParams.playlist_id != null){
                pl = $routeParams.playlist_id;
                CtrlComms.set_current_playlist(pl);
            }
            //$scope.get_videos();
        };

        $scope.$on('curr_playlist_bc', function(){
            $scope.get_videos();
        });

        $scope.$on('player_ready_bc', function(){
            $scope.get_videos();
        });

        $scope.get_videos = function(){
            $scope.curr_playlist = CtrlComms.current_playlist;
            var videos = Object.keys(JSON.parse($scope.curr_playlist.videos));
            var vid_list = [];
            for (i in videos){
                var video_id = videos[i];
                var vid = $scope.get_video(video_id);
                vid_list.push(vid);
            }
            $scope.$apply(function(){
                $scope.current_videos = vid_list;
            });
            //$scope.playlist_id = $scope.curr_playlist.playlist_id;
        };

        $scope.get_video = function(video_id){
            var url = '/video/'+video_id;
            var resp;
            
            $.ajax({
                async:false,
                type:'GET',
                dataType:'json',
                url:url,
                success: function(data){
                    if (data.success == 1){
                        var curr_data = JSON.parse(data.data);
                        resp = curr_data;
                    }
                    else{
                        alert(data.error);
                    }
                },
                error: function(resp, b, error){
                    alert(resp.responseText+'</br>'+error);
                }
            });
            return resp;
        };
            

        $scope.init();
    }
]);


