appControllers.controller('pembayaranCustomerController',
	['$scope','customerFactory','growl', '$rootScope','focus','$filter','$window','penjualanHdFactory','$uibModal',
	function($scope, customerFactory, growl, $rootScope,focus, $filter, $window, penjualanHdFactory, $uibModal){
		
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
					
		$scope.customerSelected=null;
		//$scope.getAll();
		focus('customer');
	}


	$scope.getAll=function(){
		// if($scope.customerSelected==null|| $scope.customerSelected.id==''|| $scope.customerSelected.id== undefined ){
		// 	growl.addWarnMessage("customer belum di pilih !!");
		// }else{
			getAll(1);			
		// }
	};


	function getAll(halaman){
		//alert('get all kode arsip');

		var vTgl1 = $filter('date')($scope.tgl1,'yyyy-MM-dd');
		var vTgl2 = $filter('date')($scope.tgl2,'yyyy-MM-dd');		

		var namaCustomer=$scope.cariNama;

		if(namaCustomer==''){
			namaCustomer='-';
		} 
		else 
		{
			if(namaCustomer==undefined){
				namaCustomer='-';
			} 
		}

		penjualanHdFactory
			.getAllApprovedPage(namaCustomer,vTgl1,vTgl2,halaman,$scope.itemsPerPage)
			.then(function(response){
				$scope.pembayaranHds = response.data.content;
				$scope.totalItems = response.data.totalElements;

				// penjualanDtFactory
				// 	.getTotalJualByIdCust(idCustomer)
				// 	.success(function(data){
				// 		$scope.totalPenjualan = data;
				// 	})


			},function(error){
				console.log(error.data);
			})
	};

	$scope.prosesBayar = function(idHd, totalRp){
		
		var modalInstance = $uibModal.open({
			templateUrl: 'js/app/dialogForm/dialogPembayaran/dialogCustomerForm.html',
			controller: 'dialogCustomerController',
			size: '',
		    resolve: 
		    	{	        
	        		id: function () {
	          			return idHd;
	        		},
	        		total: function () {
	          			return totalRp;
	        		}
      			}
	    });

	    modalInstance
	    	.result.then(function(idHd){
		    // 	var idGudang = $rootScope.globals.currentUser.idGudang;
		    // 	penjualanHdFactory
		    // 		.approve(idHd, idGudang)
		    // 		.then(function(response){
		    // 			$scope.penjualanHd = response.data;
		    // 			$scope.kondisiView = true;
						// $scope.approved =true;
		    // 		});
		    	growl.addInfoMessage("payment success" );
		    	getAll(1);		
	    	},function(pesan){
	    		growl.addInfoMessage(pesan);
	    	})


	}


	$scope.previewLaporan=function(id){
		 $window.open($rootScope.pathServerJSON + '/api/penjualanCustomer/report/'+id, '_blank');
	};

	startModule();

}]);