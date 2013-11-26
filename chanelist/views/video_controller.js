var videoController = angular.module('videoController', []);

videoController.controller('VideoCtrl', ['$scope', 'CtrlComms',
    function VideoCtrl($scope, CtrlComms) {   
        $scope.playlists = CtrlComms.playlists;
        $scope.video_id = '';

        $scope.init = function(){
            $scope.playlists = CtrlComms.playlists;
        };

        $scope.modify_list = function(method){
            var video_id = $scope.video_id;
            var playlist_id = $scope.playlist;
            var url = '/'+method+'/' + video_id + '/' +playlist_id;
            var payload = {
                'username':CtrlComms.current_user.username,
                'hashword':CtrlComms.current_user.password
            };

            var type = 'NONE';
            if (method=='add'){type='POST';}
            else if (method=='del'){type='DELETE';}

            $.ajax({
                type:type,
                url:url,
                dataType:'json',
                data:payload,
                success: function(data){
                    if (data.success == 1)
                    {
                        //reload the playlist we just modified
                        CtrlComms.reload_list(playlist_id);
                        var type = 'success';
                        var msg = 'You '+method+'ed '+video_id+' to '+playlist_id;
                        CtrlComms.issue_alert(type,msg);
                    }
                    else {alert(data.error);}
                    
                },
                error: function(resp,b,error){
                    alert(resp.responseText+'</br>'+error);
                }
                
            });
        };
/*
        $scope.delVideoFromList = function(){
            var video_id = $( "#video_del_id" ).val();
            var playlist_id = $( "#playlist_del_id" ).val();
            var url = '/del/'+ video_id+'/'+playlist_id;

            $.ajax({
                type:'DELETE',
                url:url,
                dataType:'json',
                success: function(data){
                    if (data.success == 1)
                    {
                        //reload the playlist we just modified
                        CtrlComms.reload_list(playlist_id);
                    }
                    else {alert(data.error);}
                    
                },
                error: function(resp,b,error){
                    alert(resp.responseText+'</br>'+error);
                }
                
            });
        };

*/
        $scope.createVideo = function(){
            var url = '/video';
            var payload = {
                'video_id':$( "#video_create_id" ).val(),
                'title':$( "#video_title" ).val(),
            };

            $.ajax({
                type:'POST',
                url:url,
                dataType:'json',
                data:payload,
                success: function(data){
                    if (data.success == 1)
                    {
                        var x = 1;
                    }
                    else {alert(data.error);}
                    
                },
                error: function(resp,b,error){
                    alert(resp.responseText+'</br>'+error);
                }
                
            });
        };

        $scope.init();
    }
]);


