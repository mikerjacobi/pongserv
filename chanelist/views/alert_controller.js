var alertController = angular.module('alertController', ['ui.bootstrap']);

alertController.controller('AlertCtrl', ['$scope', 'CtrlComms',
    function AlertCtrl($scope, CtrlComms){
        $scope.alerts = [];

        $scope.closeAlert = function(index) {
            CtrlComms.del_alert(index);
        };

        $scope.$on('issue_alert_bc', function(){
            $scope.$apply(function(){
                $scope.alerts = CtrlComms.alerts;
            });
        });
        
    }
]);

