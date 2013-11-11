
var userController = angular.module('userController', []);

userController.controller('UserCtrl', ['$scope', 'CtrlComms',
    function UserCtrl($scope, CtrlComms) {
        $scope.init = function(){
        };

        $scope.init();

        $scope.create_account = function(){
            var username = $('#username_create').val();
            var password1 = $('#password_create1').val();
            var password2 = $('#password_create2').val();
            var url = '/user'
            var payload = {
                'username':username,
                'password1':password1,
                'password2':password2
            };

            $.ajax({
                type:'POST',
                url:url,
                data:payload,
                dataType:'json',
                success: function(data){
                    if (data.success == 1)
                    {
                        $scope.$apply(function(){
                            var current_user = JSON.parse(data.data);
                            $('#username_display').text(current_user.username);
                            CtrlComms.set_user(current_user);
                            $scope.current_user = current_user;
                        });
                    }
                    else{
                        alert(data.error);
                    }
                },
                error: function(resp, b, error){
                    alert(resp.responseText+'</br>'+error);
                }
            });

        };

        $scope.login = function(){
            var username = $('#username_login').val();
            var password = $('#password_login').val();
            var url = '/login';
            var payload = {
                'username':username,
                'password':password
            };

            $.ajax({
                type:'POST',
                url:url,
                data:payload,
                dataType:'json',
                success: function(data){
                    if (data.success == 1){
                        $scope.$apply(function(){
                            var current_user = JSON.parse(data.data);
                            $('#username_display').text(current_user.username);
                            CtrlComms.set_user(current_user);
                            $scope.current_user = current_user;
                        });
                    }
                    else{
                        alert(data.error);
                    }
                },
                error: function(resp, b, error){
                    alert(resp.responseText+'</br>'+error);
                }
            });

            
        };

    },
]);


