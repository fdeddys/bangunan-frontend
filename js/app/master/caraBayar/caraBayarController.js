appControllers.controller('caraBayarController',['$scope','caraBayarFactory','growl','$window', '$rootScope','focus',
	function($scope, caraBayarFactory, growl, $window, $rootScope, focus){
		
	var idx;	  

	$scope.tutupGrid=false;
	$scope.editKode=true;
	$scope.classForm='';
	$scope.caraBayars=[];
	
	$scope.caraBayar={
		"id": null,
		"nama": null
	};
	$scope.search='';

	// Paging
	$scope.totalItems;
	$scope.itemsPerPage= 10;
	$scope.currentPage = 1;

 	$scope.pageChanged=function(){
 		getAllCaraBayar($scope.currentPage); 		  
    };

	$scope.jenisTransaksi;
	//1. add
	//2. edit
	//3. deleter	

	getAllCaraBayar(1);

	$scope.getAll=function(){
		getAllCaraBayar(1);
	};

	
	$scope.tambahCaraBayar=function(){
		$scope.jenisTransaksi=1;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formTambah';
		$scope.caraBayar.id='[Automatic]';		
		$scope.caraBayar.nama='';
		$scope.editKode=true;
		focus('nama');
	};

	function getAllCaraBayar(halaman){
		//alert('get all kode arsip');

		if($scope.search===''){
			caraBayarFactory
				.getByNamaPage('--',halaman,$scope.itemsPerPage)
				.success(function (data){
				 	$scope.caraBayars = data.content ;
				 	$scope.totalItems = data.totalElements;
				 	growl.addInfoMessage(data.content.length);
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});				
		}else{
			caraBayarFactory
				.getByNamaPage($scope.search,halaman,$scope.itemsPerPage)
				.success(function (data){
				 	$scope.caraBayars = data.content ;
				 	$scope.totalItems = data.totalElements;
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data by nama caraBayar !",{ttl: 4000});		
				});					
		}
		
	};

	$scope.urut=function(urut_berdasar){
		$scope.ordercaraBayar=urut_berdasar;		
	};

	$scope.ubahCaraBayar=function(id,nama,urut){
		$scope.editKode=false;
		$scope.jenisTransaksi=2;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formUbah';
		caraBayarFactory
			.getById(id)
			.success(function(data){
				$scope.caraBayar =data;	
				idx=urut;			
				focus('nama');
			});
	};

	$scope.hapusCaraBayar=function(id,kode,nama){
		$scope.jenisTransaksi=3;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formHapus';

		caraBayarFactory
			.getById(id)
			.success(function(data){
				$scope.caraBayar =data;				
			});
	};

	$scope.proses=function(){
		switch($scope.jenisTransaksi){
			case 1:				
				$scope.caraBayar.id='';
				caraBayarFactory
					.insert($scope.caraBayar)
					.success(function(data){
						growl.addInfoMessage('insert success ' + data );
						$scope.jenisTransaksi=2;
						$scope.caraBayar.idcaraBayar=data.idcaraBayar;
						$scope.tutupGrid = !$scope.tutupGrid;
						getAllCaraBayar(1);
					})
					.error(function(data){
						growl.addWarnMessage('Error insert ' + data);		
					})
													
				break;
			case 2:
				caraBayarFactory
					.update($scope.caraBayar.id, $scope.caraBayar)
					.success(function(data){
						growl.addInfoMessage('edit success');	
						
						//$scope.caraBayars[idx]=$scope.caraBayar;					
						getAllCaraBayar($scope.currentPage);
						$scope.tutupGrid = !$scope.tutupGrid;
					})
					.error(function(data){
						growl.addWarnMessage('Error Updata ' + data);
						console.log(data);		
					})				
				break;
			case 3:
				caraBayarFactory
					.deletecaraBayar($scope.caraBayar.id)
					.success(function(data){						
						growl.addInfoMessage('Delete success');		
						$scope.currentPage=1;
						getAllCaraBayar(1);
						$scope.tutupGrid = !$scope.tutupGrid;
					})
					.error(function(data){
						growl.addWarnMessage('Error Delete ' + data)								
					});				
				break;			
		}
	};

	$scope.tutupDetil=function(){
		$scope.tutupGrid = !$scope.tutupGrid;
	};

	$scope.previewLaporan=function(){
		 $window.open($rootScope.pathServerJSON + '/api/caraBayar/report', '_blank');
	};

}]);