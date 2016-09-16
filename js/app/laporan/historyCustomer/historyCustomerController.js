appControllers.controller('historyCustomerController',['$scope','customerFactory','growl', '$rootScope','focus','$filter','historyCustomerFactory','$window','penjualanDtFactory',
	function($scope, customerFactory, growl, $rootScope,focus, $filter,  historyCustomerFactory, $window, penjualanDtFactory){
		
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
 		getAllHistory($scope.currentPage); 		  
    };

	function startModule(){	

		$scope.today();
		$scope.historyCustomers=[];				
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
		if($scope.customerSelected==null|| $scope.customerSelected.id==''|| $scope.customerSelected.id== undefined ){
			growl.addWarnMessage("customer belum di pilih !!");
		}else{
			getAllHistory(1);			
		}
	};


	function getAllHistory(halaman){
		//alert('get all kode arsip');

		var vTgl1 = $filter('date')($scope.tgl1,'yyyy-MM-dd');
		var vTgl2 = $filter('date')($scope.tgl2,'yyyy-MM-dd');		
		var idCustomer = $scope.customerSelected.id;

		historyCustomerFactory
			.getAll(idCustomer,vTgl1,vTgl2,halaman,$scope.itemsPerPage)
			.then(function(response){
				$scope.historyCustomers = response.data.content;
				$scope.totalItems = response.data.totalElements;

				penjualanDtFactory
					.getTotalJualByIdCust(idCustomer)
					.success(function(data){
						$scope.totalPenjualan = data;
					})


			},function(error){
				console.log(error.data);
			})
	};

	$scope.getCustomerByNama = function(cariNama){
		return customerFactory
				.getCustomerByNamaPage(cariNama, 1, 10)
				.then(function(response){
					//console.log('load http' + response.data.nama); 
					customers=[];
					angular.forEach(response.data.content, function(item){
		                customers.push(item);		                
		            });
					return customers;
				})
    };

	$scope.previewLaporan=function(id){
		 $window.open($rootScope.pathServerJSON + '/api/penjualanCustomer/report/'+id, '_blank');
	};

	startModule();

}]);