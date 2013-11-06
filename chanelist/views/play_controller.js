var playController = angular.module('playController', []);

playController.controller('PlayCtrl', ['$scope', 'CtrlComms', '$routeParams',
    function PlayCtrl($scope, CtrlComms, $routeParams) {   
        $scope.playlist_id = $routeParams.playlist_id;
        $scope.init = function(){
            //$scope.current_playlists = CtrlComms.current_playlists;
        };

        $scope.init();

        

    }
]);


