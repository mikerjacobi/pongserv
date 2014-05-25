var commService = angular.module('commService', []);

commService.factory('CtrlComms', function($rootScope){
    ctrlService = {};

    ctrlService.current_user = {};
    ctrlService.current_playlist = {};
    ctrlService.current_video = {};

    ctrlService.playlists = [];
    ctrlService.videos = [];
    
    ctrlService.set_user = function(user){
        ctrlService.current_user = user;
    };

    ctrlService.signal_player_ready = function(){
        //this function broadcasts that the player has loaded
        $rootScope.$broadcast('player_ready_bc');
    };

    ctrlService.set_current_playlist = function(playlist_id){
        ctrlService.current_playlist = ctrlService.get_playlist(playlist_id);
        $rootScope.$broadcast('curr_playlist_bc');
            
    };

    ctrlService.append_playlist = function(playlist){
        /*
         * when a new playlist is created, add it to the list of playlists
         */

        ctrlService.playlists.push(playlist);
        //maybe broadcast we updated this?
    };

    ctrlService.get_playlist = function(playlist_id){

        //if we've already loaded this playlist:
        for (i in ctrlService.playlists){
            if (playlist_id == ctrlService.playlists[i].playlist_id){
                return ctrlService.playlists[i];
            }
        }

        //otherwise, fetch this playlist, save it, and return it
        var url = '/playlist/'+playlist_id;
        var playlist;
        $.ajax({
            async:false,
            type:'GET',
            dataType:'json',
            url:url,
            success: function(data){
                if (data.success == 1){
                    var curr_data = JSON.parse(data.data);
                    playlist = curr_data;
                    ctrlService.playlists.push(playlist);
                }
                else{
                    alert(data.error);
                }
            },
            error: function(resp, b, error){
                alert(resp.responseText+'</br>'+error);
            }
        });
        return playlist;
    };


    ctrlService.get_video = function(video_id){
        //if we've already loaded this video, return it:
        for (i in ctrlService.videos){
            if (video_id == ctrlService.videos[i].video_id){
                return ctrlService.videos[i];
            }
        }

        var url = '/video/'+video_id;
        var video;
        
        $.ajax({
            async:false,
            type:'GET',
            dataType:'json',
            url:url,
            success: function(data){
                if (data.success == 1){
                    var curr_data = JSON.parse(data.data);
                    video = curr_data;
                    ctrlService.videos.push(video);
                }
                else{
                    alert(data.error);
                }
            },
            error: function(resp, b, error){
                alert(resp.responseText+'</br>'+error);
            }
        });
        return video;
    };

    ctrlService.reload_list = function(playlist_id){
        for (i in ctrlService.playlists){
            if (playlist_id == ctrlService.playlists[i].playlist_id){
                ctrlService.playlists.splice(i,1);
                var reloaded_list = ctrlService.get_playlist(playlist_id);
                if (playlist_id == ctrlService.current_playlist.playlist_id){
                    ctrlService.current_playlist = reloaded_list;
                }
                break
            }
        }
    };

    ctrlService.get_user_playlists = function(){
        var user_playlists = []; 
        var playlist_ids = JSON.parse(ctrlService.current_user.playlists_owned);

        for (id in playlist_ids){
            var pl = ctrlService.get_playlist(id);
            user_playlists.push(pl);
        }
    
        return user_playlists;
    };
      
    ctrlService.alerts = []; 
    ctrlService.add_alert = function(type,msg){
        ctrlService.alerts.push({type:type, msg:msg}); 
        $rootScope.$broadcast('issue_alert_bc');
    };

    ctrlService.del_alert = function(index){
        ctrlService.alerts.splice(index, 1);
        $rootScope.$broadcast('issue_alert_bc');
    };

    return ctrlService;
});


