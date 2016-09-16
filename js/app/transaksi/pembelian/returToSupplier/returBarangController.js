appControllers.controller('returBarangController',['$scope','returBarangFactory','growl','$location', '$rootScope','focus','$filter','$routeParams',
	function($scope, returBarangFactory, growl, $location, $rootScope,focus, $filter, $routeParams){
		
	// tanggal
		$scope.today = function() {
	    	$scope.tgl1 = new Date();
	    	$scope.tgl2 = new Date();
		};
		

		$scope.open = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.opened = true;		    
		};

		$scope.open2 = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.opened2 = true;		    
		};

		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};
	// END tanggal

 	$scope.pageChanged=function(){
 		getAllPenjualanBarang($scope.currentPage); 		  
    };

	function startModule(){	


		$scope.today();

		$scope.returHds=[];		
				
		$scope.search='';

		// Paging
		$scope.totalItems;
		$scope.itemsPerPage= 10;
		$scope.currentPage = 1;
		
		$scope.getAll();		
	}


	$scope.getAll=function(){
		getAllPenjualanBarang(1);
	};

	
	$scope.addNewRec=function(){
		// direct
		$location.path('/returBarangDetil/0');
		
	};

	function getAllPenjualanBarang(halaman){
		//alert('get all kode arsip');

		var vTgl1 = $filter('date')($scope.tgl1,'yyyy-MM-dd');
		var vTgl2 = $filter('date')($scope.tgl2,'yyyy-MM-dd');

		if($scope.search===''){

			returBarangFactory
				.getByNamaTanggalPage('--',vTgl1, vTgl2, halaman,$scope.itemsPerPage)
				.success(function (data){
				 	$scope.returHds = data.content ;
				 	$scope.totalItems = data.totalElements;
				 	growl.addInfoMessage(data.content.length);
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});				
		}else{
			returBarangFactory
				.getByNamaTanggalPage($scope.search,vTgl1, vTgl2,halaman,$scope.itemsPerPage)
				.success(function (data){
				 	$scope.returHds = data.content ;
				 	$scope.totalItems = data.totalElements;
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data by nama penjualanBarang !",{ttl: 4000});		
				});					
		}
		
	};


	$scope.EditTransaksi=function(id){
		//direct
		$location.path('/returBarangDetil/'+id);
	};


	$scope.previewLaporan=function(id){
		 $window.open($rootScope.pathServerJSON + '/api/penjualanBarang/report/'+id, '_blank');
	};

	startModule();

}]);