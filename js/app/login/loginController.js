appControllers.controller('loginController', ['$scope','growl','AuthenticationService','$location','$rootScope','userFactory','focus', 
    function($scope,growl,AuthenticationService,$location,$rootScope,userFactory, focus){
	
	$scope.userId='';
	$scope.password='';
	AuthenticationService.ClearCredentials();
    $rootScope.isLogin=false;
    focus('inputID');  
    
	// $rootScope.isLogin=false;
	$scope.login = function () {        

        // console.log("user id[" + $scope.userId + "]password[" +  $scope.password+"]");
        // console.log("auth code " + AuthenticationService.getAuthCode($scope.userId,  $scope.password));
	        
        // NO auth 
         
         // AuthenticationService.SetCredentials(0, 'testing');
         // $rootScope.isLogin=true;          
         // $location.path('#/');   
         // return true;

        // -- NO auth 
        AuthenticationService
            .loginAuth($scope.userId, $scope.password)
            .success(function(data){
                growl.addWarnMessage(data);
                //  alert('isi = ['+data+']');
                if ( data==true) {
                    var idUser=0 ; 
                    userFactory
                        .getByUserId($scope.userId)
                        .success(function(data){
                            // idUser=data;
                            //AuthenticationService.SetCredentials($scope.userId, data);
                            AuthenticationService.SetCredentials(data.id, data.userId, data.nama, data.gudang.id, data.gudang.nama);
                           //alert('direct')      
                            $rootScope.isLogin=true;          
                            $location.path('#/'); 
                            //$scope.parent.isLoginMenu=true;                           
                        });
                    
                } else {
                    //alert('error login');                
                    growl.addErrorMessage('Invalid user or password ');
                    // $scope.error = response.message;                
                }    
            })
            .error(function(data){
                growl.addWarnMessage('Error get Auth from Server or Server in OFFLINE mode !' );       
            })

    };
	
}])