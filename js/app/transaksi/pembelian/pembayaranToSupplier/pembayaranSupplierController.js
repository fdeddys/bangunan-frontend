appControllers.controller('pembayaranSupplierController',
	['$scope','supplierFactory','growl', '$rootScope','focus','$filter','$window','penerimaanHdFactory','$uibModal',
	function($scope, supplierFactory, growl, $rootScope,focus, $filter, $window, penerimaanHdFactory, $uibModal){
		
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
 		getAll($scope.currentPage); 		  
    };

	function startModule(){	

		$scope.today();
		$scope.pembayaranHds=[];				
		$scope.search='';

		$scope.totalPenjualan =0;
		$scope.totalPembayaran =0;

		// Paging
		$scope.totalItems;
		$scope.itemsPerPage= 10;
		$scope.currentPage = 1;
					
		$scope.supplierSelected=null;
		//$scope.getAll();
		focus('supplier');
	}


	$scope.getAll=function(){
		if($scope.supplierSelected==null|| $scope.supplierSelected.id==''|| $scope.supplierSelected.id== undefined ){
			growl.addWarnMessage("supplier belum di pilih !!");
		}else{
			getAll(1);			
		}
	};


	function getAll(halaman){
		//alert('get all kode arsip');

		var vTgl1 = $filter('date')($scope.tgl1,'yyyy-MM-dd');
		var vTgl2 = $filter('date')($scope.tgl2,'yyyy-MM-dd');		
		var idSupplier = $scope.supplierSelected.id;

		penerimaanHdFactory
			.getAllApprovedPage(idSupplier,vTgl1,vTgl2,halaman,$scope.itemsPerPage)
			.then(function(response){
				$scope.pembayaranHds = response.data.content;
				$scope.totalItems = response.data.totalElements;

				// penjualanDtFactory
				// 	.getTotalJualByIdCust(idSupplier)
				// 	.success(function(data){
				// 		$scope.totalPenjualan = data;
				// 	})


			},function(error){
				console.log(error.data);
			})
	};

	$scope.prosesBayar = function(idHd){
		
		var modalInstance = $uibModal.open({
			templateUrl: 'js/app/dialogForm/dialogPembayaran/dialogSupplierForm.html',
			controller: 'dialogSupplierController',
			size: '',
		    resolve: 
		    	{	        
	        		id: function () {
	          			return idHd;
	        		}
      			}
	    });

	    modalInstance
	    	.result.then(function(idHd){
		    // 	var idGudang = $rootScope.globals.currentUser.idGudang;
		    // 	penerimaanHdFactory
		    // 		.approve(idHd, idGudang)
		    // 		.then(function(response){
		    // 			$scope.penerimaanHd = response.data;
		    // 			$scope.kondisiView = true;
						// $scope.approved =true;
		    // 		});
		    	growl.addInfoMessage("payment success" );
		    	getAll(1);		
	    	},function(pesan){
	    		growl.addInfoMessage(pesan);
	    	})


	}

	$scope.getSupplierByNama = function(cariNama){
		return supplierFactory
				.getByNamaPage(cariNama, 1, 10)
				.then(function(response){
					//console.log('load http' + response.data.nama); 
					suppliers=[];
					angular.forEach(response.data.content, function(item){
		                suppliers.push(item);		                
		            });
					return suppliers;
				})
    };

	$scope.previewLaporan=function(id){
		 $window.open($rootScope.pathServerJSON + '/api/penjualanSupplier/report/'+id, '_blank');
	};

	startModule();

}]);