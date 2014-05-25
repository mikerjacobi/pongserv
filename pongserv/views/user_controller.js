
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
                            $scope.load_user(current_user);
                            CtrlComms.add_alert('success', 'created account: '+current_user);
                        });
                    }
                    else{
                        CtrlComms.add_alert('error', data.error);
                    }
                },
                error: function(resp, b, error){
                    CtrlComms.add_alert('error', data.error);
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
                            $scope.load_user(current_user);
                        });
                    }
                    else{
                        CtrlComms.add_alert('error', data.error);
                    }
                },
                error: function(resp, b, error){
                    CtrlComms.add_alert('error', error);
                }
            });

            
        };

        $scope.load_user = function(user){
            $('#username_display').text(user.username);
            CtrlComms.set_user(user);
            $scope.current_user = user;
            $scope.user_playlists = CtrlComms.get_user_playlists();

        };

    },
]);


