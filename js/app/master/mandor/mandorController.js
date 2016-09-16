appControllers.controller('mandorController', ['$scope', 'growl', '$window', '$rootScope', 'focus', 'mandorService',
	function($scope, growl, $window, $rootScope, focus, mandorService){

	$scope.tutupGrid=false;	
	$scope.classForm='';
	$scope.mandors=[];
	
	$scope.mandor={
		id: null,
		nama: null,
		keterangan: null
	};
	$scope.search='';

	// Paging
	$scope.totalItems;
	$scope.itemsPerPage= 10;
	$scope.currentPage = 1;

 	$scope.pageChanged=function(){
 		getAll($scope.currentPage); 		  
    };

	$scope.jenisTransaksi;
	//1. add
	//2. edit
	//3. deleter	

	getAll(1);

	$scope.getAll=function(){
		getAll(1);
	};

	
	$scope.tambah=function(){
		$scope.jenisTransaksi=1;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formTambah';
		$scope.mandor.id='[Automatic]';				
		$scope.mandor.nama='';
		$scope.mandor.keterangan='';		
		focus('nama');
	};

	function getAll(halaman){

		var kriteriaNama;
		if($scope.search==''){
			kriteriaNama="--";			
		}else{
			kriteriaNama=$scope.search;			
		}
		
		mandorService
			.getByNamaPage(kriteriaNama,halaman,$scope.itemsPerPage)
			.success(function (data){
			 	$scope.mandors = data.content ;
			 	$scope.totalItems = data.totalElements;
			}).error(function(data){
				growl.addWarnMessage("Error Loading getAll data by nama  !",{ttl: 4000});		
			});					
	};

	$scope.ubah =function(id,nama,urut){
		$scope.editKode=false;
		$scope.jenisTransaksi=2;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formUbah';

		mandorService
			.getById(id)
			.success(function(data){
				$scope.mandor =data;	
				idx=urut;			
				focus('nama');
			});
	};

	$scope.hapus=function(id,kode,nama){
		$scope.jenisTransaksi=3;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formHapus';

		customerFactory
			.getById(id)
			.success(function(data){
				$scope.mandor =data;				
			});
	};

	$scope.proses=function(){
		switch($scope.jenisTransaksi){
			case 1:		

				$scope.mandor.id='';
				mandorService
					.insert($scope.mandor)
					.success(function(data){
						growl.addInfoMessage('insert success ' + data );
						$scope.jenisTransaksi=2;
						$scope.mandor.id =data.id;
						$scope.tutupGrid = !$scope.tutupGrid;
						getAll(1);
					})
					.error(function(data){
						growl.addWarnMessage('Error insert ' + data);		
					})												
				break;
			case 2:
				mandorService
					.update($scope.mandor.id, $scope.mandor)
					.success(function(data){
						growl.addInfoMessage('edit success');						
						getAll($scope.currentPage);
						$scope.tutupGrid = !$scope.tutupGrid;
					})
					.error(function(data){
						growl.addWarnMessage('Error Updata ' + data);
						console.log(data);		
					})									
				break;			
		}
	};

	$scope.tutupDetil=function(){
		$scope.tutupGrid = !$scope.tutupGrid;
	};

	$scope.previewLaporan=function(){
		 $window.open($rootScope.pathServerJSON + '/api/mandor/report', '_blank');
	};

	
}])
