appControllers.controller('returBarangDetilController',
	['$scope','returBarangFactory','growl','$location', '$rootScope','focus','$filter','$routeParams','supplierFactory','barangFactory','returDtFactory','$q','$window','$uibModal',
	function($scope, returBarangFactory, growl, $location, $rootScope,focus, $filter, $routeParams, supplierFactory, barangFactory, returDtFactory,$q, $window, $uibModal){
		
	$scope.statusTrans;	

	// Paging
	$scope.totalItems;
	$scope.itemsPerPage= 10;
	$scope.currentPage = 1;

	//$scope.supplierSelected={};
	// tanggal
		$scope.today = function() {
	    	$scope.tglRetur = new Date();	    	
		};		

		$scope.open = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.opened = true;		    
		};

		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};
	// END tanggal

 	$scope.pageChanged=function(){
 		getAllDetil($scope.currentPage); 	 			  
    };

    $scope.saveAtas=function(){

    	var promise = saveHdr()
    			.then(function(){
					$scope.kondisiView = !$scope.kondisiView;    				
    			},function(error){
    				growl.addInfoMessage('Error saving hdr ' + error);
    			})
    }

    $scope.approvedTrans=function(){
    	if($scope.returBarangDts.length==0){
    		growl.addInfoMessage("Barang belum ada , silahkan di isi!!!");
    		return;
    	}

    	var modalInstance = $uibModal.open({
			templateUrl: 'js/app/dialogForm/dialogForm.html',
			controller: 'dialogController',
			size: '',
		    resolve: 
		    	{
	        		pesan: function () {
	          			return "Apakah anda yakin akan APPROVE data ini ?";
	        		},
	        		id: function () {
	          			return $scope.returHd.id;
	        		}

      			}
	    });

	    modalInstance
	    	.result.then(function(idHd){
		    	var idGudang = $rootScope.globals.currentUser.idGudang;
		    	returBarangFactory
		    		.approve(idHd, idGudang)
		    		.then(function(response){
		    			$scope.returHd = response.data;
		    			$scope.kondisiView = true;
						$scope.approved =true;
		    		});

	    	},function(pesan){
	    		growl.addInfoMessage("cancel approved" );
	    	})
    }

    $scope.edit =  function(){
    	$scope.kondisiView = !$scope.kondisiView;
    	focus('suppliers');
    };

    $scope.hapusDetil = function(idDetil, nama){
    	var modalInstance = $uibModal.open({
			templateUrl: 'js/app/dialogForm/dialogForm.html',
			controller: 'dialogController',
			size: '',
		    resolve: 
		    	{
	        		pesan: function () {
	          			return "Apakah anda yakin akan menghapus data [" + nama + "] ini ?";
	        		},
	        		id: function () {
	          			return idDetil;
	        		}

      			}
	    });

	    modalInstance
	    	.result.then(function(id){
	    		//delete
	    		returDtFactory
	    			.delete(id)
	    			.then(function(response){
	    				growl.addInfoMessage("success delete");
	    				//getall
	    				getAllDetil(1);
	    				hitungTotalBelanja();
	    			},function(error){
	    				growl.addInfoMessage("gagal delete");
	    			})

	    		growl.addInfoMessage("delete id" + id);
	    	},function(pesan){
	    		growl.addInfoMessage("cancel del" );
	    	})


    }

    function saveHdr(){

    	var deferred = $q.defer();

    	if($scope.supplierSelected==null || $scope.supplierSelected==undefined || $scope.supplierSelected==''){    		
    		growl.addInfoMessage("supplier belum terisi !!");
    		deferred.reject('supplier belum ada');   
    	}    	
    	else 
    	{
	    	var vTgl = $filter('date')($scope.tglRetur,'yyyy-MM-dd');
	    	var hdrDto={
			    'id' : $scope.returHd.id,
			    'idSupplier' : $scope.supplierSelected.id,			    
			    'tglRetur' : vTgl,
			    'keterangan' : $scope.returHd.keterangan,
			    'userUpdate' : $rootScope.globals.currentUser.nama    		
	    	}

	    	if($scope.returHd.id== null){
	    		returBarangFactory
		    		.insert(hdrDto)
		    		.then(function(response){
		    			$scope.returHd = response.data;	    				    			
		    			console.log("save hdr success");
		    			focus('barang');
		    			deferred.resolve('true');
		    		},function(data, status, headers, config, statusText){
		    			deferred.reject('error save ' + data.message);   
		    			console.log("data : " + data + " status " + status);
		    		})    		
	    	}else{
	    		returBarangFactory
	    			.update($scope.returHd.id,hdrDto)
	    			.then(function(response){
		    			$scope.returHd = response.data;	    				    			
		    			console.log("save hdr success");
		    			focus('barang');
		    			deferred.resolve('true');
		    		}, function(error){
		    			console.log('error');	
		    		})    		
	    	}
	    	
	    }
	    return deferred.promise;
    }

    function getAllDetil(hal){
    	//console.log('get all detil idhd = '+$scope.returHd.id);
    	returDtFactory
    		.getByIdHd($scope.returHd.id,hal,$scope.itemsPerPage)
    		.success(function(data){
    			$scope.returBarangDts=data.content;
    			$scope.totalItems = data.totalElements;
    		})
    };

    $scope.getSupplierByNama = function(cariNama){
    
		return	supplierFactory
	    	 		.getByNamaPage(cariNama, 1, 5)
					.then(function(response){
	    				//console.log('load http' + response.data.nama); 
	    				suppliers=[];
	    				angular.forEach(response.data.content, function(item){
			                suppliers.push(item);
			                // console.log('tambah :' + item.namaSatuan);
			            });
	    				return suppliers;
	    			})
    }

    $scope.getBarangByNama = function(cariNama){
    	console.log('load http'); 

		return barangFactory
				.getByNamaPage(cariNama, 1, 10)
				.then(function(response){
					console.log('load http' + response.data.nama); 
					barangs=[];
					angular.forEach(response.data.content, function(item){
		                barangs.push(item);		                
		            });
					return barangs;
				})
    };

    $scope.previewLaporan=function(){
		 $window.open($rootScope.pathServerJSON + '/api/returHd/report/'+$scope.returHd.id, '_blank');
	}

    $scope.simpanDetil = function(){
    	if($scope.returHd.id == null){

    		var promise = saveHdr()
    			.then(function(){
    				console.log('function save hdr sdh sukses masuk ke save detil');
    				saveDetil();
    			},function(error){
    				growl.addInfoMessage('Error saving hdr ' + error);
    			})    		
    	}else{    		
    		saveDetil();
    	}
    }

    $scope.transaksiBaru = function(){
    	newRec();    	
    }

    function hitungTotalBelanja(){
    	returBarangFactory
    		.hitungTotal($scope.returHd.id)
    		.then(function(response){
    			$scope.totalRetur= response.data;
    		},function(error){
    			$scope.totalRetur=0;
    		})
    	
    }

    function saveDetil(){
    	var returDto={					    
		    "idBarang": $scope.barangSelected.id,
		    "harga": $scope.returDt.harga,
		    "jumlah": $scope.returDt.jumlah,
		    "idHd": $scope.returHd.id
		};

		returDtFactory		
			.insert(returDto)
			.then(function(data){
				focus('barang');
				// get all deti	
				$scope.returDt={			
				    "id": null,
				    "barang": null,
				    "harga": null,
				    "jumlah": null,
				    "returSupplierHd": null
				};			
				$scope.barangSelected = null;
				getAllDetil($scope.currentPage);
				hitungTotalBelanja();	
			})
    	
    }

    function newRec(){
    	$scope.today();
    	$scope.approved =false;
    	$scope.kondisiView=false;
    	$scope.supplierSelected=null;
    	var suppliers=[];
		var barangs=[];


		$scope.returHdDetils=[];		
		
		$scope.returHd={
		    "id": null,
		    "supplier": null,
		    "keterangan": null,
		    "statusTerima": null,
		    "lastUpdate": null,
		    "userUpdate": null
		};	

		$scope.returDt={			
		    "id": null,
		    "barang": null,
		    "harga": null,
		    "jumlah": null,
		    "returSupplierHd": null
		}	

		$scope.statusTrans ='NEW';	
		$scope.totalBelanja=0;	
		// Paging
		$scope.totalItems;
		$scope.itemsPerPage= 10;
		$scope.currentPage = 1;

		$scope.returBarangDetils=[];
    	$scope.totalItems = 0;
		
    }

	function startModule(){	

		$scope.approved =false;
		newRec();
		
		var idParam = $routeParams.idHdr;
		switch(idParam){
			case '0' :
					//new
					$scope.statusTrans ='NEW';
					//console.log("0 baru");
					focus('suppliers');
					break;
			case 'undefined':
					// new
					$scope.statusTrans ='NEW';
					//console.log("undefined baru");
					focus('suppliers');
					break;
			default :
					// edit
					$scope.statusTrans ='EDIT';
					console.log("edit");
					returBarangFactory					
						.getById(idParam)
						.then(function(response){
							$scope.returHd = response.data;
							$scope.tglRetur = new Date($scope.returHd.tglRetur);
							$scope.supplierSelected = $scope.returHd.supplier;
							getAllDetil(1);
							hitungTotalBelanja();
							if($scope.returHd.statusRetur=="APPROVED"){
								$scope.kondisiView = true;
								$scope.approved =true;
							}else{
								$scope.kondisiView = false;
								focus('barang');								
							}
						})	
		}	
	};

	startModule();

}]);
