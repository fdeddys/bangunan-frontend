appControllers.controller('dialogSupplierController', 
	['$scope', '$uibModalInstance', 'id','penerimaanHdFactory','caraBayarFactory','focus','$filter',
	function($scope, $uibModalInstance, id, penerimaanHdFactory, caraBayarFactory, focus, $filter){

	

	// tanggal
		$scope.today = function() {
	    	$scope.tglBayar = new Date();	    	
		};
		

		$scope.open = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.opened = true;		    
		};


		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};
	// END tanggal


	function startModule(){
		$scope.id=id;
		getDataHd();
		getCaraBayar();
		$scope.today();
		focus('keterangan');
	}

	function getDataHd(){

		penerimaanHdFactory
			.getById($scope.id)
			.then(function(response){
				$scope.penerimaanHd = response.data;
			})
	}

	function getCaraBayar(){
		caraBayarFactory
			.getAll()
			.then(function(response){
				$scope.caraBayars = response.data;	
				$scope.caraBayar = response.data[0];
			})		
	}

	$scope.ok = function () {
		var vTgl = $filter('date')($scope.tglBayar,'yyyy-MM-dd');
		var dataBayar={
			'idHd':$scope.id,
    		'idCaraBayar':$scope.caraBayar.id,
    		'tglBayar':vTgl,
    		'keterangan':$scope.keterangan
		};

		penerimaanHdFactory
			.pembayaran(dataBayar)
			.then(function(response){
				$uibModalInstance.close('sukses');
			},function(error){
				$uibModalInstance.dismiss(error.data.message);
			})
    	
  	};

  	$scope.cancel = function () {
    	$uibModalInstance.dismiss('cancel');
  	};	

  	startModule();
}])