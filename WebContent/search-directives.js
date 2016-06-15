app.directive("finditemsDirective", function() {
    return {
        restrict: 'E',
        templateUrl: "advanced-finditems.html"
    };
});

app.directive("findbymemberDirective", function() {
    return {
        restrict: 'E',
        templateUrl: "advanced-findbymember.html"
    };
});

app.directive("advancedDirective", function() {
    return {
        restrict: 'E',
        templateUrl: "advanced-body.html"
    };
});

app.controller('SearchController', function($scope, $http, $stateParams, $window, $location, CategoriesService, 
		LocationService, LoginService, CookiesService, SearchService, MainService){

	$scope.advancedsearch = {};
    $scope.afterAddItem = false;
    $scope.serverError = false;
    $scope.success = false;
    $scope.emptySearch = false;
    $scope.categories = [{id : 0, name : "All Categories", inTop : true, subCategories : []}];
    $scope.selectedCategory = null;
    
	$scope.glued = true;
	$scope.currentPage = 1;
	$scope.maxSize = 5;

	$scope.totalItemsSearch = function() {
		return SearchService.totalItemsSearch;
	};
	
	$scope.pageChangedSearch = function() {
		
    	var pageOfCurrURL = $stateParams.p;
    	
    	SearchService.currentPage = $scope.currentPage;
    	$window.location.href = $window.location.href.replace("p=" + pageOfCurrURL, "p=" + $scope.currentPage.toString());
	};
	
    $scope.searchQuery = "";
    $scope.sorts = [
        {display: "Best Match: Ascending", option:'BestMatch', order: 'Asc'},
        {display: "Best Match: Descending", option:'BestMatch', order: 'Desc'},
        {display: "Rent Count: Ascending", option:'RentCount', order: 'Asc'},
        {display: "Rent Count: Descending", option:'RentCount', order: 'Desc'},
        {display: "Rating: Ascending", option:'Rate', order: 'Asc'},
        {display: "Rating: Descending", option:'Rate', order: 'Desc'},
        {display: "Daily Price: Ascending", option:'DailyPrice', order: 'Asc'},
        {display: "Daily Price: Descending", option:'DailyPrice', order: 'Desc'},
        {display: "Weekly Price: Ascending", option:'WeeklyPrice', order: 'Asc'},
        {display: "Weekly Price: Descending", option:'WeeklyPrice', order: 'Desc'},
        {display: "Monthly Price: Ascending", option:'MonthlyPrice', order: 'Asc'},
        {display: "Monthly Price: Descending", option:'MonthlyPrice', order: 'Desc'},
        {display: "Value: Ascending", option:'Value', order: 'Asc'},
        {display: "Value: Descending", option:'Value', order: 'Desc'},
        {display: "Date: Ascending", option:'DatePublished', order: 'Asc'},
        {display: "Date: Descending", option:'DatePublished', order: 'Desc'},
        {display: "Distance: Ascending", option:'Distance', order: 'Asc'},
        {display: "Distance: Descending", option:'Distance', order: 'Desc'}
    ];
    $scope.selectedOrder = $scope.sorts[0];

    $scope.rates = [
                    {id : 0, name : "All"},
                    {id : 1, name : "1"},
                    {id : 2, name : "2"},
                    {id : 3, name : "3"},
                    {id : 4, name : "4"},
                    {id : 5, name : "5"}
                    ];
    $scope.selectedRate = null;
    
    $scope.simpleSearchItems = function() {

        if ((!MainService.isUndefinedOrNull($scope.searchQuery) && $scope.searchQuery != "") 
        		|| (!MainService.isUndefinedOrNull($stateParams.q) && $stateParams.q != "")) {
        	
        	var q = "";
        	
        	if (!MainService.isUndefinedOrNull($scope.searchQuery) && $scope.searchQuery != "") {
        		q = $scope.searchQuery;
        	} else {
        		q = $stateParams.q;
        	}
        	
        	var ccc = CookiesService.getCookie("ccc");
        	var resultsPerPage = SearchService.resultsPerPage;
            var orderOption = SearchService.selectedOrder.option;
            var orderOrder = SearchService.selectedOrder.order;
            
            var category = $scope.category;
            
            if (MainService.isUndefinedOrNull(category) || category == "") {
            	category = 0;
            }
            
            SearchService.advancedSearch($scope, $http, ccc, 1, orderOption, orderOrder, resultsPerPage,
            		q, category, null, null, null, null, null, null, null,
            		null, null, null, 0, 0, "KM");
        } else {
            alert("No query string!");
        }
    }
    
    $scope.getCurrentPage = function() {
        return SearchService.currentPage;
    }

    $scope.setCurrentPage = function(page) {
    	SearchService.currentPage = page;
    }
    
    $scope.searchItems = function(selectedOrder){
    	
        var keywords = $stateParams.q;
        
        var category = $stateParams.category;
        var fromday = $stateParams.minDaily;
        var today = $stateParams.maxDaily;
        var fromweek = $stateParams.minWeekly;
        var toweek = $stateParams.maxWeekly;
        var frommonth = $stateParams.minMonthly;
        var tomonth = $stateParams.maxMonthly;
        var fromvalue = $stateParams.minValue;
        var tovalue = $stateParams.maxValue;
        var fromrent = $stateParams.minRentCount;
        var torent = $stateParams.maxRentCount;
        var selectedRate = $stateParams.minRate;
        var maxDistance = $stateParams.maxDistance;
        var units = "KM"; //TODO
        var ccc = CookiesService.getCookie("ccc");
        
        var resultsPerPage = SearchService.resultsPerPage;
        
        if (MainService.isUndefinedOrNull(category)) {
        	category = 0;
        }
        
        if (MainService.isUndefinedOrNull(selectedRate)) {
        	selectedRate = 0;
        }
        
        if (MainService.isUndefinedOrNull(maxDistance)) {
        	maxDistance = 0;
        }
        
        if (!MainService.isUndefinedOrNull(selectedOrder)) {
        	SearchService.selectedOrder = selectedOrder;
        }
        
        var orderOption = SearchService.selectedOrder.option;
        var orderOrder = SearchService.selectedOrder.order;
        
        SearchService.advancedSearch($scope, $http, ccc, SearchService.currentPage, orderOption, orderOrder, resultsPerPage,
        		keywords, category, fromday, today, fromweek, toweek, frommonth, tomonth, fromvalue,
        		tovalue, fromrent, torent, selectedRate, maxDistance, units);
    };
    
    $scope.makeStringSearch = function() {
    	var searchHref = '/search/?p=1&q=' + $scope.searchQuery;
    	if ($scope.advancedsearch.selectedCategory > 0){
    		searchHref = searchHref + '&category=' + $scope.advancedsearch.selectedCategory;
    	}
    	
    	$location.url(searchHref);
    }
    
    $scope.makeStringSearchAdvanced = function() {
    	
    	var searchHref = '#/search/?p=1&';

    	
        var keywords = $scope.advancedsearch.keywords;
        var category = $scope.advancedsearch.selectedCategory;
        var fromday = $scope.advancedsearch.fromday;
        var today = $scope.advancedsearch.today;
        var fromweek = $scope.advancedsearch.fromweek;
        var toweek = $scope.advancedsearch.toweek;
        var frommonth = $scope.advancedsearch.frommonth;
        var tomonth = $scope.advancedsearch.tomonth;
        var fromvalue = $scope.advancedsearch.fromvalue;
        var tovalue = $scope.advancedsearch.tovalue;
        var fromrent = $scope.advancedsearch.fromrent;
        var torent = $scope.advancedsearch.torent;
        var selectedRate = $scope.advancedsearch.selectedRate;
        var maxDistance = $scope.advancedsearch.maxDistance;
        var units = "KM"; //TODO
        
        if (MainService.isUndefinedOrNull(category)) {
        	category = 0;
        }
        
        if (MainService.isUndefinedOrNull(selectedRate)) {
        	selectedRate = 0;
        }
        
        if (MainService.isUndefinedOrNull(maxDistance)) {
        	maxDistance = 0;
        }
        
        if (!MainService.isUndefinedOrNull(keywords) && keywords != "") {
        	searchHref += "q=" + keywords + "&";
        }
        if (category != 0) {
        	searchHref += ("category=" + category + "&");
        }
        if (!MainService.isUndefinedOrNull(fromday) && fromday != "") {
        	searchHref += ("minDaily=" + fromday + "&");
        }
        if (!MainService.isUndefinedOrNull(today) && today != "") {
        	searchHref += ("maxDaily=" + today + "&");
        }
        if (!MainService.isUndefinedOrNull(fromweek) && fromweek != "") {
        	searchHref += ("minWeekly=" + fromweek + "&");
        }
        if (!MainService.isUndefinedOrNull(toweek) && toweek != "") {
        	searchHref += ("maxWeekly=" + toweek + "&");
        }
        if (!MainService.isUndefinedOrNull(frommonth) && frommonth != "") {
        	searchHref += ("minMonthly=" + frommonth + "&");
        }
        if (!MainService.isUndefinedOrNull(tomonth) && tomonth != "") {
        	searchHref += ("maxMonthly=" + tomonth + "&");
        }
        if (!MainService.isUndefinedOrNull(fromvalue) && fromvalue != "") {
        	searchHref += ("minValue=" + fromvalue + "&");
        }
        if (!MainService.isUndefinedOrNull(tovalue) && tovalue != "") {
        	searchHref += ("maxValue=" + tovalue + "&");
        }
        if (!MainService.isUndefinedOrNull(fromrent) && fromrent != "") {
        	searchHref += ("minRentCount=" + fromrent + "&");
        }
        if (!MainService.isUndefinedOrNull(torent) && torent != "") {
        	searchHref += ("maxRentCount=" + torent + "&");
        }
        if (selectedRate != 0) {
        	searchHref += ("minRate=" + selectedRate + "&");
        }
              
        if (maxDistance != 0) {  	
        	searchHref += ("maxDistance=" + maxDistance + "&units=" + units + "&");
        }
        
        searchHref = searchHref.substring(0, searchHref.length - 1);
        
        $window.location.href = searchHref;
    }
    
    $scope.getAdvancedURL = function()
    {
    	return SearchService.url;
    }

    $scope.getCurrentView = function() {
        return SearchService.currentView;
    }

    $scope.setCurrentView = function(view) {
        SearchService.currentView = view;
    }

    $scope.getChunkedItems = function() {
    	return SearchService.listItems;
    }
    
    $scope.init = function(){
        SearchService.currentView = 1;
        SearchService.selectedOrder = {display: "Best Match: Descending", option:'BestMatch', order: 'Desc'};
        
    	var tab = parseInt($stateParams.tab, 10);
    	if (!isNaN(tab)) {
    		SearchService.setTab(tab);
    	}
    	
    	if (!MainService.isUndefinedOrNull($stateParams.p)) {
    		SearchService.currentPage = $stateParams.p;
    	}
    	
    	$scope.currentPage = $stateParams.p;
    }
    
    if (CategoriesService.getCategoriesInList().length == 0) {
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
                $scope.categories.push.apply($scope.categories, catResult);
                CategoriesService.categories = result;
                CategoriesService.categoriesInList = catResult;
            })
    } else {
        $scope.categories.push.apply($scope.categories, CategoriesService.getCategories());
    }
    
    $scope.initMap = function() {
        LocationService.initializeMap(UserService.user.Lat, UserService.user.Lon);
    }
    
    $scope.sendfindItemsForm = function() {

        $scope.serverError = false;
        $scope.success = false;

        if (MainService.isUndefinedOrNull($scope.advancedsearch)) {
        	 $scope.emptySearch = true;
        	return;
        }
        
        $scope.emptySearch = false;
        
        var keywords = $scope.advancedsearch.keywords;
        var category = $scope.advancedsearch.selectedCategory;
        var fromday = $scope.advancedsearch.fromday;
        var today = $scope.advancedsearch.today;
        var fromweek = $scope.advancedsearch.fromweek;
        var toweek = $scope.advancedsearch.toweek;
        var frommonth = $scope.advancedsearch.frommonth;
        var tomonth = $scope.advancedsearch.tomonth;
        var fromvalue = $scope.advancedsearch.fromvalue;
        var tovalue = $scope.advancedsearch.tovalue;
        var fromrent = $scope.advancedsearch.fromrent;
        var torent = $scope.advancedsearch.torent;
        var selectedRate = $scope.advancedsearch.selectedRate;
        var maxDistance = $scope.advancedsearch.maxDistance;
        var units = "KM"; //TODO
        var ccc = CookiesService.getCookie("ccc");

        var orderOption = SearchService.selectedOrder.option;
        var orderOrder = SearchService.selectedOrder.order;
        var resultsPerPage = SearchService.resultsPerPage;
        
        if (MainService.isUndefinedOrNull(category)) {
        	category = 0;
        }
        
        if (MainService.isUndefinedOrNull(selectedRate)) {
        	selectedRate = 0;
        }
        
        if (MainService.isUndefinedOrNull(maxDistance)) {
        	maxDistance = 0;
        }
        
        SearchService.advancedSearch($scope, $http, ccc, 1, orderOption, orderOrder, resultsPerPage,
        		keywords, category, fromday, today, fromweek, toweek, frommonth, tomonth, fromvalue,
        		tovalue, fromrent, torent, selectedRate, maxDistance, units);
    }
    
    $scope.clear = function() {

        $scope.serverError = false;
        $scope.success = false;

        $scope.advancedsearch.keywords = "";
        $scope.advancedsearch.selectedCategory = "";
        $scope.advancedsearch.fromday = "";
        $scope.advancedsearch.today = "";
        $scope.advancedsearch.fromweek = "";
        $scope.advancedsearch.toweek = "";
        $scope.advancedsearch.frommonth = "";
        $scope.advancedsearch.tomonth = "";
        $scope.advancedsearch.fromvalue = "";
        $scope.advancedsearch.tovalue = "";
        $scope.advancedsearch.fromrent = "";
        $scope.advancedsearch.torent = "";
        $scope.advancedsearch.selectedRate = null;
        $scope.advancedsearch.maxDistance = null;
    }
    
    $scope.getTab = function() {
        return SearchService.getTab();
    }

    $scope.setTab = function(tab) {
    	SearchService.setTab(tab);
    }
});

