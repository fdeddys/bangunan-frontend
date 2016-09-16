appControllers.controller('gudangController',['$scope','gudangFactory','growl','$window', '$rootScope','focus',
	function($scope, gudangFactory, growl, $window, $rootScope, focus){
		
	var idx;	  
	$scope.statusgudangs=['ACTIVE','NONACTIVE'];

	$scope.tutupGrid=false;
	$scope.editKode=true;
	$scope.classForm='';
	$scope.gudangs=[];
	
	$scope.gudang={
		"id": null,
		"nama": null
	};
	$scope.search='';

	// Paging
	$scope.totalItems;
	$scope.itemsPerPage= 10;
	$scope.currentPage = 1;

 	$scope.pageChanged=function(){
 		getAllGudang($scope.currentPage); 		  
    };

	$scope.jenisTransaksi;
	//1. add
	//2. edit
	//3. deleter	

	getAllGudang(1);

	$scope.getAll=function(){
		getAllGudang(1);
	};

	
	$scope.tambahGudang=function(){
		$scope.jenisTransaksi=1;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formTambah';
		$scope.gudang.id='[Automatic]';		
		$scope.gudang.kode='';
		$scope.gudang.nama='';
		$scope.editKode=true;
		focus('nama');
	};

	function getAllGudang(halaman){
		//alert('get all kode arsip');

		if($scope.search===''){
			gudangFactory
				.getByNamaPage('--',halaman,$scope.itemsPerPage)
				.success(function (data){
				 	$scope.gudangs = data.content ;
				 	$scope.totalItems = data.totalElements;
				 	growl.addInfoMessage(data.content.length);
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});				
		}else{
			gudangFactory
				.getByNamaPage($scope.search,halaman,$scope.itemsPerPage)
				.success(function (data){
				 	$scope.gudangs = data.content ;
				 	$scope.totalItems = data.totalElements;
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data by nama gudang !",{ttl: 4000});		
				});					
		}
		
	};

	$scope.urut=function(urut_berdasar){
		$scope.ordergudang=urut_berdasar;		
	};

	$scope.ubahGudang=function(id,nama,urut){
		$scope.editKode=false;
		$scope.jenisTransaksi=2;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formUbah';
		gudangFactory
			.getById(id)
			.success(function(data){
				$scope.gudang =data;	
				idx=urut;			
				focus('nama');
			});
	};

	$scope.hapusGudang=function(id,kode,nama){
		$scope.jenisTransaksi=3;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formHapus';

		gudangFactory
			.getById(id)
			.success(function(data){
				$scope.gudang =data;				
			});
	};

	$scope.proses=function(){
		switch($scope.jenisTransaksi){
			case 1:				
				$scope.gudang.id='';
				gudangFactory
					.insert($scope.gudang)
					.success(function(data){
						growl.addInfoMessage('insert success ' + data );
						$scope.jenisTransaksi=2;
						$scope.gudang.idgudang=data.idgudang;
						$scope.tutupGrid = !$scope.tutupGrid;
						getAllGudang(1);
					})
					.error(function(data){
						growl.addWarnMessage('Error insert ' + data);		
					})
													
				break;
			case 2:
				gudangFactory
					.update($scope.gudang.id, $scope.gudang)
					.success(function(data){
						growl.addInfoMessage('edit success');	
						
						//$scope.gudangs[idx]=$scope.gudang;					
						getAllGudang($scope.currentPage);
						$scope.tutupGrid = !$scope.tutupGrid;
					})
					.error(function(data){
						growl.addWarnMessage('Error Updata ' + data);
						console.log(data);		
					})				
				break;
			case 3:
				gudangFactory
					.deletegudang($scope.gudang.id)
					.success(function(data){						
						growl.addInfoMessage('Delete success');		
						$scope.currentPage=1;
						getAllGudang(1);
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
		 $window.open($rootScope.pathServerJSON + '/api/gudang/report', '_blank');
	};

}]);