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
                        var msg = 'method: '+method+'; video: '+video_id+'; playlist: '+playlist_id;
                        CtrlComms.add_alert('success', msg);
                        //reload the playlist we just modified
                        CtrlComms.reload_list(playlist_id);
                    }
                    else {
                        CtrlComms.add_alert('error', data.error);
                    };
                    
                },
                error: function(resp,b,error){
                    alert(resp.responseText+'</br>'+error);
                }
                
            });
        };


        $scope.auto_modify_list = function(method){
            var video_url = $scope.video_url;
            var playlist_id = $scope.playlist;
            var url = '/autoadd/'+playlist_id;


            var video_list = [
                {'url':video_url},
                {'url':video_url}
            ];


            var payload = {
                'video_list':JSON.stringify(video_list),
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
                contentType: 'application/json; charset=utf-8',
                data:payload,
                success: function(data){
                    if (data.success == 1)
                    {
                        var msg = 'autoadd successful';
                        CtrlComms.add_alert('success', msg);
                        //reload the playlist we just modified
                        CtrlComms.reload_list(playlist_id);
                    }
                    else {
                        CtrlComms.add_alert('error', data.error);
                    };
                    
                },
                error: function(resp,b,error){
                    var msg = resp.responseText+':' + error;
                    CtrlComms.add_alert('error', msg);
                }
                
            });
        };












        $scope.createVideo = function(){
            var url = '/video';
            var video_id = $( "#video_create_id" ).val();
            var payload = {
                'video_id':video_id,
                'title':$( "#video_title" ).val(),
                'description':$( "#video_description" ).val(),
                'duration':0
            };

            $.ajax({
                type:'POST',
                url:url,
                dataType:'json',
                data:payload,
                success: function(data){
                    if (data.success == 1)
                    {
                        var msg = 'Created video: '+video_id+'.  Try adding it to a playlist.';
                        CtrlComms.add_alert('success',msg);
                    }
                    else {CtrlComms.add_alert('error',data.error);}
                    
                },
                error: function(resp,b,error){
                    var msg = resp.responseText+':'+error;
                    CtrlComms.add_alert('error',msg);
                }
                
            });
        };

        $scope.init();
    }
]);


