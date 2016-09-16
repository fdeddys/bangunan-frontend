appControllers.controller('satuanController',['$scope','satuanFactory','growl','$window', '$rootScope','focus',
	function($scope, satuanFactory, growl, $window, $rootScope, focus){
		
	var idx;	  
	$scope.statussatuans=['ACTIVE','NONACTIVE'];

	$scope.tutupGrid=false;
	$scope.editKode=true;
	$scope.classForm='';
	$scope.satuans=[];
	
	$scope.satuan={
		"id": null,
		"nama": null
	};
	$scope.search='';

	// Paging
	$scope.totalItems;
	$scope.itemsPerPage= 10;
	$scope.currentPage = 1;

 	$scope.pageChanged=function(){
 		getAllSatuan($scope.currentPage); 		  
    };

	$scope.jenisTransaksi;
	//1. add
	//2. edit
	//3. deleter	

	getAllSatuan(1);

	$scope.getAll=function(){
		getAllSatuan(1);
	};

	
	$scope.tambahSatuan=function(){
		$scope.jenisTransaksi=1;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formTambah';
		$scope.satuan.id='[Automatic]';		
		$scope.satuan.kode='';
		$scope.satuan.nama='';
		$scope.editKode=true;
		focus('nama');
	};

	function getAllSatuan(halaman){
		//alert('get all kode arsip');

		if($scope.search===''){
			satuanFactory
				.getByNamaPage('--',halaman,$scope.itemsPerPage)
				.success(function (data){
				 	$scope.satuans = data.content ;
				 	$scope.totalItems = data.totalElements;
				 	growl.addInfoMessage(data.content.length);
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});				
		}else{
			satuanFactory
				.getByNamaPage($scope.search,halaman,$scope.itemsPerPage)
				.success(function (data){
				 	$scope.satuans = data.content ;
				 	$scope.totalItems = data.totalElements;
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data by nama satuan !",{ttl: 4000});		
				});					
		}
		
	};

	$scope.urut=function(urut_berdasar){
		$scope.ordersatuan=urut_berdasar;		
	};

	$scope.ubahSatuan=function(id,nama,urut){
		$scope.editKode=false;
		$scope.jenisTransaksi=2;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formUbah';
		satuanFactory
			.getById(id)
			.success(function(data){
				$scope.satuan =data;	
				idx=urut;			
				focus('nama');
			});
	};

	$scope.hapusSatuan=function(id,kode,nama){
		$scope.jenisTransaksi=3;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formHapus';

		satuanFactory
			.getById(id)
			.success(function(data){
				$scope.satuan =data;				
			});
	};

	$scope.proses=function(){
		switch($scope.jenisTransaksi){
			case 1:				
				$scope.satuan.id='';
				satuanFactory
					.insert($scope.satuan)
					.success(function(data){
						growl.addInfoMessage('insert success ' + data );
						$scope.jenisTransaksi=2;
						$scope.satuan.idsatuan=data.idsatuan;
						$scope.tutupGrid = !$scope.tutupGrid;
						getAllSatuan(1);
					})
					.error(function(data){
						growl.addWarnMessage('Error insert ' + data);		
					})
													
				break;
			case 2:
				satuanFactory
					.update($scope.satuan.id, $scope.satuan)
					.success(function(data){
						growl.addInfoMessage('edit success');	
						
						//$scope.satuans[idx]=$scope.satuan;					
						getAllSatuan($scope.currentPage);
						$scope.tutupGrid = !$scope.tutupGrid;
					})
					.error(function(data){
						growl.addWarnMessage('Error Updata ' + data);
						console.log(data);		
					})				
				break;
			case 3:
				satuanFactory
					.deletesatuan($scope.satuan.id)
					.success(function(data){						
						growl.addInfoMessage('Delete success');		
						$scope.currentPage=1;
						getAllSatuan(1);
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
		 $window.open($rootScope.pathServerJSON + '/api/satuan/report', '_blank');
	};

}]);