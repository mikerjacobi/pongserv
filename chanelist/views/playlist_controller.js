
var playlistController = angular.module('playlistController', []);

playlistController.controller('PlaylistCtrl', ['$scope', 'CtrlComms', 
    function PlaylistCtrl($scope, CtrlComms) {
        $scope.user_playlists = [];
        $scope.current_playlist_name='';
        $scope.current_playlist_vids=[];
        $scope.alert_msg = '';

        $scope.init = function(){
            $scope.user_playlists = CtrlComms.get_user_playlists();
        };

        $scope.play_playlist = function(playlist_id){
            CtrlComms.set_current_playlist(playlist_id);
        };
        
        $scope.show_playlist = function(playlist_id){
            $scope.alert_msg = '';
            var pl = CtrlComms.get_playlist(playlist_id);
            $scope.current_playlist_name = pl.playlist_name;
            $scope.current_playlist_vids = [];
            var vids = JSON.parse(pl.videos);
            for (video_id in vids){
                $scope.current_playlist_vids.push(CtrlComms.get_video(video_id));   
            }
            if ($scope.current_playlist_vids.length == 0){
                var msg = 'no videos added to this playlist.';
                $scope.alert_msg = msg;
            }
        };

        $scope.add_playlist = function(){

            var current_user = CtrlComms.current_user;
            var url = '/playlist';
            var payload = {
                'playlist_name':$( "#playlist_name" ).val(),
                'username':current_user.username,
                'hashword':current_user.password
            };

            $.ajax({
                type:'POST',
                url:url,
                dataType:'json',
                data:payload,
                success: function(data){
                    if (data.success == 1){
                        var new_playlist = JSON.parse(data.data);
                        //CtrlComms.append_playlist(new_playlist);
                        CtrlComms.playlists.push(new_playlist);
                        $scope.$apply(function(){
                            $scope.user_playlists.push(new_playlist);
                        });
                        CtrlComms.add_alert('success', 'created playlist: '+new_playlist.playlist_id);

                    }
                    else {CtrlComms.add_alert('error', data.error);}
                    
                },
                error: function(resp,b,error){
                    var msg = resp.responseText+': '+error;
                    CtrlComms.add_alert('error', msg);
                }
                
            });
        };
        
        $scope.init();
    }
]);