app.service('SearchService', function(CookiesService, CategoriesService, MainService, LoginService,
		LocationService, $location, $anchorScroll, $window) {

    var SearchService = {

        listItems : [],
        currentPage : 1,
        resultsPerPage : 9,
        selectedOrder : {display: "Best Match: Descending", option:'BestMatch', order: 'Desc'},
        currentView : 1,
        tab : 1,
        totalItemsSearch : 0,
        url : "",

        chunk : function(arr, size) {
        	
            var newArr = [];
            
            if (arr != null) {
	            for (var i=0; i<arr.length; i+=size) {
	                newArr.push(arr.slice(i, i+size));
	            }
            }
            return newArr;
        },
        
        getTab : function() {
            return SearchService.tab;
        },

        setTab : function(tab) {
        	SearchService.tab = tab;
        },
        
        advancedSearch : function($scope, $http, ccc, pageNum, orderOption, orderOrder, resultsPerPage,
        		keywords, category, fromday, today, fromweek, toweek, frommonth, tomonth,
        		fromvalue, tovalue, fromrent, torent, selectedRate, maxDistance, units) {
        	
        	SearchService.listItems= [];
        	
            var data = "";
            var searchParameters = "";
            var urlParameters = "";
            if (!MainService.isUndefinedOrNull(keywords) && keywords != "") {
            	searchParameters = "q=" + keywords + "&";
            }
            if (category != 0) {
                searchParameters += ("category=" + category + "&");
            }
            if (!MainService.isUndefinedOrNull(fromday) && fromday != "") {
            	 searchParameters += ("minDaily=" + fromday + "&");
            }
            if (!MainService.isUndefinedOrNull(today) && today != "") {
            	searchParameters += ("maxDaily=" + today + "&");
            }
            if (!MainService.isUndefinedOrNull(fromweek) && fromweek != "") {
            	searchParameters += ("minWeekly=" + fromweek + "&");
            }
            if (!MainService.isUndefinedOrNull(toweek) && toweek != "") {
            	searchParameters += ("maxWeekly=" + toweek + "&");
            }
            if (!MainService.isUndefinedOrNull(frommonth) && frommonth != "") {
            	searchParameters += ("minMonthly=" + frommonth + "&");
            }
            if (!MainService.isUndefinedOrNull(tomonth) && tomonth != "") {
            	searchParameters += ("maxMonthly=" + tomonth + "&");
            }
            if (!MainService.isUndefinedOrNull(fromvalue) && fromvalue != "") {
            	searchParameters += ("minValue=" + fromvalue + "&");
            }
            if (!MainService.isUndefinedOrNull(tovalue) && tovalue != "") {
            	searchParameters += ("maxValue=" + tovalue + "&");
            }
            if (!MainService.isUndefinedOrNull(fromrent) && fromrent != "") {
            	searchParameters += ("minRentCount=" + fromrent + "&");
            }
            if (!MainService.isUndefinedOrNull(torent) && torent != "") {
            	searchParameters += ("maxRentCount=" + torent + "&");
            }
            if (selectedRate != 0) {
                searchParameters += ("minRate=" + selectedRate + "&");
            }
            
            urlParameters += searchParameters;
            
            if (maxDistance == 0) {
            	
            	if (orderOption == 'Distance') {
                	searchParameters += ("&maxDistance=" + 100000 + "&units=" + units + "&");
            	}
            	
            	SearchService.continueSearch(searchParameters, urlParameters, ccc, pageNum, resultsPerPage,
            			orderOption, orderOrder, $http, $scope);
            	return;
            }
            
            if (maxDistance != 0) {
            	
            	searchParameters += ("maxDistance=" + maxDistance + "&units=" + units + "&");
            	urlParameters += ("maxDistance=" + maxDistance + "&units=" + units + "&");
            	
            	// User not log in
            	if (!LoginService.authenticated) {
            		if (navigator.geolocation) {
                    	
            	        navigator.geolocation.getCurrentPosition(function(position) {
        	    			var crd = position.coords;
        	    			searchParameters += ("latitude=" + crd.latitude + "&" + "longitude=" + crd.longitude + "&");
        	                SearchService.continueSearch(searchParameters, urlParameters, ccc, pageNum, resultsPerPage,
	                		orderOption, orderOrder, $http, $scope);
            	        }, function(error) {
            	            alert(error);
            	        });
        			} else {
        				alert("Problem getting your position!");
        			}
            	} else { // User log in
            		searchParameters += ("latitude=" + LoginService.lat + "&" + "longitude=" + LoginService.lon + "&");
                    SearchService.continueSearch(searchParameters, urlParameters, ccc, pageNum, resultsPerPage,
                    		orderOption, orderOrder, $http, $scope);
            	}
            }
        },
        
        continueSearch : function(searchParameters, urlParameters, ccc, pageNum, resultsPerPage,
        		orderOption, orderOrder, $http, $scope) {
			
            // Remove the last & from the string
            searchParameters = searchParameters.substring(0, searchParameters.length - 1);
            urlParameters = urlParameters.substring(0, urlParameters.length - 1);
            
            var data = "";
            if (ccc != "") {
                data = { "CCC" : ccc, "PageNum" : pageNum,
                    "ResultsPerPage" : resultsPerPage, "OrderOption" : orderOption, "OrderOrder" : orderOrder,
                    "searchParameters" : searchParameters};
            }  else {
                data = { "PageNum" : pageNum, "ResultsPerPage" : resultsPerPage,
                    "OrderOption" : orderOption, "OrderOrder" : orderOrder,
                    "searchParameters" : searchParameters};
            }
            
            return $http.post('urent/SearchService/search', data).then(function(result) {
                if (!MainService.isUndefinedOrNull(result.data)) {
                	$scope.items = result.data[1];
                	SearchService.totalItemsSearch = result.data[0];
                	SearchService.listItems = SearchService.chunk(CategoriesService.addFatherCategory($scope.items), 3);
                	$scope.chunkedItems = SearchService.listItems
                	
                	SearchService.url = '/search?p=1&' + urlParameters;
                	//$window.location.href = '#/search/?p=1&' + urlParameters;
                }
            });
        }
    };

    return SearchService;
});