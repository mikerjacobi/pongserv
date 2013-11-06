
var playlistController = angular.module('playlistController', []);

playlistController.controller('PlaylistCtrl', ['$scope', 'CtrlComms', 
    function PlaylistCtrl($scope, CtrlComms) {
        $scope.current_playlists = [];

        $scope.init = function(){
            $scope.current_user = CtrlComms.current_user;
            $scope.current_playlists = CtrlComms.current_playlists;
        };

        $scope.init();

        $scope.playPlaylist = function(passed_playlist){
            CtrlComms.set_current_playlist(passed_playlist);
        };

        $scope.addPlaylist = function(){

            $scope.current_user = CtrlComms.current_user;

            var url = '/playlist';
            var payload = {
                'playlist_name':$( "#playlist_name" ).val(),
                'username':$scope.current_user.username,
                'hashword':$scope.current_user.password
            };

            $.ajax({
                type:'POST',
                url:url,
                dataType:'json',
                data:payload,
                success: function(data){
                    if (data.success == 1)
                    {
                        $scope.$apply(function(){
                            var new_pl = JSON.parse(data.data);
                        });
                    }
                    else {alert(data.error);}
                    
                },
                error: function(resp,b,error){
                    alert(resp.responseText+'</br>'+error);
                }
                
            });
        };
    }
]);



