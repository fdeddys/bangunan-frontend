appControllers.controller('penjualanJasaController', 
	['$scope', 'penjualanJasaService','$filter','$location','$window','growl',
	function($scope, penjualanJasaService, $filter, $location, $window, growl){	

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
 		getAllPenjualan($scope.currentPage); 		  
    };

	function startModule(){	

		
		$scope.today();
		//console.log(transaksiBarang);
		
		$scope.judul = 'Transaksi Penjualan Barang';					
		$scope.penjualans=[];		
		$scope.search='';

		// Paging
		$scope.totalItems;
		$scope.itemsPerPage= 10;
		$scope.currentPage = 1;
		
		$scope.getAll();		
	}


	$scope.getAll=function(){
		getAllPenjualan(1);
	};

	
	$scope.tambahPenjualan=function(){
		// direct
		$location.path('/penjualanJasaDetil/0');
		
	};

	function getAllPenjualan(halaman){
		//alert('get all kode arsip');

		var vTgl1 = $filter('date')($scope.tgl1,'yyyy-MM-dd');
		var vTgl2 = $filter('date')($scope.tgl2,'yyyy-MM-dd');

		if($scope.search===''){

			penjualanJasaService
				.getByNamaTanggalPage('--',vTgl1, vTgl2, halaman,$scope.itemsPerPage)
				.success(function (data){
					// if(data.content === undefined ){
					 	$scope.penjualans = data.content ;
					 	$scope.totalItems = data.totalElements;
					 	growl.addInfoMessage(data.content.length);						
					// }
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});				
		}else{
			penjualanJasaService
				.getByNamaTanggalPage($scope.search,vTgl1, vTgl2,halaman,$scope.itemsPerPage)
				.success(function (data){
					// if(data.content == undefined){
					 	$scope.penjualans = data.content ;
					 	$scope.totalItems = data.totalElements;
						
					// }
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data by nama penjualanBarang !",{ttl: 4000});		
				});					
		}
		
	};


	$scope.ubahPenjualanHd=function(id){
		//direct
		$location.path('/penjualanBarangDetil/'+id);
	};


	$scope.previewLaporan=function(id){
		 $window.open($rootScope.pathServerJSON + '/api/penjualanBarang/report/'+id, '_blank');
	};

	startModule();
	
}])