var alertController = angular.module('alertController', ['ui.bootstrap']);

alertController.controller('AlertCtrl', ['$scope', 'CtrlComms',
    function AlertCtrl($scope, CtrlComms){
        $scope.alerts = [
            { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
        ];

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.$on('issue_alert_bc', function(passed_msg){
            $scope.alerts.push({type:'success', msg:passed_msg});
        });
    }
]);

