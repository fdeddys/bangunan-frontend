appControllers.controller('historyBarangController',['$scope','barangFactory','growl', '$rootScope','focus','$filter','historyBarangFactory','$window',
	function($scope, barangFactory, growl, $rootScope,focus, $filter,  historyBarangFactory, $window){
		
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
		$scope.historyBarangs=[];				
		$scope.search='';

		// Paging
		$scope.totalItems=0;
		$scope.itemsPerPage= 8;
		$scope.currentPage = 1;
					
		$scope.barangSelected=null;
		//$scope.getAll();
		focus('barang');
	}


	$scope.getAll=function(){
		if($scope.barangSelected==null|| $scope.barangSelected=='' ){
			growl.addWarnMessage("barang belum di pilih !!");
		}else{
			getAllHistory(1);			
		}
	};


	function getAllHistory(halaman){
		//alert('get all kode arsip');

		var vTgl1 = $filter('date')($scope.tgl1,'yyyy-MM-dd');
		var vTgl2 = $filter('date')($scope.tgl2,'yyyy-MM-dd');
		var idGudang = $rootScope.globals.currentUser.idGudang;
		var idBarang = $scope.barangSelected.id;

		historyBarangFactory
			.getAll(idBarang,idGudang,vTgl1,vTgl2,halaman,$scope.itemsPerPage)
			.then(function(response){
				$scope.historyBarangs = response.data.content;
				$scope.totalItems = response.data.totalElements;
				// console.log('total item = ' + response);

			},function(error){
				console.log(error.data);
			})
	};

	$scope.getBarangByNama = function(cariNama){
		return barangFactory
				.getByNamaPage(cariNama, 1, 10)
				.then(function(response){
					//console.log('load http' + response.data.nama); 
					barangs=[];
					angular.forEach(response.data.content, function(item){
		                barangs.push(item);		                
		            });
					return barangs;
				})
    };

	$scope.previewLaporan=function(id){
		 $window.open($rootScope.pathServerJSON + '/api/penjualanBarang/report/'+id, '_blank');
	};

	startModule();

}]);