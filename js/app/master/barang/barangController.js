appControllers.controller('barangController',['$scope','barangFactory','growl','$window', '$rootScope','satuanFactory','focus',
	function($scope, barangFactory, growl, $window, $rootScope, satuanFactory,focus){
		
	var idx;	  
	$scope.statusbarangs=['ACTIVE','NONACTIVE'];
	$scope.jasaes =[true,false];


 	$scope.pageChanged=function(){
 		getAllBarang($scope.currentPage); 		  
    };

	$scope.jenisTransaksi;
	//1. add
	//2. edit
	//3. deleter	

	function startModule(){
		$scope.tutupGrid=false;
		$scope.editKode=true;
		$scope.classForm='';
		$scope.barangs=[];
		$scope.satuans=[];
		
		$scope.barang={
			"id": null,
			"nama": null,
			"satuan": null,
			"status": "ACTIVE",
			"hpp": 0,
			"stocks": null,
			"jasa":false
		};
		$scope.search='';

		// Paging
		$scope.totalItems;
		$scope.itemsPerPage= 10;
		$scope.currentPage = 1;
		getAllBarang(1);
		getAllSatuan();		
	}


	$scope.getAll=function(){
		getAllBarang(1);
	};

	
	$scope.tambahBarang=function(){
		$scope.jenisTransaksi=1;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formTambah';
		$scope.barang.id='[Automatic]';		
		$scope.barang.kode='';
		$scope.barang.nama='';
		$scope.editKode=true;
		focus('nama');
	};

	function getAllBarang(halaman){
		//alert('get all kode arsip');

		if($scope.search===''){
			barangFactory
				.getByNamaPage('--',halaman,$scope.itemsPerPage)
				.success(function (data){
				 	$scope.barangs = data.content ;
				 	$scope.totalItems = data.totalElements;
				 	growl.addInfoMessage(data.content.length);
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});				
		}else{
			barangFactory
				.getByNamaPage($scope.search,halaman,$scope.itemsPerPage)
				.success(function (data){
				 	$scope.barangs = data.content ;
				 	$scope.totalItems = data.totalElements;
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data by nama barang !",{ttl: 4000});		
				});					
		}
		
	};

	$scope.urut=function(urut_berdasar){
		$scope.orderbarang=urut_berdasar;		
	};

	$scope.ubahBarang=function(id,nama,urut){
		$scope.editKode=false;
		$scope.jenisTransaksi=2;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formUbah';
		barangFactory
			.getById(id)
			.success(function(data){
				$scope.barang =data;
				idx=urut;	
				focus('nama');						
				// satuanFactory
				// 	.getById(data.satuan.id)
				// 	.success(function(data){
				// 		$scope.barang.satuan = data;						
				// 	})
			});
	};

	$scope.hapusBarang=function(id,kode,nama){
		$scope.jenisTransaksi=3;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formHapus';

		barangFactory
			.getById(id)
			.success(function(data){
				$scope.barang =data;				
			});
	};

	$scope.proses=function(){
		switch($scope.jenisTransaksi){
			case 1:		
				barangFactory
					.isNamaExist($scope.barang.nama)
					.then(function(response){
						if (response.data == true){
								growl.addWarnMessage('Nama sudah ada  !');		
						}else{
							$scope.barang.id='';
							barangFactory
								.insert($scope.barang)
								.success(function(data){
									growl.addInfoMessage('insert success ' + data );
									$scope.jenisTransaksi=2;
									$scope.barang.idbarang=data.idbarang;
									$scope.tutupGrid = !$scope.tutupGrid;
									getAllBarang(1);
								})
								.error(function(data){
									growl.addWarnMessage('Error insert ' + data);		
								})							
						}
					})

													
				break;
			case 2:

				// barangFactory
				// 	.isNamaExist($scope.barang.nama)
				// 	.then(function(response){
				// 		if (response.data == true){
				// 			growl.addWarnMessage('Nama sudah ada  !');		
				// 		}else{
							barangFactory
								.update($scope.barang.id, $scope.barang)
								.success(function(data){
									growl.addInfoMessage('edit success');	
									
									//$scope.barangs[idx]=$scope.barang;					
									getAllBarang($scope.currentPage);
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
				barangFactory
					.deletebarang($scope.barang.id)
					.success(function(data){						
						growl.addInfoMessage('Delete success');		
						$scope.currentPage=1;
						getAllBarang(1);
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
		 $window.open($rootScope.pathServerJSON + '/api/barang/report', '_blank');
	};

	function getAllSatuan(){
		satuanFactory
			.getAll()
			.success(function(data){
				$scope.satuans = data;
				$scope.barang.satuan = data[0];
			})
	};

	startModule();

}]);