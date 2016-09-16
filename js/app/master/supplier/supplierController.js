appControllers.controller('supplierController',['$scope','supplierFactory','growl','$window', '$rootScope','focus',
	function($scope, supplierFactory, growl, $window, $rootScope, focus){
		
	var idx;	  
	$scope.statussuppliers=['ACTIVE','NONACTIVE'];

	$scope.tutupGrid=false;
	$scope.editKode=true;
	$scope.classForm='';
	$scope.suppliers=[];
	$scope.ordersupplier='nama';
	$scope.supplier={
		"id": null,
		"nama": null,
		"alamat": null,
		"kota": null,
		"telp": null,
		"kontak": null
	};
	$scope.search='';

	// Paging
	$scope.totalItems;
	$scope.itemsPerPage= 10;
	$scope.currentPage = 1;

 	$scope.pageChanged=function(){
 		getAllsupplier($scope.currentPage); 		  
    };

	$scope.jenisTransaksi;
	//1. add
	//2. edit
	//3. deleter	

	getAllsupplier(1);

	$scope.getAll=function(){
		getAllsupplier(1);
	};

	
	$scope.tambahsupplier=function(){
		$scope.jenisTransaksi=1;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formTambah';
		$scope.supplier.id='[Automatic]';		
		$scope.supplier.kode='';
		$scope.supplier.nama='';
		$scope.editKode=true;
		focus('nama');
	};

	function getAllsupplier(halaman){
		//alert('get all kode arsip');

		if($scope.search===''){
			supplierFactory
				.getByNamaPage('--',halaman,$scope.itemsPerPage)
				.success(function (data){
				 	$scope.suppliers = data.content ;
				 	$scope.totalItems = data.totalElements;
				 	growl.addInfoMessage(data.content.length);
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});				
		}else{
			supplierFactory
				.getByNamaPage($scope.search,halaman,$scope.itemsPerPage)
				.success(function (data){
				 	$scope.suppliers = data.content ;
				 	$scope.totalItems = data.totalElements;
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data by nama supplier !",{ttl: 4000});		
				});					
		}
		
	};

	$scope.urut=function(urut_berdasar){
		$scope.ordersupplier=urut_berdasar;		
	};

	$scope.ubahsupplier=function(id,nama,urut){
		$scope.editKode=false;
		$scope.jenisTransaksi=2;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formUbah';
		supplierFactory
			.getById(id)
			.success(function(data){
				$scope.supplier =data;	
				idx=urut;			
				focus('nama');
			});
	};

	$scope.hapussupplier=function(id,kode,nama){
		$scope.jenisTransaksi=3;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formHapus';

		supplierFactory
			.getById(id)
			.success(function(data){
				$scope.supplier =data;				
			});
	};

	$scope.proses=function(){
		switch($scope.jenisTransaksi){
			case 1:	

				supplierFactory
					.isNamaExist($scope.supplier.nama)
					.then(function(response){
						if (response.data == true){
								growl.addWarnMessage('Nama sudah ada  !');		
						}else{
							$scope.supplier.id='';
							supplierFactory
								.insert($scope.supplier)
								.success(function(data){
									growl.addInfoMessage('insert success ' + data );
									$scope.jenisTransaksi=2;
									$scope.supplier.idsupplier=data.idsupplier;
									$scope.tutupGrid = !$scope.tutupGrid;
									getAllsupplier(1);
								})
								.error(function(data){
									growl.addWarnMessage('Error insert ' + data);		
								})
						}
					})

													
				break;
			case 2:

				// supplierFactory
				// 	.isNamaExist($scope.supplier.nama)
				// 	.then(function(response){
				// 		if (response.data == true){
				// 			growl.addWarnMessage('Nama sudah ada  !');		
				// 		}else{
							supplierFactory
								.update($scope.supplier.id, $scope.supplier)
								.success(function(data){
									growl.addInfoMessage('edit success');	
									
									//$scope.suppliers[idx]=$scope.supplier;					
									getAllsupplier($scope.currentPage);
									$scope.tutupGrid = !$scope.tutupGrid;
								})
								.error(function(data){
									growl.addWarnMessage('Error Updata ' + data);
									console.log(data);		
								})				
							
					// 	}
					// })

				break;
			case 3:
				supplierFactory
					.deletesupplier($scope.supplier.id)
					.success(function(data){						
						growl.addInfoMessage('Delete success');		
						$scope.currentPage=1;
						getAllsupplier(1);
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
		 $window.open($rootScope.pathServerJSON + '/api/supplier/report', '_blank');
	};

}]);