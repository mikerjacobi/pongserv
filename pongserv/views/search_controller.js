
var searchController = angular.module('searchController', []);

searchController.controller('SearchCtrl', ['$scope', 'CtrlComms', 
    function SearchCtrl($scope, CtrlComms) {
        $scope.playlists = [];

        $scope.init = function(){
            $scope.get_playlists();    
        };

        $scope.get_playlists = function(){
            var url = '/search';

            $.ajax({
                type:'GET',
                url:url,
                dataType:'json',
                async:false,
                success: function(data){
                    if (data.success == 1){
                        var pls = JSON.parse(data.data);
                        for (i in pls){
                            $scope.playlists.push(pls[i]);
                        }
                    }
                    else {alert(data.error);}
                },
                error: function(resp,b,error){
                    alert(resp.responseText+'</br>'+error);
                }
            });
        };


        $scope.play_playlist = function(playlist_id){
            CtrlComms.set_current_playlist(playlist_id);
        };

        $scope.init();
    }
]);
 
