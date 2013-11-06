var videoController = angular.module('videoController', []);

videoController.controller('VideoCtrl', ['$scope', 'CtrlComms',
    function VideoCtrl($scope, CtrlComms) {   
        $scope.videos = []; 
        $scope.playlists = []; 

        $scope.init = function(){
            $scope.current_user = CtrlComms.current_user;
            $scope.current_playlists = CtrlComms.current_playlists;
        };

        

        $scope.init();

        $scope.addVideoToList = function(){
            var video_id = $( "#video_add_id" ).val();
            var playlist_id = $( "#playlist_add_select" ).val();
            var url = '/add/' + video_id + '/' +playlist_id;
            var payload = {
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
                       //do somthin!? 
                    }
                    else {alert(data.error);}
                    
                },
                error: function(resp,b,error){
                    alert(resp.responseText+'</br>'+error);
                }
                
            });
        };

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
                       //do somthin!? 
                    }
                    else {alert(data.error);}
                    
                },
                error: function(resp,b,error){
                    alert(resp.responseText+'</br>'+error);
                }
                
            });
        };


        $scope.createVideo = function(){
            var url = '/video';
            var payload = {
                'video_id':$( "#video_create_id" ).val(),
                'title':$( "#video_title" ).val(),
                //i can remove this i think
                'artist':$( "#video_artist" ).val()
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
                            $scope.videos.push(JSON.parse(data.data));
                        });
                    }
                    else {alert(data.error);}
                    
                },
                error: function(resp,b,error){
                    alert(resp.responseText+'</br>'+error);
                }
                
            });
        };

        $scope.getVideo = function(){
            $.ajax({
                type:'GET',
                url:'/video/'+$( "#showVideo" ).val(),
                dataType:'json',
                success: function(data){
                    if (data.success == 1)
                    {
                        $scope.$apply(function(){
                            $scope.videos.push(JSON.parse(data.data));
                        });
                    }
                    else {alert(data.error)}
                },
                error: function(resp,b,error){
                    alert(resp.responseText+'</br>'+error);
                }
            });
        };

        

    }
]);


