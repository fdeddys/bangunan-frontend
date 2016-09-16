appControllers.controller('menuBarController', ['$scope','$rootScope','$location','$cookieStore','userFactory', '$window',
    function($scope,$rootScope,$location,$cookieStore,userFactory,$window){
          
    $scope.namaLogin="Sign in as ";
    $scope.statusOption={ 
        open:false
    }

    $scope.$watch('isLogin',function(newVal,oldVal, scope){
        //console.log("is login " + oldVal + '  berubah  ' + newVal ); 
        if(newVal===true){
            //alert($rootScope.globals.currentUser.username);
            $scope.namaLogin= "Login as [" + $rootScope.globals.currentUser.userId + "]  @ [" + $rootScope.globals.currentUser.namaGudang +  "]"; 
            //$scope.namaLogin=$cookieStore.globals.currentUser.username;                
        }else{
            $scope.namaLogin="Logout ";
        }
        // if(newVal!==oldVal){
        //     //console.log(oldVal + '  berubah  ' + newVal );  
        // }
    })

    $scope.keluar=function(){
        $scope.statusOption.open=false;
        //$location.path('#/login');
        $window.location = "#/login";
    }   

}])