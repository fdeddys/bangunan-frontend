appControllers.controller('penerimaanBarangDetilController',['$scope','penerimaanHdFactory','growl','$location', '$rootScope','focus','$filter','$routeParams','supplierFactory','barangFactory','penerimaanDtFactory','$q','$window','$uibModal',
	function($scope, penerimaanHdFactory, growl, $location, $rootScope,focus, $filter, $routeParams, supplierFactory, barangFactory, penerimaanDtFactory,$q, $window, $uibModal){
		
	$scope.statusTrans;	

	// Paging
	// $scope.totalItems;
	// $scope.itemsPerPage= 6;
	// $scope.currentPage = 1;

	//$scope.supplierSelected={};
	// tanggal
		$scope.today = function() {
	    	$scope.tglTerima = new Date();	    	
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
    	if($scope.penerimaanBarangDetils.length==0){
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
	          			return $scope.penerimaanHd.id;
	        		}

      			}
	    });

	    modalInstance
	    	.result.then(function(idHd){
		    	var idGudang = $rootScope.globals.currentUser.idGudang;
		    	penerimaanHdFactory
		    		.approve(idHd, idGudang)
		    		.then(function(response){
		    			$scope.penerimaanHd = response.data;
		    			$scope.kondisiView = true;
						$scope.approved =true;
		    		});

	    	},function(pesan){
	    		growl.addInfoMessage("cancel approved" );
	    	})


    }

    $scope.edit =  function(){
    	$scope.kondisiView = !$scope.kondisiView;
    	focus('noFaktur');
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
	    		penerimaanDtFactory
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
	    	var vTgl = $filter('date')($scope.tglTerima,'yyyy-MM-dd');
	    	var hdrDto={
			    'id' : $scope.penerimaanHd.id,
			    'idSupplier' : $scope.supplierSelected.id,
			    'noFaktur' : $scope.penerimaanHd.noFaktur,
			    'tglTerima' : vTgl,
			    'keterangan' : $scope.penerimaanHd.keterangan,
			    'userName' : $rootScope.globals.currentUser.nama    		
	    	}

	    	if($scope.penerimaanHd.id== null){
	    		penerimaanHdFactory
		    		.insert(hdrDto)
		    		.then(function(response){
		    			$scope.penerimaanHd = response.data;	    				    			
		    			console.log("save hdr success");
		    			focus('barang');
		    			deferred.resolve('true');
		    		},function(data, status, headers, config, statusText){
		    			deferred.reject('error save ' + data.message);   
		    			console.log("data : " + data + " status " + status);
		    		})    		
	    	}else{
	    		penerimaanHdFactory
	    			.update($scope.penerimaanHd.id,hdrDto)
	    			.then(function(response){
		    			$scope.penerimaanHd = response.data;	    				    			
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
    	//console.log('get all detil idhd = '+$scope.penerimaanHd.id);
    	penerimaanDtFactory
    		.getByIdHd($scope.penerimaanHd.id,hal,$scope.itemsPerPage)
    		.success(function(data){
    			$scope.penerimaanBarangDetils=data.content;
    			$scope.totalItems = data.totalElements;
    		})
    };

    $scope.getSupplierByNama = function(cariNama){
    	// console.log('masuk function '+cariNama); 

    	// return
    	// 	supplierFactory
    	// 		.getByNamaPage("tes", 1, 10)
    	// 		.then(function(response){
    	// 			console.log('masuk function');
    	// 			angular.forEach(response.data.content, function(item){
		   //              suppliers.push(item);
		   //              console.log('tambah :' + item.namaSatuan);
		   //          });
    	// 			return suppliers;
    	// 		})
    	// 		.error(function(data){
    	// 			console.log('error ');
    	// 		})
    	// 
		
		// return $http({
		// 			method:'GET',
		// 			url : 'http://localhost:8088/api/supplier/nama/' + cariNama + '/hal/1/jumlah/5'
		// 		})

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


    	// return $http
    	// 		.get('http://localhost:8088/api/supplier/nama/' + cariNama + '/hal/1/jumlah/5')
    	// 		.then(function(response){
    	// 			//console.log('load http' + response.data.nama); 
    	// 			angular.forEach(response.data.content, function(item){
		   //              suppliers.push(item);
		   //              // console.log('tambah :' + item.namaSatuan);
		   //          });
    	// 			return suppliers;
    	// 		})

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
		 $window.open($rootScope.pathServerJSON + '/api/penerimaanHd/report/'+$scope.penerimaanHd.id, '_blank');
	}

    $scope.simpanDetil = function(){
    	if($scope.barangSelected == undefined){
    		growl.addInfoMessage("barang belum terpilih")
    		return;
    	}

    	if($scope.penerimaanHd.id == null){

    		var promise = saveHdr()
    			.then(function(){
    				console.log('function save hdr sdh sukses masuk ke save detil');
    				saveDetil();
    			},function(error){
    				growl.addInfoMessage('Error saving hdr ' + error);
    			})

    		// //simpan hdr
    		// if ($scope.saveHdr()==true){
    		// 	// save hdr
    			
    		// }else{
    		// 	//save detil
    			
    		// }
    	}else{    		
    		saveDetil();
    	}
    }

    $scope.transaksiBaru = function(){
    	newRec();
    	focus('noFaktur');
    }

    function hitungTotalBelanja(){
    	penerimaanHdFactory
    		.hitungTotal($scope.penerimaanHd.id)
    		.then(function(response){
    			$scope.totalBelanja= response.data;
    		},function(error){
    			$scope.totalBelanja=0;
    		})
    	
    }

    function saveDetil(){
    	var penerimaanDto={					    
		    "idBarang": $scope.barangSelected.id,
		    "harga": $scope.penerimaanDt.harga,
		    "jumlah": $scope.penerimaanDt.jumlah,
		    "idPenerimaanHd": $scope.penerimaanHd.id
		};

		penerimaanDtFactory		
			.insert(penerimaanDto)
			.then(function(data){
				focus('barang');
				// get all deti	
				$scope.penerimaanDt={			
				    "id": null,
				    "barang": null,
				    "harga": null,
				    "jumlah": null,
				    "penerimaanHd": null
				};			
				$scope.barangSelected = null;
				getAllDetil($scope.currentPage);
				hitungTotalBelanja();	
			})
    	
    }

    function newRec(){
    	$scope.today();
    	$scope.approved =false;
    	$scope.isPaid =false;
    	$scope.kondisiView=false;
    	$scope.supplierSelected=null;
    	var suppliers=[];
		var barangs=[];


		$scope.penerimaanHdDetils=[];		
		
		$scope.penerimaanHd={
		    "id": null,
		    "supplier": null,
		    "noFaktur": null,
		    "tglTerima": null,
		    "keterangan": null,
		    "statusTerima": null,
		    "lastUpdate": null,
		    "userUpdate": null
		};	

		$scope.penerimaanDt={			
		    "id": null,
		    "barang": null,
		    "harga": null,
		    "jumlah": null,
		    "penerimaanHd": null
		}	

		$scope.statusTrans ='NEW';	
		$scope.totalBelanja=0;	
		// Paging
		$scope.totalItems;
		$scope.itemsPerPage= 6;
		$scope.currentPage = 1;

		$scope.penerimaanBarangDetils=[];
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
					focus('noFaktur');
					break;
			case 'undefined':
					// new
					$scope.statusTrans ='NEW';
					//console.log("undefined baru");
					focus('noFaktur');
					break;
			default :
					// edit
					$scope.statusTrans ='EDIT';
					console.log("edit");
					penerimaanHdFactory					
						.getById(idParam)
						.then(function(response){
							$scope.penerimaanHd = response.data;
							$scope.tglTerima = new Date($scope.penerimaanHd.tglTerima);
							$scope.supplierSelected = $scope.penerimaanHd.supplier;
							getAllDetil(1);
							hitungTotalBelanja();
							if($scope.penerimaanHd.statusTerima=="APPROVED"){
								$scope.kondisiView = true;
								$scope.approved =true;
							}else{
								if($scope.penerimaanHd.statusTerima=="PAID"){
									$scope.kondisiView = true;
									$scope.isPaid =true;
								}else{
									$scope.kondisiView = false;
									focus('barang');																	
								}
							}
						})					

		}
		// if(idParam == undefined){
		// 	console.log("id param tidak ada");			
		// }else{
		// 	if(idParam==0){
		// 		console.log(baru)
		// 	}else{
		// 		console.log("id param " + idParam);							
		// 	}
		// }

		
		//$scope.getAll();	

	};




	startModule();

}]);
