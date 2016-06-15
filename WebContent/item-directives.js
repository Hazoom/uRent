    app.controller('AddItemController', function($scope, $http, $rootScope, AddItemService, CookiesService, FileUploader, CategoriesService, ShowItemsService, MainService, Ahdin) {

        $scope.item = {};
        $scope.selectedItem = {};
        $scope.item.photos = [];
        $scope.item.ids = [];
        $scope.item.afterAddItem = false;
        $scope.item.serverError = false;
        $scope.item.success = false;
        $scope.categories = [];
        $scope.item.selectedCategory = null;
        $scope.percentage = 0;
        
        $scope.setEdit = function(bEdit) {
        	AddItemService.bEdit = bEdit;
        }
        
        var photoData = function(fileItem, response) {
            this.fileItem = fileItem;//.$$hashKey.split(":")[1];
            this.photoId = response.Id;
            this.uploadStatus = true;
        };

        photoData.prototype.changeStatus = function(){
            this.uploadStatus = false;
        }


        var SentPhotoData = function(photoData) {
            this.photoId = photoData.photoId;
            this.uploadStatus = photoData.uploadStatus;
        };


        var uploader = $scope.uploader = new FileUploader({
            url : 'urent/ItemService/uploadPhoto'
        });

        uploader.autoUpload = false;
        uploader.queueLimit = 5;
        uploader.formData = {"CCC" : CookiesService.getCookie("ccc")};

        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        };
        uploader.onAfterAddingFile = function(fileItem) {
        	
        	/* compress image */
        	if (!AddItemService.bEdit) {
	            Ahdin.compress({
	                sourceFile: fileItem._file,
	                quality: 0.2
	              }).then(function(compressedBlob) {
	            		  
	            	  compressedBlob.lastModifiedDate = new Date();
	            	  compressedBlob.name = fileItem._file.name;
	            	  compressedBlob.webkitRelativePath =  "";
	            	  
	            	  fileItem._file = compressedBlob;
	            	  fileItem.file = compressedBlob;
	            	  
	            	  uploader.queue[0]._file = compressedBlob;
	            	  uploader.queue[0]._file = compressedBlob;
	            	  
	            	  uploader.uploadAll();
	              });
        	} else {
        		fileItem.isUploaded = true;
        		fileItem.isSuccess = true;
        		fileItem.progress = 100;
        	}
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
        };
        uploader.onBeforeUploadItem = function(item) {
        	

        };
        uploader.onProgressItem = function(fileItem, progress) {
        };
        uploader.onProgressAll = function(progress) {
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            var newPhoto = new photoData(fileItem, response);
            
            if (AddItemService.bEdit && MainService.isUndefinedOrNull(newPhoto.photoId)) {
              	newPhoto.photoId = $scope.item.ids[$scope.item.photos.length];
            }
              
            $scope.item.photos.push(newPhoto);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
        };
        uploader.onCompleteAll = function() {
        };

        $scope.removeItem = function(fileItem) {
            var index;
            for (index = 0; index < $scope.item.photos.length; index++) {
                if ($scope.item.photos[index].fileItem == fileItem){
                    $scope.item.photos[index].changeStatus();
                }
            }

            fileItem.remove();
        }

        $scope.removeAll = function() {
            $scope.item.photos = [];

            uploader.clearQueue();
        }
        
        if (CategoriesService.getCategoriesInList().length == 0) {
        	CategoriesService.getAllCategories($http);
        } else {
            $scope.categories = CategoriesService.getCategories();
        }

        $scope.sendAddItemForm = function() {

            $scope.item.afterAddItem = false;
            $scope.item.serverError = false;
            $scope.item.success = false;

            var name = $scope.item.itemName;
            var description = $scope.item.itemDescription;
            var category = $scope.item.selectedCategory;
            var day = $scope.item.day;
            var week = $scope.item.week;
            var month = $scope.item.month;
            var value = $scope.item.value;
            var ccc = CookiesService.getCookie("ccc");
            var itemPhotos = []

            var index;
            for (index = 0; index < $scope.item.photos.length; index++) {
                itemPhotos.push(new SentPhotoData($scope.item.photos[index]));
            }

            AddItemService.addItem($http, ccc, name, description, category, day, week, month, value, itemPhotos, $scope.item);
        }

        $scope.sendEditItemForm = function() {

            $scope.item.afterAddItem = false;
            $scope.item.serverError = false;
            $scope.item.success = false;

            var name = $scope.item.itemName;
            var description = $scope.item.itemDescription;
            var category = $scope.item.selectedCategory;
            var day = $scope.item.day;
            var week = $scope.item.week;
            var month = $scope.item.month;
            var value = $scope.item.value;
            var ccc = CookiesService.getCookie("ccc");
            var itemPhotos = []

            var index;
            for (index = 0; index < $scope.item.photos.length; index++) {
                itemPhotos.push(new SentPhotoData($scope.item.photos[index]));
            }

            // TODO
            var availability = true;
            
            var itemID = ShowItemsService.itemToEdit;
            if (itemID == -1) {
                $scope.item.serverError = true;
                $scope.item.afterAddItem = true;
            } else {
                AddItemService.editItem($http, ccc, itemID, name, description, category, day,
                		week, month, value, itemPhotos, $scope.item, availability);
            }
        }

        $scope.loadItem = function() {
            var ccc = CookiesService.getCookie("ccc");
            var itemID = ShowItemsService.itemToEdit;
            if (itemID == -1) {
                $scope.item.serverError = true;
                $scope.item.afterAddItem = true;
            } else {
            	AddItemService.bEdit = true;
            	
                var data = { "CCC" : ccc, "ItemId" : itemID};
                return $http.post('urent/ItemService/showItemDetails', data).then(function(result) {
                    $scope.selectedItem = result.data;
                    $scope.item.itemName = $scope.selectedItem.name;
                    $scope.item.itemDescription = $scope.selectedItem.description;
                    $scope.item.selectedCategory = $scope.selectedItem.categoryId;
                    $scope.item.day = $scope.selectedItem.dailyPrice;
                    $scope.item.week = $scope.selectedItem.weeklyPrice;
                    $scope.item.month = $scope.selectedItem.monthlyPrice;
                    $scope.item.value = $scope.selectedItem.value;

                    if ($scope.selectedItem.lstPhotos != null && $scope.selectedItem.lstPhotos.length > 0) {
                    	
                    	uploader.url = 'urent/ItemService/none';
                    	
                        var index;
                        for (index = 0; index < $scope.selectedItem.lstPhotos.length; index++) {
                        	$scope.item.ids.push($scope.selectedItem.lstPhotos[index].id);

                            var base64 = 'data:image/jpg;base64,' + $scope.selectedItem.lstPhotos[index].photo;

                            var byteString;
                            if (base64.split(',')[0].indexOf('base64') >= 0)
                                byteString = atob(base64.split(',')[1]);
                            else
                                byteString = unescape(base64.split(',')[1]);

                            // separate out the mime component
                            var mimeString = base64.split(',')[0].split(':')[1].split(';')[0];

                            // write the bytes of the string to a typed array
                            var ia = new Uint8Array(byteString.length);
                            for (var i = 0; i < byteString.length; i++) {
                                ia[i] = byteString.charCodeAt(i);
                            }

                            var file = new Blob([ia], {
                                type: mimeString
                            });

                            file.lastModifiedDate = new Date();

                            uploader.addToQueue(file);
                            uploader.uploadAll();
                        }
                    }
                    
                    uploader.url = 'urent/ItemService/uploadPhoto';
                    
                    AddItemService.bEdit = false;
                });
            }
        }
    });

    app.service('AddItemService', function($rootScope) {

        return {
        	
        	bEdit : false,
        	
            addItem : function($http, ccc, name, description, category, day, week, month, value, photos, item, availability) {

                var data = { "CCC" : ccc, "ItemName" : name, "Description" : description,
                		"CategoryId" : category, "DailyPrice" : day,
                		"WeeklyPrice" : week , "MonthlyPrice" : month,
                    	"Value" : value, "PhotoIds" : photos, "Availability" : availability };

                return $http.post('urent/ItemService/addItem', data).then(function(result) {
                    var res = result.data.Response;
                    if (res == 0) {
                        item.success = true;
                        item.afterAddItem = true;
                    } else {
                        item.afterAddItem = true;
                        item.serverError = true;
                    }
                });
            },
            editItem : function($http, ccc, id, name, description, category,
            		day, week, month, value, photos, item,
            		availability) {

                var data = { "CCC" : ccc, "ItemId" : id, "ItemName" : name, "Description" : description,
                		"CategoryId" : category, "DailyPrice" : day,
                		"WeeklyPrice" : week , "MonthlyPrice" : month,
                		"Value" : value, "PhotoIds" : photos, "Availability" : availability};

                return $http.post('urent/ItemService/updateItem', data).then(function(result) {
                    var res = result.data.Response;
                    if (res == 0) {
                        item.success = true;
                        item.afterAddItem = true;
                    } else {
                        item.afterAddItem = true;
                        item.serverError = true;
                    }
                });
            },
            loadItem : function($scope, $http, ccc, itemId) {
                var data = { "CCC" : ccc, "ItemId" : itemId};
                return $http.post('urent/ItemService/showItemDetails', data).then(function(result) {
                    $scope.selectedItem = result.data;
                });
            },
            addFile: function (file) {
                _files.push(file);
                $rootScope.$broadcast('fileAdded', file.files[0].name);
            },
            clearFiles: function () {
                _files = [];
            },
            files: function () {
                var fileNames = [];
                $.each(_files, function (index, file) {
                    fileNames.push(file.files[0].name);
                });
                return fileNames;
            },
            uploadPhotos: function () {
                $.each(_files, function (index, file) {
                    file.submit();
                });
                this.clearFiles();
            },
            setProgress: function (percentage) {
                $rootScope.$broadcast('uploadProgress', percentage);
            }
        }
    });

    app.directive('upload', ['AddItemService', function service(AddItemService) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $(element).fileupload({
                    dataType: 'text',
                    add: function (e, data) {
                        AddItemService.addFile(data);
                    },
                    progressall: function (e, data) {
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        AddItemService.setProgress(progress);
                    },
                    done: function (e, data) {
                        AddItemService.setProgress(0);
                    }
                });
            }
        };
    }]);

    app.directive('ngThumb', ['$window', function($window) {

        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && (item instanceof $window.File || item instanceof $window.Blob);
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function(scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    }]);