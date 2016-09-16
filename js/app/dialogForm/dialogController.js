appControllers.controller('dialogController', 
	['$scope', '$uibModalInstance','pesan', 'id',
	function($scope, $uibModalInstance, pesan, id){

	$scope.pesan=pesan;
	$scope.id=id;

	$scope.ok = function () {
    	$uibModalInstance.close($scope.id);
  	};

  	$scope.cancel = function () {
    	$uibModalInstance.dismiss('cancel');
  	};	


}])