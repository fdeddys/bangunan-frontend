appControllers.controller('penjualanBarangController',['$scope','penjualanHdFactory','growl','$location', '$rootScope','focus','$filter','$routeParams',
	function($scope, penjualanHdFactory, growl, $location, $rootScope,focus, $filter, $routeParams){
		
	var transaksiBarang=true;
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

		transaksiBarang = $routeParams.isTransBarang;
		$scope.today();
		//console.log(transaksiBarang);
		if(transaksiBarang=='true'){
			$scope.judul = 'Transaksi Penjualan Barang';			
		}else{
			$scope.judul = 'Transaksi Jasa';
		}

		$scope.penjualanBarangs=[];		
		
		$scope.penjualanBarang={
		    "id": null,
		    "customer": null,
		    "tglJual": null,
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
		getAllPenjualanBarang(1);
	};

	
	$scope.tambahPenjualanBarang=function(){
		// direct
		$location.path('/penjualanBarangDetil/0/'+transaksiBarang);
		
	};

	function getAllPenjualanBarang(halaman){
		//alert('get all kode arsip');

		var vTgl1 = $filter('date')($scope.tgl1,'yyyy-MM-dd');
		var vTgl2 = $filter('date')($scope.tgl2,'yyyy-MM-dd');

		if($scope.search===''){

			penjualanHdFactory
				.getByNamaTanggalPage('--',vTgl1, vTgl2, halaman,$scope.itemsPerPage,transaksiBarang)
				.success(function (data){
					// if(data.content === undefined ){
					 	$scope.penjualanBarangs = data.content ;
					 	$scope.totalItems = data.totalElements;
					 	growl.addInfoMessage(data.content.length);						
					// }
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});				
		}else{
			penjualanHdFactory
				.getByNamaTanggalPage($scope.search,vTgl1, vTgl2,halaman,$scope.itemsPerPage,transaksiBarang)
				.success(function (data){
					// if(data.content == undefined){
					 	$scope.penjualanBarangs = data.content ;
					 	$scope.totalItems = data.totalElements;
						
					// }
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data by nama penjualanBarang !",{ttl: 4000});		
				});					
		}
		
	};


	$scope.ubahPenjualanHd=function(id){
		//direct
		$location.path('/penjualanBarangDetil/'+id+'/'+transaksiBarang);
	};


	$scope.previewLaporan=function(id){
		 $window.open($rootScope.pathServerJSON + '/api/penjualanBarang/report/'+id, '_blank');
	};

	startModule();

}]);