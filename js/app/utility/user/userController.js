appControllers.controller('userController', ['$scope','userFactory','growl','AuthenticationService','Base64','gudangFactory',
	function($scope,userFactory,growl,AuthenticationService,Base64, gudangFactory){

	// index untuk update tampilan abis update ke database, 
	// biar idak usah narek db lagi ye
	var idxEdit;

	// scope password terpisah dengan scope user
	$scope.password="";
	$scope.pesanPassword=false;

	$scope.statusUsers=['ACTIVE','NONACTIVE'];
	$scope.tutupGrid=false;
	$scope.classForm='';
	$scope.users=[];
	$scope.gudangs=[];
	$scope.orderUser='nama';
	$scope.user={
		id: 0,		
		nama: "",
		password: "",		
		status:"ACTIVE",
		nama:""
	};
	$scope.search='';

	// Paging
	$scope.totalItems;
	$scope.itemsPerPage= 10;
	$scope.currentPage = 1;

 	$scope.pageChanged=function(){
 		getAllUser($scope.currentPage); 		  
    };

	$scope.jenisTransaksi;
	//1. add
	//2. edit
	//3. deleter	

	getAllUser(1);
	getAllGudang();

	$scope.getAll=function(){
		getAllUser(1);
	};

	
	$scope.tambahUser=function(){
		$scope.jenisTransaksi=1;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formTambah';		
		$scope.user={
			id: '[Automatic]',		
			nama: "",
			password: "",			
			status:"ACTIVE",
			nama:"",
			gudang:""
		};	
		$scope.password="";
		$scope.pesanPassword=true;			
	};

	function getAllUser(halaman){		

		if($scope.search===''){
			userFactory
				.getAllUser(halaman,$scope.itemsPerPage)
				.success(function (data){
				 	$scope.users = data.content ;
				 	$scope.totalItems = data.totalElements;
				 	growl.addInfoMessage(data.content.length);
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data !",{ttl: 4000});		
				});				
		}else{
			userFactory
				.getUserByNama($scope.search,halaman,$scope.itemsPerPage)
				.success(function (data){
				 	$scope.users = data.content ;
				 	$scope.totalItems = data.totalElements;
				}).error(function(data){
					growl.addWarnMessage("Error Loading getAll data by nama user !",{ttl: 4000});		
				});					
		}
		
	};

	function getAllGudang(){
		gudangFactory
			.getAll()
			.then(function(response){
				$scope.gudangs=response.data;
			})
	}

	$scope.urut=function(urut_berdasar){
		$scope.orderUser=urut_berdasar;		
	};

	$scope.ubahUser=function(id,urut){
		$scope.pesanPassword=false;
		$scope.jenisTransaksi=2;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formUbah';
		$scope.password="";
		idxEdit=urut;			
		userFactory
			.getUserById(id)
			.success(function(data){
				$scope.user =data;					
			});
		
		growl.addInfoMessage(urut);

	};

	$scope.hapusUser=function(id, urut){
		$scope.pesanPassword=false;
		$scope.jenisTransaksi=3;
		$scope.tutupGrid = !$scope.tutupGrid;
		$scope.classForm = 'formHapus';
		$scope.password="";
		idxEdit=urut;			
		userFactory
			.getUserById(id)
			.success(function(data){
				$scope.user =data;				
			});		
		growl.addInfoMessage(id);
	};

	$scope.proses=function(){

		var refreshUlang = true;

		switch($scope.jenisTransaksi){
			case 1:
				$scope.user.id='';
				$scope.user.password=AuthenticationService.getAuthCode($scope.user.userId,$scope.password);
				
				userFactory
					.insertUser($scope.user)
					.success(function(data){
						growl.addInfoMessage('insert success ' + data );
						$scope.jenisTransaksi=2;
						$scope.user.id=data.id;
						//$scope.users.push(data);
						getAllUser(1);
						$scope.tutupGrid = !$scope.tutupGrid;
					})
					.error(function(data){
						growl.addWarnMessage('Error insert ' + data);		
					})
				
				break;
			case 2:
				if($scope.password===""){
					$scope.user.password=""
				}else{
					$scope.user.password=Base64.encode($scope.user.userId + ':' +  $scope.password) ;
				};

				// console.log("user id[" + $scope.user.userId + "]password [" + $scope.password+"]");
				// console.log("auth code " + AuthenticationService.getAuthCode($scope.user.userId,$scope.password));				
				userFactory
					.updateUser($scope.user.id, $scope.user)
					.success(function(data){
						growl.addInfoMessage('edit success');						
						getAllUser(1);
						$scope.tutupGrid = !$scope.tutupGrid;
						//$scope.users[idxEdit]=data;
					})
					.error(function(data){						
						growl.addWarnMessage('Error Updata ' + data);
						console.log(data);		
					})				
				break;
			case 3:
				userFactory
					.deleteUser($scope.user.id)
					.success(function(data){
						delete $scope.users[idxEdit];
						//refreshUlang=true;
						// alert('refresh ulang = true');
						getAllUser(1);
						$scope.tutupGrid = !$scope.tutupGrid;
						growl.addWarnMessage('Delete success');		
					})
					.error(function(data){
						growl.addWarnMessage('Error Delete ' + data)								
					});				
				break;			
		};

	};

	$scope.tutupDetil=function(){
		$scope.tutupGrid = !$scope.tutupGrid;
	};	

}])