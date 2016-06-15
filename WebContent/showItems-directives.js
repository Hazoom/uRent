	app.directive("itemlistDirective", function() {
	    return {
	        restrict: 'E',
	        templateUrl: "productlist-list.html"
	    };
	});
	
	app.directive("itemgridDirective", function() {
	    return {
	        restrict: 'E',
	        templateUrl: "productlist-grid.html"
	    };
	});
	
	app.directive("showitemDirective", function() {
	    return {
	        restrict: 'E',
	        templateUrl: "showItem.html"
	    };
	});
	
	app.directive("productlistDirective", function() {
	    return {
	        restrict: 'E',
	        templateUrl: "productlist.html"
	    };
	});
	
	app.directive("itemtabsDirective", function() {
	    return {
	        restrict: 'E',
	        templateUrl: "item-tabs.html"
	    };
	});
	
	app.directive("itemdescriptionDirective", function() {
	    return {
	        restrict: 'E',
	        templateUrl: "item-description.html"
	    };
	});
	
	app.directive("itemreviewsDirective", function() {
	    return {
	        restrict: 'E',
	        templateUrl: "item-reviews.html"
	    };
	});
	
	app.directive("itemspecsDirective", function() {
	    return {
	        restrict:'E',
	        templateUrl: 'item-specs.html'
	    };
	});
	
	app.controller('ShowItemsController', function($scope, $http, $window, $stateParams, MainService, ShowItemsService, CookiesService) {
	
		$scope.glued = true;
		
		$scope.pages = {};
		$scope.pages.resultsPerPage = 7;
		$scope.pages.currentPage = ShowItemsService.currentPage;
		
		$scope.maxSize = 5;
		
		$scope.myItemsList = false;
		  
	    $scope.items = ShowItemsService.items;
	    $scope.sorts = [
    	        {display: "Date: Descending", option:'DatePublished', order: 'Desc'},
    	        {display: "Date: Ascending", option:'DatePublished', order: 'Asc'},
    	        {display: "Rating: Descending", option:'Rate', order: 'Desc'},
    	        {display: "Rating: Ascending", option:'Rate', order: 'Asc'},
    	        {display: "Daily Price: Descending", option:'DailyPrice', order: 'Desc'},
    	        {display: "Daily Price: Ascending", option:'DailyPrice', order: 'Asc'},
    	        {display: "Weekly Price: Descending", option:'WeeklyPrice', order: 'Desc'},
    	        {display: "Weekly Price: Ascending", option:'WeeklyPrice', order: 'Asc'},
    	        {display: "Monthly Price: Descending", option:'MonthlyPrice', order: 'Desc'},
    	        {display: "Monthly Price: Ascending", option:'MonthlyPrice', order: 'Asc'},
    	        {display: "Value: Descending", option:'Value', order: 'Desc'},
    	        {display: "Value: Ascending", option:'Value', order: 'Asc'},
                {display: "Rent Count: Ascending", option:'RentCount', order: 'Asc'},
                {display: "Rent Count: Descending", option:'RentCount', order: 'Desc'},
                {display: "Distance: Ascending", option:'Distance', order: 'Asc'},
                {display: "Distance: Descending", option:'Distance', order: 'Desc'}
	    ];
	    
	    for (var i = 0; i < $scope.sorts.length; i++) {
	    	if ($scope.sorts[i].option == ShowItemsService.selectedOrder.option &&
	    			$scope.sorts[i].order == ShowItemsService.selectedOrder.order) {
	            $scope.selectedOrder = $scope.sorts[i];
	            break;
	    	}
	    }
    	
    	$scope.sortChanged = function() {
        	var fOfCurrURL = ShowItemsService.selectedOrder.option;
        	var sOfCurrURL = ShowItemsService.selectedOrder.order;
        	
        	ShowItemsService.selectedOrder.option = $scope.selectedOrder.option;
        	ShowItemsService.selectedOrder.order = $scope.selectedOrder.order;
        	ShowItemsService.selectedOrder.display = $scope.selectedOrder.display;
        	
        	var href = $window.location.href;
        	if (href.indexOf("f=") > -1 && href.indexOf("s=") > -1) {
        		href = href.replace("f=" + fOfCurrURL, "f=" + $scope.selectedOrder.option);
        		href = href.replace("s=" + sOfCurrURL, "s=" + $scope.selectedOrder.order);
        		$window.location.href = href
        	} else {
        		$window.location.href = (href + "&f=" + $scope.selectedOrder.option + "&s=" + $scope.selectedOrder.order);
        	}
    	}
        	
    	$scope.resultsPerPageChanged = function() {
    		ShowItemsService.currentPage = $scope.pages.currentPage;
    		
    		this.loadItemsOfUser();
    	}
		
		$scope.pageChangedCategory = function() {
			
	    	var pageOfCurrURL = $stateParams.p;
	    	
	    	ShowItemsService.currentPage = $scope.pages.currentPage;
	    	$window.location.href = $window.location.href.replace("p=" + pageOfCurrURL, "p=" + $scope.pages.currentPage.toString());
		};
	
		$scope.totalItemsMyItems = function() {
			return ShowItemsService.totalItemsMyItems;
		};
		
		$scope.pageChangedMyItems = function() {
			
	    	var pageOfCurrURL = $stateParams.p;
	    	
	    	ShowItemsService.currentPage = $scope.pages.currentPage;
	    	$window.location.href = $window.location.href.replace("p=" + pageOfCurrURL, "p=" + $scope.pages.currentPage.toString());
		};
		
	    $scope.initCurrentPage = function(){
	    	$scope.currentPage = $stateParams.p;
	    }
		
		$scope.totalItemsCategory = function() {
			return ShowItemsService.totalItemsCategory;
		};
		
	    $scope.loadItemsOfUser = function() {
	        var ccc = CookiesService.getCookie("ccc");
	        
	        if (!angular.isUndefined($stateParams.customerId)){
	    		$scope.myItemsList = false;
	        	ShowItemsService.loadItemsOfUser(ccc, $scope, $stateParams.customerId, ShowItemsService.currentPage);
	        }
	        else {
	    		$scope.myItemsList = true;
	        	ShowItemsService.loadItemsOfUser(ccc, $scope, null, ShowItemsService.currentPage);
	        }
	    };
	
	    $scope.loadItemsByCategory = function() {
	        var ccc = CookiesService.getCookie("ccc");
        	ShowItemsService.loadItemsByCategory(ccc, $scope, $stateParams.category, ShowItemsService.currentPage,
        			ShowItemsService.selectedOrder.option,  ShowItemsService.selectedOrder.order);
	    }
	
	    $scope.loadItemsBySubCategory = function() {
	        var ccc = CookiesService.getCookie("ccc");
	        ShowItemsService.loadItemsBySubCategory(ccc, $scope, $stateParams.category, $stateParams.sonCategory,
	        		ShowItemsService.currentPage, ShowItemsService.selectedOrder.option, ShowItemsService.selectedOrder.order);
	    }
	
	    $scope.getCurrentCategory = function() {
	        return ShowItemsService.currentCategory;
	    }
	
	    $scope.getCurrentSubCategory = function() {
	        return ShowItemsService.currentSubCategory;
	    }
	
	    $scope.getCurrentPage = function() {
	        return ShowItemsService.currentPage;
	    }
	
	    $scope.setCurrentPage = function(page) {
	        ShowItemsService.currentPage = page;
	    }
	
	    $scope.getActivePage = function() {
	        return ShowItemsService.activePage;
	    }
	
	    $scope.getCurrentView = function() {
	        return ShowItemsService.currentView;
	    }
	
	    $scope.setCurrentView = function(view) {
	        ShowItemsService.currentView = view;
	    }
	
	    $scope.init = function(){
	        ShowItemsService.currentView = 1;
	        ShowItemsService.selectedOrder = {display: "Date: Descending", option:'DatePublished', order: 'Desc'};
	        ShowItemsService.serverError = false;
	    }
	
	    $scope.removeItem = function(itemID) {
	        var ccc = CookiesService.getCookie("ccc");
	        ShowItemsService.removeItem($scope, $http, ccc, itemID);
	    }
	
	    $scope.hasError = function() {
	        return ShowItemsService.serverError;
	    }
	
	    $scope.saveItemToEdit = function(id) {
	        ShowItemsService.saveItemToEdit(id);
	    }
	    
	    $scope.getChunkedItems = function() {
	    	return ShowItemsService.listItems;
	    }
	    
	    $scope.deleteConfirmationPopover = {
		    title: 'Are you sure?',
		    templateUrl: 'deleteConfirmationPopover.html'
	    };
	});
	
	app.service('ShowItemsService', function($http, $q, $window, $route, LocationService, CategoriesService, CookiesService, MainService, UserService, $location, $anchorScroll) {
	
	    var chunk = function(arr, size) {
	        var newArr = [];
	        
	        if (arr != null) {
		        for (var i=0; i<arr.length; i+=size) {
		            newArr.push(arr.slice(i, i+size));
		        }
	        }
	        return newArr;
	    };
	
	    var ShowItemsService = {
	
	        selectedItem : {},
	        currentPage : 1,
	        activePage : 1,
	        currentCategory : "",
	        currentSubCategory : "",
	        resultsPerPage : 9,
	        selectedOrder : {display: "Date: Descending", option:'DatePublished', order: 'Desc'},
	        currentView : 1,
	        serverError : false,
	        itemToEdit : -1,
	        listItems : [],
	        items : [],
	        totalItemsMyItems : 1,
	        totalItemsCategory : 1,
	        showMore : false,
	
	        loadCategoriesPage : function(f, s, category, p, sub, sonCategory) {
		        ShowItemsService.currentView = 1;
		        ShowItemsService.serverError = false;
		        
		        ShowItemsService.currentPage = p;
		        var ccc = CookiesService.getCookie("ccc");
		        
		        if (f != null && s != null){
			        ShowItemsService.selectedOrder.option = f;
			        ShowItemsService.selectedOrder.order = s;
		        }
	        	if (sub) {
	        		return ShowItemsService.loadItemsBySubCategory(ccc, category, sonCategory, ShowItemsService.currentPage, ShowItemsService.selectedOrder.option,  ShowItemsService.selectedOrder.order);
	        	} else {
	        		return ShowItemsService.loadItemsByCategory(ccc, category, ShowItemsService.currentPage, ShowItemsService.selectedOrder.option,  ShowItemsService.selectedOrder.order);
	        	}
	        },
	        
	        loadItemsOfUser : function(ccc, $scope, userId, pageNum) {
	            ShowItemsService.serverError = false;
	            
	            ShowItemsService.listItems = [];
	            
	            var searchParameters = "";
	            var myItemsInd = false;
	            
	            if (!MainService.isUndefinedOrNull(userId)){
	            	searchParameters = "customer=" + userId;
	            }
	            else {
	            	myItemsInd = true;
	            }
	            
	            var selectedOrder = $scope.selectedOrder;
	            
            	if (selectedOrder.option == 'Distance') {
            		
            		if (searchParameters.length > 0) {
            			searchParameters += "&";
            		}
            		
                	searchParameters += ("maxDistance=" + 100000 + "&units=KM");
            	}
	            
                var data = { "CCC" : ccc, "PageNum" : pageNum, "ResultsPerPage" : $scope.pages.resultsPerPage,
                    "OrderOption" : selectedOrder.option, "OrderOrder" : selectedOrder.order,
                    "searchParameters" : searchParameters, "MyItemsInd" : myItemsInd};
	
	            return $http.post('urent/SearchService/search', data).then(function(result) {
	                $scope.items = result.data[1];
	                ShowItemsService.totalItemsMyItems = result.data[0];
	                ShowItemsService.listItems = chunk(CategoriesService.addFatherCategory($scope.items), 3);
	                $scope.chunkedItems = ShowItemsService.listItems;
	            });              
	        },
	
	        loadItemsByCategory : function(ccc, category, pageNum, orderOption, orderOrder) {
	            var searchParameters = "category=" + CategoriesService.findIdByName(category);

            	if (orderOption == 'Distance') {
                	searchParameters += ("&maxDistance=" + 100000 + "&units=KM");
            	}
            	
	            if (!MainService.isUndefinedOrNull(orderOption) && !MainService.isUndefinedOrNull(orderOrder)) {
	                var data = { "CCC" : ccc,
	                    "PageNum" : pageNum, "ResultsPerPage" : ShowItemsService.resultsPerPage,
	                    "OrderOption" : orderOption, "OrderOrder" : orderOrder,
	                    "searchParameters" : searchParameters};
	            } else {
	                  var data = { "CCC" : ccc,
	                    "PageNum" : pageNum, "ResultsPerPage" : ShowItemsService.resultsPerPage,
	                    "OrderOption" : "DatePublished", "OrderOrder" : "Desc",
	                    "searchParameters" : searchParameters};
	            }
	
	            ShowItemsService.currentSubCategory = "";
	            return ShowItemsService.loadItems(data, pageNum, category, null);
	        },
	
	        loadItemsBySubCategory : function(ccc, category, sonCategory, pageNum, orderOption, orderOrder) {
	            var searchParameters = "category=" + CategoriesService.findIdByNameSub(category, sonCategory);
	            
            	if (orderOption == 'Distance') {
                	searchParameters += ("&maxDistance=" + 100000 + "&units=KM");
            	}
            	
	            if (!MainService.isUndefinedOrNull(orderOption) && !MainService.isUndefinedOrNull(orderOrder)) {
	                var data = { "CCC" : ccc,
	                    "PageNum" : pageNum, "ResultsPerPage" : ShowItemsService.resultsPerPage,
	                    "OrderOption" : orderOption, "OrderOrder" : orderOrder,
	                    "searchParameters" : searchParameters};
	            } else {
	                var data = { "CCC" : ccc,
	                    "PageNum" : pageNum, "ResultsPerPage" : ShowItemsService.resultsPerPage,
	                    "OrderOption" : "DatePublished", "OrderOrder" : "Desc",
	                    "searchParameters" : searchParameters};
	            }
	
	            ShowItemsService.currentSubCategory = sonCategory;
	            return ShowItemsService.loadItems(data, pageNum, category, sonCategory);
	        },
	
	        loadItems : function(data, pageNum, category, subCategoryName) {
	        	
	        	ShowItemsService.listItems = [];

	            ShowItemsService.currentCategory = category;
	            return $http.post('urent/SearchService/search', data).then(function(result) {
	                ShowItemsService.items = result.data[1];
	                ShowItemsService.totalItemsCategory = result.data[0];
	                ShowItemsService.listItems = chunk(CategoriesService.addFatherCategory(ShowItemsService.items), 3);
	                
	                return ShowItemsService.listItems;
	            });
	        },
	
	        getItem : function(itemId, feedbackSection, sectionSize) {
	        	
	        	var ccc = CookiesService.getCookie("ccc");
	        	
	        	var date = new Date();
	        	var currYear = date.getYear() - 100 + 2000;
	        	var currMonth = (date.getMonth() + 1) % 12;
	        	
	            var data = { "CCC" : ccc, "ItemId" : itemId, "Month" : currMonth, "Year" : currYear,
	            			"SectionNum" : feedbackSection, "SectionSize" : sectionSize};
	            
	            return $http.post('urent/ItemService/showItemDetails', data).then(function(result) {
                	ShowItemsService.isOwner = (result.data.ownerId == 0);
                    ShowItemsService.selectedItem = result.data;
            	    
                	if (!MainService.isUndefinedOrNull(result.data.lstFeedback)) {
                		if (result.data.lstFeedback.length <= sectionSize) {
                			ShowItemsService.showMore = false;
                		}
                	} else if (MainService.isUndefinedOrNull(result.data.lstFeedback)) {
                		ShowItemsService.showMore = false;
                	}

    	        	//FB.XFBML.parse(angular.element($('#fbLike'))[0]);
    	        	
    	        	result.data.parentCategoryName = CategoriesService.fatherCategoryBySub(result.data.categoryName);
    	        	
    	        	return result.data;
	            });
	            
	            //return dfd.promise;
	        },
	
	        changePageClass : function(pageNum){
	            $("#page" + ShowItemsService.activePage).removeClass("active");
	
	            $("#page" + pageNum).addClass("active");
	
	            ShowItemsService.activePage = pageNum;
	        },
	
	        changeRightArrow : function(size) {
	            if (size <= (ShowItemsService.resultsPerPage * ShowItemsService.activePage)) {
	                $("#rightArrow").addClass("disabled");
	            }
	        },
	
	        removeItem : function($scope, $http, ccc, id) {
	            ShowItemsService.serverError = false;
	            var data = { "CCC" : ccc, "ItemId" : id};
	            return $http.post('urent/ItemService/deleteItem', data).then(function(result) {
	                var res = result.data.Response;
	                if (res == 0) { //OK
	                    ShowItemsService.loadItemsOfUser(ccc, $scope);
	                    $route.reload();
	                } else { //Error
	                    ShowItemsService.serverError = true;
	                }
	            });
	        },
	
	        saveItemToEdit : function(id) {
	            ShowItemsService.itemToEdit = id;
	        }
	    }
	
	    return ShowItemsService;
	});
	
	app.controller('ShowItemController', function($scope, $http, MainService, ShowItemsService, RentsService, $stateParams, selectedItem, itemId) {
	
		$scope.selectedItem = selectedItem;
		$scope.isOwner = ShowItemsService.isOwner;
	    
		$scope.itemId = itemId;
		$scope.tab = 1;
	
		$scope.myRentsService = RentsService;

		$scope.sectionSize = RentsService.sectionSize;
		$scope.showMore = RentsService.showMore;
		$scope.currentFeedbackPositionStr = RentsService.currentFeedbackPositionStr,
		$scope.feedbackSection = RentsService.feedbackSection,
        
        $scope.showMoreFeedback = function() {
            $scope.feedbackSection++;
            RentsService.feedbackSection++;
            
        	RentsService.getItemFeedback($scope.itemId);
        }
	
	    $scope.getTab = function() {
	        return $scope.tab;
	    }
	
	    $scope.setTab = function(tab) {
	        $scope.tab = tab;
	        
	        if (tab == 3){
	        	FB.XFBML.parse(angular.element($('#fbComments'))[0]);
	        }
	    }
	});
	
	app.controller('DatePickerController', function ($scope, $http, $modal, CookiesService) {
	
	    $scope.pick = function (size) {
	
	        var modalInstance = $modal.open({
	            templateUrl: 'DatesForRent.html',
	            controller: 'PickerInstanceCtrl',
	            windowClass: 'modal',
	            overflow: 'hidden',
	            size: size,
	            resolve: {
	            }
	        });
	
	        modalInstance.result.then(function () {
	        });
	    };
	});
	
	app.controller('PickerInstanceCtrl', function ($scope, $http, $modalInstance, $filter, $stateParams, MainService, RentsService, CookiesService, ShowItemsService) {
	
	    $scope.minDate = new Date();
	    
	    $scope.format = 'dd-MMMM-yyyy';
	
	    $scope.startRentDT = $scope.minDate;
	    $scope.endRentDT = $scope.minDate;
	
	    $scope.loggedIn = !(CookiesService.getCookie("ccc") == "");
	    
	    $scope.init = function(){
	        if (!MainService.isUndefinedOrNull($stateParams.rentId) ||
	        		!MainService.isUndefinedOrNull($stateParams.filter)){
			    $scope.startRentDT = RentsService.selectedRent.startRent;
			    $scope.endRentDT = RentsService.selectedRent.endRent;
			    
		        this.calcDaysAndPrice();
	        }
	        else{
	            $scope.totalDays = 1;
	            $scope.totalPayment = ShowItemsService.selectedItem.dailyPrice;
	        }
	    }
	
	    $scope.ok = function () {
	        var ccc = CookiesService.getCookie("ccc");
	        
	        if (!MainService.isUndefinedOrNull($stateParams.rentId)){ // Change dates of an existing rent inside 'refer to'
	        	RentsService.changeRentDates(ccc, $stateParams.rentId, $scope.startRentDT, $scope.endRentDT, $modalInstance);
	        }
	        else{
	        	if (!MainService.isUndefinedOrNull($stateParams.itemId)){ // New rent
	        		RentsService.request(ccc, $scope, $stateParams.itemId, $scope.startRentDT, $scope.endRentDT, $modalInstance);
	        	}
	        	else { // Change dates of an existing rent outside 'refer to'
		            RentsService.changeRentDates(ccc, RentsService.selectedRent.rentId, $scope.startRentDT, $scope.endRentDT, $modalInstance);
	        	}

	        }
	
	        $scope.myRentsService = RentsService;
	    }
	
	    $scope.cancel = function () {
	        $modalInstance.dismiss('cancel');
	    }
	
	    $scope.startRentOpen = function($event) {
	        this.genericOpen($event);
	
	        $scope.endRentOpened = false;
	        $scope.startRentOpened = true;
	    }
	
	    $scope.endRentOpen = function($event) {
	        this.genericOpen($event);
	
	        $scope.startRentOpened = false;
	        $scope.endRentOpened = true;
	    }
	
	    $scope.genericOpen = function($event) {
	        $event.preventDefault();
	        $event.stopPropagation();
	    };
	    
	//    date-disabled="disabled(date, mode)" 
	//    $scope.disabled = function(date, mode) {
	//    	for (var i = 0; i < ShowItemsService.selectedItem.lstRents.length; i++){
	//    		if (ShowItemsService.selectedItem.lstRents[i].startDate <= date &&
	//    				ShowItemsService.selectedItem.lstRents[i].endDate >= date){
	//    			return true;
	//    		}
	//    	}
	//    	
	//	    return false;
	//    };
	
	    $scope.startRentChanged = function() {
	        if ($scope.startRentDT > $scope.endRentDT){
	            $scope.endRentDT = $scope.startRentDT;
	        }
	    }
	    
	    $scope.calcDaysAndPrice = function() {
			$scope.totalDays = Math.round(($scope.endRentDT - $scope.startRentDT) / 1000 / 60 / 60 / 24 + 1);
			
			var calcDays = $scope.totalDays;
	
			$scope.totalPayment = 0;
			while (calcDays >= 30){
		        if (!MainService.isUndefinedOrNull($stateParams.rentId) ||
		        		!MainService.isUndefinedOrNull($stateParams.filter)){
		        	$scope.totalPayment = $scope.totalPayment + RentsService.selectedRent.monthlyPrice;
		        }
		        else{
		        	$scope.totalPayment = $scope.totalPayment + ShowItemsService.selectedItem.monthlyPrice;
		        }
				calcDays -= 30;
			}
			
			while (calcDays >= 7){
		        if (!MainService.isUndefinedOrNull($stateParams.rentId) ||
		        		!MainService.isUndefinedOrNull($stateParams.filter)){
					$scope.totalPayment = $scope.totalPayment + RentsService.selectedRent.weeklyPrice;
		        }
		        else{
					$scope.totalPayment = $scope.totalPayment + ShowItemsService.selectedItem.weeklyPrice;
		        }
				calcDays -= 7;
			}
	
	        if (!MainService.isUndefinedOrNull($stateParams.rentId) ||
	        		!MainService.isUndefinedOrNull($stateParams.filter)){
	        	$scope.totalPayment = $scope.totalPayment + (RentsService.selectedRent.dailyPrice) * calcDays;
	        }
	        else{
	        	$scope.totalPayment = $scope.totalPayment + (ShowItemsService.selectedItem.dailyPrice) * calcDays;
	        }
	    } 
	    
	    $scope.dateOptions = {
	        formatYear: 'yy',
	        startingDay: 0
	    };
	});