app.service('CategoriesService', function(MainService) {

    var CategoriesService = {

        categories : [],
        categoriesInList : [],
        chosenCategory : { id : 0, "name" : "All Categories"},
        currentCategory : {},
        currentSubCategory : {},

        getAllCategories : function($http) {
            return $http.post('urent/CategoryService/getAll').then(function(result) {
                CategoriesService.categories = result.data;

                var catResult = [];
                for (var i = 0; i < CategoriesService.categories.length; i++) {
                    catResult.push({id: CategoriesService.categories[i].id, name: CategoriesService.categories[i].name, sub: false});
                    if (CategoriesService.categories[i].subCategories.length > 0) {
                        for (var j = 0; j < CategoriesService.categories[i].subCategories.length; j++) {
                            catResult.push({id: CategoriesService.categories[i].subCategories[j].id, name: CategoriesService.categories[i].subCategories[j].name, sub: true});
                        }
                    }
                }

                CategoriesService.categoriesInList = catResult;
            });
        },
        
        fatherCategoryBySub : function(subCategoryName) {
            var categories = CategoriesService.getCategories();
            for (var i = 0; i < categories.length; i++) {
                for (var j = 0; j < categories[i].subCategories.length; j++) {
                    if (categories[i].subCategories[j].name == subCategoryName) {
                        return categories[i].name;
                    }
                }
            }

            return "";
        },
        
        addFatherCategory : function(listItems) {
        	
        	if (MainService.isUndefinedOrNull(listItems)) {
        		return [];
        	}
        	
            for (var i = 0; i < listItems.length; i++) {
            	listItems[i].parentCategoryName = CategoriesService.fatherCategoryBySub(listItems[i].categoryName);
            }
            
            return listItems;
        },
        
        findIdByName : function(categoryName) {
            var categories = CategoriesService.getCategories();
            for (var i = 0; i < categories.length; i++) {
                if (categories[i].name == categoryName) {
                    return categories[i].id;
                }
            }

            return -1;
        },

        findIdByNameSub : function(categoryName, subCategoryName) {
            var categories = CategoriesService.getCategories();
            for (var i = 0; i < categories.length; i++) {
                if (categories[i].name == categoryName) {
                    for (var j = 0; j < categories[i].subCategories.length; j++) {
                        if (categories[i].subCategories[j].name == subCategoryName) {
                            return categories[i].subCategories[j].id;
                        }
                    }
                }
            }

            return -1;
        },

        getCategories : function() {
            return CategoriesService.categories;
        },

        getCategoriesInList : function() {
            return CategoriesService.categoriesInList;
        },

        getChosenCategory : function() {
            return CategoriesService.chosenCategory;
        },

        setCategory : function(category) {
            CategoriesService.chosenCategory = category;
        }
    };

    return CategoriesService;
});

app.directive("categoriesDirective", function() {
    return {
        restrict: 'E',
        templateUrl: "categories_list.html"
    };
});

app.controller("CategoriesController", function($scope, $http, $aside, CategoriesService){
    $scope.categoriesLst = [];
    $scope.categoriesInLst = [];
    $scope.chosenCategory = { id : 0, "name" : "All Categories"};
    
    if (CategoriesService.getCategoriesInList().length == 0 || CategoriesService.getCategories().length == 0) {   
        $http({
            method: 'POST',
            url: 'urent/CategoryService/getAll'
        }).success(function (result) {
                var categories = result;
                var catResult = [];
                for (var i = 0; i < categories.length; i++) {
                    catResult.push({id: categories[i].id, name: categories[i].name, sub: false});
                    if (categories[i].subCategories.length > 0) {
                        for (var j = 0; j < categories[i].subCategories.length; j++) {
                            catResult.push({id: categories[i].subCategories[j].id, name: categories[i].subCategories[j].name, sub: true});
                        }
                    }
                }
                CategoriesService.categories = result;
                CategoriesService.categoriesInList = catResult;
                $scope.categoriesLst = CategoriesService.categories;
                $scope.categoriesInLst = CategoriesService.categoriesInList;
            })
    } else {
        $scope.categoriesLst = CategoriesService.getCategories();
        $scope.categoriesInLst = CategoriesService.getCategoriesInList();
    }
    
    $scope.setCategory = function(category) {
        CategoriesService.setCategory(category);
        $scope.chosenCategory = category;
    };
    
    $scope.openAside = function(position) {
        $scope.asideState = {
          open: true,
          position: position
        };
        
        function postClose() {
          $scope.asideState.open = false;
        }
        
        $aside.open({
          templateUrl: 'categories_list.html',
          size: 'lg',
          backdrop: true,
          controller: function($scope, $http, $modalInstance, CategoriesService){
        	  $scope.categoriesLst = CategoriesService.categories;
              $scope.categoriesInLst = CategoriesService.categoriesInList;

              $scope.toggleExpanded = function(id){
            	  for (var i = 0; i < $scope.categoriesLst.length; i++){
                  	if ($scope.categoriesLst[i].id == id){
                  		$scope.categoriesLst[i].expanded = !$scope.categoriesLst[i].expanded;
                  	}
                  }
              };
              
              $scope.close = function() {
                  $modalInstance.dismiss('cancel');
              }
          }
        }).result.then(postClose, postClose);
    }

//    $scope.init = function() {
//        CategoriesService.getAllCategories($http);
//        $scope.categoriesLst = CategoriesService.categories;
//    }

});