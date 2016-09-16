appControllers.controller('penerimaanBarangController',['$scope','penerimaanHdFactory','growl','$location', '$rootScope','focus','$filter','$routeParams',
	function($scope, penerimaanHdFactory, growl, $location, $rootScope,focus, $filter, $routeParams){
		
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
 		getAllPenerimaanBarang($scope.currentPage); 		  
    };

	function startModule(){	


		$scope.today();

		$scope.penerimaanBarangs=[];		
		
		$scope.penerimaanBarang={
		    "id": null,
		    "supplier": null,
		    "noFaktur": null,
		    "tglTerima": null,
		    "keterangan": null,
		    "statusTerima": null,
		    "lastUpdate": null,
		    "userUpdate": null
		}

		$scope.search='';

		// Paging
		$scope.totalItems;
		$scope.itemsPerPage= 10;
		$scope.currentPage = 1;
		
		$scope.getAll();		
	}


	$scope.getAll=function(){
		getAllPenerimaanBarang(1);
	};

	
	$scope.tambahPenerimaanBarang=function(){
		// direct
		$location.path('/penerimaanBarangDetil');
		
	};

	function getAllPenerimaanBarang(halaman){
		//alert('get all kode arsip');

		var vTgl1 = $filter('date')($scope.tgl1,'yyyy-MM-dd');
		var vTgl2 = $filter('date')($scope.tgl2,'yyyy-MM-dd');


		if($scope.search===''){

			penerimaanHdFactory
				.getByNamaTanggalPage('--',vTgl1, vTgl2, halaman,$scope.itemsPerPage)
				.success(function (data){
				 	$scope.penerimaanBarangs = data.content ;
				 	$scope.totalItems = data.totalElements;
				 	growl.addInfoMessage(data.content.length);
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});				
		}else{
			penerimaanHdFactory
				.getByNamaTanggalPage($scope.search,vTgl1, vTgl2,halaman,$scope.itemsPerPage)
				.success(function (data){
				 	$scope.penerimaanBarangs = data.content ;
				 	$scope.totalItems = data.totalElements;
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data by nama penerimaanBarang !",{ttl: 4000});		
				});					
		}
		
	};


	$scope.ubahPenerimaanHd=function(id){
		//direct
		$location.path('/penerimaanBarangDetil/'+id);
	};


	$scope.previewLaporan=function(id){
		 $window.open($rootScope.pathServerJSON + '/api/penerimaanBarang/report/'+id, '_blank');
	};

	startModule();

}]);