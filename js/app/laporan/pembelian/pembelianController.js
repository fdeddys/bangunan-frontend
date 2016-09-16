appControllers.controller('laporanPembelianController',
	['$scope','$window','$routeParams','$rootScope','$filter','supplierFactory','customerFactory','focus',
	function($scope, $window, $routeParams, $rootScope, $filter, supplierFactory, customerFactory, focus){
			
	var idParam;
    var suppliers=[];
    var isLapPembelian;
    $scope.ketCari;
    $scope.ketCari2;

    $scope.statuses=['ALL','OUTSTANDING', 'APPROVED', 'PAID', 'CANCELED'];

	$scope.supplierSelected=null;
	$scope.namaLaporan='';

	// Paging
	$scope.totalItems;
	$scope.itemsPerPage= 10;
	$scope.currentPage = 1;

	//$scope.customerSelected={};
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

 	$scope.getSupplierByNama = function(cariNama){    

 		if(isLapPembelian){
			return	supplierFactory
		    	 		.getByNamaPage(cariNama, 1, 8)
						.then(function(response){
		    				//console.log('load http' + response.data.nama); 
		    				suppliers=[];
		    				angular.forEach(response.data.content, function(item){
				                suppliers.push(item);
				                // console.log('tambah :' + item.namaSatuan);
				            });
		    				return suppliers;
		    			}) 			
 		}else{
 			return customerFactory
						.getCustomerByNamaPage(cariNama, 1, 8)
						.then(function(response){
		    				//console.log('load http' + response.data.nama); 
		    				suppliers=[];
		    				angular.forEach(response.data.content, function(item){
				                suppliers.push(item);
				                //console.log('tambah :' + item.nama);
				            });
		    				return suppliers;
		    			}) 			
 		}
    }

    $scope.previewLaporan=function(){    
    	
    	var vTgl1 = $filter('date')($scope.tgl1,'yyyy-MM-dd');
    	var vTgl2 = $filter('date')($scope.tgl2,'yyyy-MM-dd');

    	var idSupplier;
    	if( $scope.supplierSelected == null){
    		idSupplier=-1;
    	}else{
    		if($scope.supplierSelected.id == undefined ){
    			idSupplier =-1;
    		}else{
    			idSupplier = $scope.supplierSelected.id;    			
    		}
    	}    	
    	
    	switch(idParam){
			case '1':
				$window.open($rootScope.pathServerJSON + '/api/laporan/penerimaanPerPeriode/tgl1/'+vTgl1+'/tgl2/'+vTgl2 +'/idSupp/'+ idSupplier+'/status/'+$scope.statusBayar, '_blank');
				break;
			case '2': 
				$window.open($rootScope.pathServerJSON + '/api/laporan/pembayaranPerPeriode/tgl1/'+vTgl1+'/tgl2/'+vTgl2 +'/idSupp/'+ idSupplier, '_blank');
				break;
			case '3': 
				$window.open($rootScope.pathServerJSON + '/api/laporan/returSupplierPerPeriode/tgl1/'+vTgl1+'/tgl2/'+vTgl2 +'/idSupp/'+ idSupplier, '_blank');
				break;
			case '4':
				$window.open($rootScope.pathServerJSON + '/api/laporan/penjualanPerPeriode/tgl1/'+vTgl1+'/tgl2/'+vTgl2 +'/idCust/'+ idSupplier+'/status/'+$scope.statusBayar, '_blank');
				break;
			case '5':
				$window.open($rootScope.pathServerJSON + '/api/laporan/pelunasanCustomerPerPeriode/tgl1/'+vTgl1+'/tgl2/'+vTgl2 +'/idCust/'+ idSupplier, '_blank');
				break;
		}
		
	}

    
	function startModule(){	
		
		idParam = $routeParams.idLap;	
		// 1 = laporan pembelian per periode
		switch(idParam){
			case '1': $scope.namaLaporan ="Pembelian per periode"
				$scope.isTampilStatusBayar = true;
				isLapPembelian=true;
				break;
			case '2': $scope.namaLaporan ="Pelunasan Supplier per periode"
				$scope.isTampilStatusBayar = false;
				isLapPembelian=true;
				break;
			case '3': $scope.namaLaporan ="Retur Supplier per periode"
				$scope.isTampilStatusBayar = false;
				isLapPembelian=true;
				break;
			case '4': $scope.namaLaporan ="Penjualan per periode"
				$scope.isTampilStatusBayar = true;
				isLapPembelian=false;
				break;
			case '5': $scope.namaLaporan ="Pelunasan Customer per periode"
				$scope.isTampilStatusBayar = false;
				isLapPembelian=false;
				break;
		}
		$scope.today();
		$scope.statusBayar=$scope.statuses[0];

		if(isLapPembelian){
			$scope.ketCari ="Supplier ";
			$scope.ketCari2 = "kosong untuk semua supplier";
		}else{
			$scope.ketCari ="Customer ";
			$scope.ketCari2 = "kosong untuk semua customer";
		}

		focus('cariSupp');


	};

	startModule();

}]);
