var commService = angular.module('commService', []);

commService.factory('CtrlComms', function($rootScope){
    ctrlService = {};
    ctrlService.current_user = {};
    ctrlService.current_playlists = [];
    ctrlService.current_playlist = {};
    ctrlService.current_video = "";
    
    ctrlService.init_user = function(passed_user){
        ctrlService.current_user = passed_user;
        ctrlService.current_playlists = ctrlService.get_user_playlists();
        $rootScope.$broadcast('init_user_bc');
    };

    ctrlService.signal_player_ready = function(){
        //this function broadcasts that the player has loaded
        $rootScope.$broadcast('player_ready_bc');
    };

    ctrlService.set_current_playlist = function(passed_current_playlist_id){
        //TODO check if we alrdy loaded this playlsit beforehand
        ctrlService.current_playlist = ctrlService.get_playlist(passed_current_playlist_id);
        $rootScope.$broadcast('curr_playlist_bc');
            
    };

    //ctrlService.set_current_video = function(passed_current_video){
    //    ctrlService.current_video = passed_current_video;
    //    $rootScope.$broadcast('curr_video_bc');
    //};

    ctrlService.get_playlist = function(playlist_id){
        var url = '/playlist/'+playlist_id;
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

    ctrlService.get_user_playlists = function(){
        var playlist_ids = JSON.parse(ctrlService.current_user.playlists_owned);
        var list = [];

        for (id in playlist_ids){
            var pl = ctrlService.get_playlist(id)
            list.push(pl);
        }
        return list;
    };
    
    return ctrlService;
});


