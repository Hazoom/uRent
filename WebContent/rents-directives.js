    app.directive("myrentsbodyDirective", function() {
        return {
            restrict: 'E',
            templateUrl: "myRents-body.html"
        };
    });
    
    app.directive("myrentsbodyheaderDirective", function() {
        return {
            restrict: 'E',
            templateUrl: "myRents-body-header.html"
        };
    });
    
    app.directive("myrentsbodybodyDirective", function() {
        return {
            restrict: 'E',
            templateUrl: "myRents-body-body.html"
        };
    });

    app.directive("showrentsDirective", function() {
        return {
            restrict: 'E',
            templateUrl: "showRents.html"
        };
    });

    app.directive("cancelrentDirective", function() {
        return {
            restrict: 'E',
            templateUrl: "cancelRent.html"
        };
    });

    app.directive("generalmessagesDirective", function() {
        return {
            restrict: 'E',
            templateUrl: "general-messages.html"
        };
    });

    app.directive("renttabsDirective", function() {
        return {
            restrict: 'E',
            templateUrl: "rent-tabs.html"
        };
    });

    app.directive("showrentDirective", function() {
        return {
            restrict: 'E',
            templateUrl: "showRent.html"
        };
    });

    app.directive("messagesDirective", function() {
        return {
            restrict: 'E',
            templateUrl: "messages.html"
        };
    });

    app.directive("showfeedbackDirective", function() {
        return {
            restrict: 'E',
            templateUrl: "showAllFeedback.html"
        };
    });

    app.controller('RentsController', function($scope, $http, $window, $filter, $stateParams, MainService, RentsService, MessagesService, CookiesService, LoginService) {

        $scope.rents = RentsService.rents;
        $scope.myRentsService = RentsService;
        
        $scope.currentRentId = RentsService.currentRentId;
        $scope.currentRentStatus = RentsService.currentRentStatus;
        
    	$scope.inItemRents = RentsService.inItemRents;
    	$scope.inBuyerRents = RentsService.inBuyerRents;
    	$scope.inSupplierRents = RentsService.inSupplierRents;
    	$scope.currentItemName = RentsService.currentItemName;
    	
        $scope.sectionSize = RentsService.sectionSize;
    	
        $scope.showMore = RentsService.showMore;

    	$scope.glued = true;
    	
    	$scope.pages = {};
    	$scope.pages.currentPage = RentsService.currentPage;
    	$scope.pages.resultsPerPage = RentsService.resultsPerPage;
    	
    	$scope.maxSize = 5;

    	$scope.isJustUnread = true;
    	$scope.isIncludeCancelled = false;

		$scope.detailsState = true;
		$scope.messagesState = false;
		$scope.cancelState = false;
    	
    	$scope.cancellationReason = "";

    	$scope.buyerFeedback = "";
    	$scope.buyerRate = 0;
    	$scope.supplierFeedback = "";
    	$scope.supplierRate = 0;
    	$scope.itemFeedback = "";
    	$scope.itemRate = 0;

    	$scope.lstFeedback = RentsService.lstFeedback;

    	$scope.filter = RentsService.filter;
    	$scope.itemId = RentsService.itemId
    	
    	$scope.validFilter = RentsService.validFilter;
    	
    	LoginService.newRentsCount = 0;
        
		MessagesService.conversation = [];
		
		$scope.currentFeedbackPositionStr = RentsService.currentFeedbackPositionStr,
		$scope.feedbackSection = RentsService.feedbackSection,
		
        $scope.statusList = [
            {display: "All", option:'All'},
            {display: "Requested", option:'Requested'},
            {display: "Approved", option:'Approved'},
            {display: "In Rent", option:'InRent'},
            {display: "Ended", option:'Ended'},
            {display: "Closed", option:'Closed'},
            {display: "Cancelled By Buyer", option:'CancelledByBuyer'},
            {display: "Cancelled By Supplier", option:'CancelledBySupplier'}
        ];
		
		for (var i = 0; i < $scope.statusList.length; i++) {
			if (RentsService.selectedStatus == $scope.statusList[i].option) {
				$scope.selectedStatus = $scope.statusList[i];
				break;
			}
		}
        
    	$scope.totalItemsRents = function() {
    		return RentsService.totalItems;
    	};
    	
    	$scope.pageChangedRents = function() {
    		
        	var pageOfCurrURL = $stateParams.p;
        	
        	RentsService.currentPage = $scope.pages.currentPage;
        	$window.location.href = $window.location.href.replace("p=" + pageOfCurrURL, "p=" + $scope.pages.currentPage.toString());
    	};
    	
    	$scope.statusChanged = function() {
        	var fOfCurrURL = $stateParams.f;
        	
        	RentsService.selectedStatus = $scope.selectedStatus.option;
        	var href = $window.location.href;
        	if (href.indexOf("f=") > -1) {
        		$window.location.href = href.replace("f=" + fOfCurrURL, "f=" + $scope.selectedStatus.option);
        	} else {
        		$window.location.href = (href + "&f=" + $scope.selectedStatus.option);
        	}
    	}
        	
    	$scope.resultsPerPageChanged = function() {
    		
    		this.getRentsAccordingToTab();
    	}
        	
    	$scope.includeCancelled = function() {
    		if ($scope.isIncludeCancelled){
    			$scope.rents = $filter('filter')($scope.rents, {statusId: '!5'} || {statusId: '!6'});
    		}
    	}
        	
    	$scope.justUnread = function() {
    		
    		alert($scope.isJustUnread);
    	}
        
        $scope.getRent = function(rentId){    
            var ccc = CookiesService.getCookie("ccc");
            
        	var id = rentId;
        	if (angular.isUndefined(id) && id != -1) {
        		id = RentsService.selectedRent.id;
        	}
            
            for (var i = 0; i < RentsService.rents.length; i++){
            	if (RentsService.rents[i].id == id){
            		RentsService.rents[i].isNew = false;
            		
            		$scope.currentRentId = id;
                    $scope.currentRentStatus = RentsService.rents[i].statusId;
            	}
            }
            
            var currRentId = -1;
            if (!angular.isUndefined(rentId) && rentId != -1){
            	currRentId = rentId;
            }
            else {
            	currRentId = $stateParams.rentId;
            }

            RentsService.getRentDetails(ccc, currRentId).then(function(result) {
                RentsService.currentRentStatus = result.statusId;
                $scope.currentRentStatus = RentsService.currentRentStatus;

                RentsService.initRentsCount(LoginService.ccc, $http, LoginService);
            });

        }

        $scope.approve = function(rentId){
            var ccc = CookiesService.getCookie("ccc");
    		
    		MessagesService.allowChat = true;

            RentsService.approve(ccc, rentId, $scope);
            $scope.currentRentStatus = RentsService.currentRentStatus;
        }

        $scope.cancel = function(rentId){
            var ccc = CookiesService.getCookie("ccc");

            RentsService.cancel(ccc, rentId, $scope.cancellationReason, $scope);
            $scope.currentRentStatus = RentsService.currentRentStatus;
        }
        
        $scope.submitItemDescriptionPreRent = function() {
            var ccc = CookiesService.getCookie("ccc");

            RentsService.submitItemDescriptionPreRent(ccc, $stateParams.rentId, $scope);
        }
        
        $scope.startRent = function() {
            var ccc = CookiesService.getCookie("ccc");

            RentsService.startRent(ccc, $stateParams.rentId, $scope);

            $scope.currentRentStatus = RentsService.currentRentStatus;
        }
        
        $scope.endRent = function() {
            var ccc = CookiesService.getCookie("ccc");

            RentsService.endRent(ccc, $stateParams.rentId, $scope);
            $scope.currentRentStatus = RentsService.currentRentStatus;
        }
        
        $scope.submitFeedback = function() {
            var ccc = CookiesService.getCookie("ccc");

            RentsService.submitFeedback(ccc, $stateParams.rentId, $scope);
        }
        
        $scope.showMoreFeedback = function () {
        	
        	if (RentsService.currentFeedbackPositionId == 0) {
        		$scope.getBuyerFeedback();
        	}
        	else if (RentsService.currentFeedbackPositionId == 1) {
        		$scope.getSupplierFeedback();
        	}
        }
        
        $scope.getBuyerFeedback = function () {
            var ccc = CookiesService.getCookie("ccc");
            
            $scope.currentFeedbackPositionStr = "As Buyer";
            $scope.feedbackSection++;
            RentsService.currentFeedbackPositionStr = "As Buyer";
            RentsService.feedbackSection++;

            RentsService.getBuyerFeedback(ccc, $stateParams.customerId).then(function(result) {
            	$scope.showMore = RentsService.showMore;
            	$scope.lstFeedback = RentsService.lstFeedback;
            });
        }
        
        $scope.getSupplierFeedback = function () {
            var ccc = CookiesService.getCookie("ccc");
            
            $scope.currentFeedbackPositionStr = "As Supplier";
            $scope.feedbackSection++;
            RentsService.currentFeedbackPositionStr = "As Supplier";
            RentsService.feedbackSection++;

            RentsService.getSupplierFeedback(ccc, $stateParams.customerId).then(function(result) {
            	$scope.showMore = RentsService.showMore;
            	$scope.lstFeedback = RentsService.lstFeedback;
            });
        }

        $scope.getRentConversation = function(rentId, rentStatus) {
            var ccc = CookiesService.getCookie("ccc");
            
            MessagesService.getRentConversation(ccc, $http, rentId, rentStatus);
        }
        
        $scope.changeState = function(state) {
            switch(state){
            case('details'):
        		$scope.detailsState = true;
    			$scope.messagesState = false;
	    		$scope.cancelState = false;
    		
                break;
            case('messages'):
        		$scope.detailsState = false;
    			$scope.messagesState = true;
	    		$scope.cancelState = false;
	    		
                break;
            case('cancel'):
        		$scope.detailsState = false;
				$scope.messagesState = false;
	    		$scope.cancelState = true;
	    		
                break;
            default:
                break;
            }
        }

        $scope.getTab = function() {
            return $scope.tab;
        }

        $scope.setTab = function(tab) {
            $scope.tab = tab;
        }
    });

    app.service('RentsService', function($http, $location, $anchorScroll, $filter, $window, $q, MainService, CookiesService, ShowItemsService) {

        var RentsService = {
            isRequestedSuccessfully : false,
            isReadyForRent : false,
            isStarted : false,
            failStatus : 0,
            requestFailureReason : "",
//            notificationsCount : {},
            selectedRent : {},
            rents : {},
            rentFrom : "",
            rentTo : "",
            supplierFeedback : "",
            itemFeedback : "",
            buyerFeedback : "",
            supplierRate : null,
            itemRate : null,
            buyerRate : null,
            inBuyerRents : false,
            inSupplierRents : false,
            inItemRents : -1,
            currentItemName : "",
            currentRentStatus : 1,
            totalItems : 0,
            currentPage : 1,
            noSupplierFeedback : false,
            noSupplierRate : false,
            noBuyerFeedback : false,
            noBuyerRate : false,
            noItemFeedback : false,
            noItemRate : false,
            resultsPerPage : 7,
            filter : "",
            itemId : -1,
            validFilter : false,
            selectedStatus : 'All',
            itemDescriptionOnScreen : "",
            lstFeedback : [],
            currentFeedbackPositionStr : "",
            feedbackSection : 0,
            currentFeedbackPositionId : 0,
            sectionSize : 7,
            showMore : true,

            loadRentsPage : function(p, filter, itemId, f) {

            	// init
            	RentsService.currentRentId = -1;
            	RentsService.currentRentStatus = -1;
                
            	if (!MainService.isUndefinedOrNull(p)) {
            		RentsService.currentPage = p;
            	}
                
            	RentsService.filter = filter;
            	RentsService.itemId = itemId;
            	RentsService.selectedStatus = f;
            	
                RentsService.inItemRents = -1;
                
                // Get rents according to tab
		
        		RentsService.validFilter = false;
            	
                RentsService.inBuyerRents = false;
            	RentsService.inSupplierRents = false;
            	
            	var ccc = CookiesService.getCookie("ccc");
            	
        		if (!angular.isUndefined(RentsService.filter) && 
        				angular.isUndefined(RentsService.itemId)) {
    	            switch(RentsService.filter){
    		            case('by'):
    		                RentsService.inBuyerRents = true;
    		                RentsService.inSupplierRents = false;
    		                RentsService.validFilter = (RentsService.inSupplierRents || RentsService.inBuyerRents);
    		                return RentsService.getRentsAsBuyer(ccc, RentsService.currentPage);
    		                break;
    		            case('from'):
    		                RentsService.inBuyerRents = false;
    		                RentsService.inSupplierRents = true;
    		                RentsService.validFilter = (RentsService.inSupplierRents || RentsService.inBuyerRents);
    		                return RentsService.getRentsAsSupplier(ccc, RentsService.currentPage);
    		                break;
    		            default:
    		                break;
    	            }
        		}
        		else if (!angular.isUndefined(RentsService.itemId) 
        					&& angular.isUndefined(RentsService.filter) &&
        						isFinite(RentsService.itemId)){  
        			return RentsService.getRentsForItem(ccc, RentsService.itemId, null, null, RentsService.currentPage);
        		}
            },
            
            initRentsCount : function(ccc, $http, LoginService) {
                var data = { "CCC" : ccc};
                return $http.post('urent/RentService/NewSumRentNotifications', data).then(function(result) {

                    var count = result.data.Count;
                    if (count > -1) {

                        count = "" + count;
                        if (count.length > 4){
                            count = ">9999";
                        }

                        LoginService.newRentsCount = count;
                    }
                });
            },
            
            getRentStatus : function(rentId){
            	var data = {"RentId" : rentId};
                return $http.post('urent/RentService/getRentStatus', data).then(function(result) {
                	return result.data.Status;
                });
            },
            
            getRentDetails : function(ccc, rentId, $scope){
                var data = { "CCC" : ccc, "RentId" : rentId};
                var deferred = $q.defer();
                $http.post('urent/RentService/getRentDetails', data).then(function(result) {
                	
                	RentsService.noSupplierFeedback = false;
                	RentsService.noSupplierRate = false;
                	RentsService.noBuyerFeedback = false;
                	RentsService.noBuyerRate = false;
                	RentsService.noItemFeedback = false;
                	RentsService.noItemRate = false;
                	
                	RentsService.supplierFeedback = "";
                	RentsService.itemFeedback = "";
                	RentsService.buyerFeedback = "";
                	RentsService.supplierRate = null;
                	RentsService.itemRate = null;
                	RentsService.buyerRate = null;
                	RentsService.itemDescriptionOnScreen = "";
                    
                	RentsService.selectedRent = result.data;
                	deferred.resolve(RentsService.selectedRent);
                });
                
                return deferred.promise;
            },

            request : function(ccc, $scope, itemId, RentFrom, RentTo, $modalInstance){
                var data = { "CCC" : ccc, "ItemId" : itemId, 
                		"RentFrom" : $filter('date')(RentFrom, 'dd-MMMM-yyyy'), 
                		"RentTo" : $filter('date')(RentTo, 'dd-MMMM-yyyy')};
                return $http.post('urent/RentService/Request', data).then(function(result) {
                	if (result.data.Response == 0){
                		$scope.isRequestedSuccessfully = true;
                        $modalInstance.close();
                        alertify.log("Your request for rent accepted!");
                	}
                	else{
                		var errorResponse = result.data.Response;
                		
                		switch(errorResponse){
	            			case (1):
	                    		RentsService.requestFailureReason = "Couldn't identify customer";
	            				break;
	            			case (2):
	                    		RentsService.requestFailureReason = "Wrong input dates";
	            				break;
	            			case (3):
	                    		RentsService.requestFailureReason = "Item already rented in this period";
            					break;
	            			case (4):
	                    		RentsService.requestFailureReason = "Can't rent from yourself";
            					break;
        					default:
	                    		RentsService.requestFailureReason = "Unknown internal error. Request failed.";
        						break;
                		}
                		
                		RentsService.failStatus = errorResponse;
                	}
                });
            },

            approve : function(ccc, rentId, $scope){
                var data = { "CCC" : ccc, "RentId" : rentId};
                return $http.post('urent/RentService/Approve', data).then(function(result) {
                	
                    RentsService.selectedRent.statusId = 1;
                	RentsService.selectedRent.statusDescription = "Approved";

                    for(var i = 0; i < RentsService.rents.length; i++) {	
                        if (RentsService.rents[i].id == rentId) {
                        	RentsService.currentRentStatus = 1;
                        	$scope.currentRentStatus = RentsService.currentRentStatus;
                            
                        	RentsService.rents[i].statusId = 1;
                        	RentsService.rents[i].statusDescription = "Approved";
                            break;
                        }
                    }
                    
                    $scope.selectedRent = RentsService.selectedRent;
                });
            },

            cancel : function(ccc, rentId, cancellationReason, $scope){
                var data = { "CCC" : ccc, "RentId" : rentId, "Reason": cancellationReason};
                return $http.post('urent/RentService/Cancel', data).then(function(result) {
                    for(var i = 0; i < RentsService.rents.length; i++) {
                        RentsService.selectedRent.statusId = result.data.Status;
                    	
                        if (RentsService.rents[i].statusId == 5){
                        	RentsService.selectedRent.statusDescription = "Cancelled By Buyer";
                        }
                        else{
                        	RentsService.selectedRent.statusDescription = "Cancelled By Supplier";
                        }
                        
                        if (RentsService.rents[i].id == rentId) {
                        	RentsService.currentRentStatus = result.data.Status;
                        	$scope.currentRentStatus = RentsService.currentRentStatus;
                        	RentsService.rents[i].statusId = result.data.Status;
                        	
                            if (RentsService.rents[i].statusId == 5){
                            	RentsService.rents[i].statusDescription = "Cancelled By Buyer";
                            }
                            else{
                            	RentsService.rents[i].statusDescription = "Cancelled By Supplier";
                            }
                            break;
                        }
                    }
                    
                    $scope.selectedRent = RentsService.selectedRent;
                });
            },
            
            submitItemDescriptionPreRent : function(ccc, rentId, $scope){
            	
            	var id = rentId;
            	if (angular.isUndefined(id)) {
            		id = RentsService.selectedRent.id;
            	}
                var data = { "CCC" : ccc, "RentId" : id, "Description" : RentsService.itemDescriptionOnScreen};
                return $http.post('urent/RentService/insertItemDescription', data).then(function(result) {
                	if (result.data.Response == 0){ 
                		RentsService.selectedRent.itemDescriptionPreRent = RentsService.itemDescriptionOnScreen;
                		$scope.selectedRent = RentsService.selectedRent;
                        $scope.itemDescriptionOnScreen = RentsService.itemDescriptionOnScreen;
                	}
              });
            },
            
            startRent : function(ccc, rentId, $scope){
            	var id = rentId;
            	if (angular.isUndefined(id)) {
            		id = RentsService.selectedRent.id;
            	}
                var data = { "CCC" : ccc, "RentId" : id};
                return $http.post('urent/RentService/Rent', data).then(function(result) {
                	if (result.data.Response == 0){ 
	                	RentsService.selectedRent.statusId = 2;
	                	RentsService.selectedRent.statusDescription = "In Rent";
	                	
                        for(var i = 0; i < RentsService.rents.length; i++) {
                            if (RentsService.rents[i].id == rentId) {
                            	RentsService.currentRentStatus = 2;
                            	$scope.currentRentStatus = RentsService.currentRentStatus;
                                
                            	RentsService.rents[i].statusId = 2;
                            	RentsService.rents[i].statusDescription = "In Rent"
                                break;
                            }
                        }
                        
                        $scope.selectedRent = RentsService.selectedRent;
                	}
              });
            },
            
            endRent : function(ccc, rentId, $scope){
            	var id = rentId;
            	if (angular.isUndefined(id)) {
            		id = RentsService.selectedRent.id;
            	}
                var data = { "CCC" : ccc, "RentId" : id};
                return $http.post('urent/RentService/End', data).then(function(result) {
                	if (result.data.Response == 0){ 
	                	RentsService.selectedRent.statusId = 3;
	                	RentsService.selectedRent.statusDescription = "Ended";
	                	
                        for(var i = 0; i < RentsService.rents.length; i++) {
                            if (RentsService.rents[i].id == rentId) {
                            	RentsService.currentRentStatus = 3;
                            	$scope.currentRentStatus = RentsService.currentRentStatus;
                                
                            	RentsService.rents[i].statusId = 3;
                            	RentsService.rents[i].statusDescription = "Ended"
                                break;
                            }
                        }
                        
                        $scope.selectedRent = RentsService.selectedRent;
                	}
              });
            },
            
            submitFeedback : function(ccc, rentId, $scope){
            	
            	RentsService.noSupplierFeedback = false;
            	RentsService.noSupplierRate = false;
            	RentsService.noBuyerFeedback = false;
            	RentsService.noBuyerRate = false;
            	RentsService.noItemFeedback = false;
            	RentsService.noItemRate = false;
            	
            	if (RentsService.selectedRent.isBuyer){
                	var id = rentId;
                	if (angular.isUndefined(id)) {
                		id = RentsService.selectedRent.id;
                	}
                	
                	if (MainService.isUndefinedOrNull(RentsService.supplierRate)) {
                    	RentsService.noSupplierRate = true;
                    	return;
                	}
                	
                	if (MainService.isUndefinedOrNull(RentsService.supplierFeedback)|| RentsService.supplierFeedback.length == 0) {
                		RentsService.noSupplierFeedback = true;
                		return;
                	}
                	
                	if (MainService.isUndefinedOrNull(RentsService.itemRate)) {
                		RentsService.noItemRate = true;
                		return;
                	}
                	
                	if (MainService.isUndefinedOrNull(RentsService.itemFeedback) || RentsService.itemFeedback.length == 0) {
                		RentsService.noItemFeedback = true;
                		return;
                	}
                	
                    var data = { "CCC" : ccc, "RentId" : id, 
                    		"SupplierRate" : RentsService.supplierRate, "SupplierFeedback" : RentsService.supplierFeedback, 
                    			"ItemRate" : RentsService.itemRate, "ItemFeedback" : RentsService.itemFeedback};
                    return $http.post('urent/RentService/RateSupplierAndItem', data).then(function(result) {
                    	if (result.data.Response == 0){ 
                    		RentsService.selectedRent.buyerFeedback = RentsService.buyerFeedback;
                    		RentsService.selectedRent.buyerRate = RentsService.buyerRate;
                    		RentsService.selectedRent.supplierFeedback = RentsService.supplierFeedback;
                    		RentsService.selectedRent.supplierRate = RentsService.supplierRate;
                    		RentsService.selectedRent.itemFeedback = RentsService.itemFeedback;
                    		RentsService.selectedRent.itemRate = RentsService.itemRate;
                    		
                    		if (RentsService.selectedRent.buyerRate != null) {
        	                	RentsService.selectedRent.statusId = 4;
        	                	RentsService.selectedRent.statusDescription = "Closed";
        	                	
                                for(var i = 0; i < RentsService.rents.length; i++) {
                                    if (RentsService.rents[i].id == rentId) {
                                    	RentsService.currentRentStatus = 4;
                                    	$scope.currentRentStatus = RentsService.currentRentStatus;
                                        
                                    	RentsService.rents[i].statusId = 4;
                                    	RentsService.rents[i].statusDescription = "Closed"
                                        break;
                                    }
                                }
                    		}
                    		
                    		$scope.selectedRent = RentsService.selectedRent;
                    	}
                    });
            	}
            	else {
                	var id = rentId;
                	if (angular.isUndefined(id)) {
                		id = RentsService.selectedRent.id;
                	}
                	
                	if (MainService.isUndefinedOrNull(RentsService.buyerRate)) {
                    	RentsService.noBuyerRate = true;
                    	return;
                	}
                	
                	if (MainService.isUndefinedOrNull(RentsService.buyerFeedback) || RentsService.buyerFeedback.length == 0) {
                		RentsService.noBuyerFeedback = true;
                		return;
                	}
                	
                    var data = { "CCC" : ccc, "RentId" : id, "BuyerRate" : RentsService.buyerRate, 
                												 "BuyerFeedback" : RentsService.buyerFeedback};
                    return $http.post('urent/RentService/RateBuyer', data).then(function(result) {
                    	if (result.data.Response == 0){ 
                    		RentsService.selectedRent.buyerFeedback = RentsService.buyerFeedback;
                    		RentsService.selectedRent.buyerRate = RentsService.buyerRate;
                    		RentsService.selectedRent.supplierFeedback = RentsService.supplierFeedback;
                    		RentsService.selectedRent.supplierRate = RentsService.supplierRate;
                    		RentsService.selectedRent.itemFeedback = RentsService.itemFeedback;
                    		RentsService.selectedRent.itemRate = RentsService.itemRate;
                    		
                    		if (RentsService.selectedRent.supplierRate != null && RentsService.selectedRent.itemRate != null) {
        	                	RentsService.selectedRent.statusId = 4;
        	                	RentsService.selectedRent.statusDescription = "Closed";
        	                	
                                for(var i = 0; i < RentsService.rents.length; i++) {
                                    if (RentsService.rents[i].id == rentId) {
                                    	RentsService.currentRentStatus = 4;
                                    	$scope.currentRentStatus = RentsService.currentRentStatus;
                                        
                                    	RentsService.rents[i].statusId = 4;
                                    	RentsService.rents[i].statusDescription = "Closed"
                                        break;
                                    }
                                }
                    		}
                    		
                    		$scope.selectedRent = RentsService.selectedRent;
                    	}
                    });
            	}
            },

            changeRentDates : function(ccc, rentId, RentFrom, RentTo, $modalInstance){
            	RentsService.rentFrom = RentFrom;
            	RentsService.rentTo = RentTo;
            	
            	var id = rentId;
            	if (angular.isUndefined(id)) {
            		id = RentsService.selectedRent.id;
            	}
                var data = { "CCC" : ccc, "RentId" : id, 
                		"RentFrom" : $filter('date')(RentsService.rentFrom, 'dd-MMMM-yyyy'), 
                		"RentTo" : $filter('date')(RentsService.rentTo, 'dd-MMMM-yyyy')};
                return $http.post('urent/RentService/ChangeDates', data).then(function(result) {
                	if (result.data.Response == 0){
                    	RentsService.selectedRent.startRent = RentsService.rentFrom;
                    	RentsService.selectedRent.endRent = RentsService.rentTo;
                        
	                	RentsService.selectedRent.statusDescription = "Requested";
                        for(var i = 0; i < RentsService.rents.length; i++) {              	
                            if (RentsService.rents[i].id == rentId) {
                                
                            	RentsService.rents[i].statusId = 1;
                            	RentsService.rents[i].statusDescription = "Requested"
                                break;
                            }
                        }
                    	
                        alertify.log("New rent update on " + RentsService.selectedRent.itemName);
                        $modalInstance.close();
                	}
                	else{
                		var errorResponse = result.data.Response;
                		
                		switch(errorResponse){
	            			case (1):
	                    		RentsService.requestFailureReason = "Couldn't identify customer";
	            				break;
	            			case (2):
	                    		RentsService.requestFailureReason = "Wrong input dates";
	            				break;
	            			case (3):
	                    		RentsService.requestFailureReason = "Item already rented in this period";
            					break;
	            			case (4):
	                    		RentsService.requestFailureReason = "Can't rent from yourself";
            					break;
        					default:
	                    		RentsService.requestFailureReason = "Unknown internal error. Request failed.";
        						break;
                		}
                		
                		RentsService.failStatus = errorResponse;
                	}
                });
            },
            
           getValueOfParameter : function (query) {
        	   var query_string = {};
        	   var vars = query.split("&");
        	   for (var i=0;i<vars.length;i++) {
        		   var pair = vars[i].split("=");
        		   // If first entry with this name
        		   if (typeof query_string[pair[0]] === "undefined") {
        			   query_string[pair[0]] = pair[1];
        			   // If second entry with this name
        			   } else if (typeof query_string[pair[0]] === "string") {
        				   var arr = [ query_string[pair[0]], pair[1] ];
        				   query_string[pair[0]] = arr;
        				   // If third or later entry with this name
    				   } else {
    					   query_string[pair[0]].push(pair[1]);
					   }
        		   } 
        	   return query_string;
        	},

            getRentsAsBuyer : function(ccc, pageNum) {
            	
                var data = {};
                if (MainService.isUndefinedOrNull(RentsService.selectedStatus) || RentsService.selectedStatus == "All") {
                    data = { "CCC" : ccc, "PageNum" : pageNum, "ResultsPerPage" : RentsService.resultsPerPage };
                }
                else {
                    data = { "CCC" : ccc, "SelectedStatus" : RentsService.selectedStatus, "PageNum" : pageNum, "ResultsPerPage" : RentsService.resultsPerPage};
                }

                return $http.post('urent/RentService/AllBuyer', data).then(function(result) {
                	
                	RentsService.totalItems = result.data[0];
                    RentsService.rents = result.data[1];
                    
                    return RentsService.rents;
                });
            },

            getRentsAsSupplier : function(ccc, pageNum) {
            		
                var data = {};
                if (MainService.isUndefinedOrNull(RentsService.selectedStatus) || RentsService.selectedStatus == "All") {
                    data = { "CCC" : ccc, "PageNum" : pageNum, "ResultsPerPage" : RentsService.resultsPerPage };
                }
                else {
                    data = { "CCC" : ccc, "SelectedStatus" : RentsService.selectedStatus, "PageNum" : pageNum, "ResultsPerPage" : RentsService.resultsPerPage};
                }

                return $http.post('urent/RentService/AllSupplier', data).then(function(result) {
                	
                	RentsService.totalItems = result.data[0];
                    RentsService.rents = result.data[1];
                    
                    return RentsService.rents;
                });
            },

            getRentsForItem : function(ccc, itemId, startDate, endDate, pageNum) {
                var data = {};
                if (MainService.isUndefinedOrNull(RentsService.selectedStatus) || RentsService.selectedStatus == "All") {
                	if (MainService.isUndefinedOrNull(startDate)){
                        data = { "CCC" : ccc, "ItemId" : itemId, "PageNum" : pageNum, "ResultsPerPage" : RentsService.resultsPerPage };
                	}
                	else {
                        data = { "CCC" : ccc, "ItemId" : itemId, "StartRange" : startDate, "EndRange" : endDate, 
                        		"PageNum" : pageNum, "ResultsPerPage" : RentsService.resultsPerPage };
                	}
                }
                else {
                    data = { "CCC" : ccc, "ItemId" : itemId, "SelectedStatus" : RentsService.selectedStatus, 
                    		"PageNum" : pageNum, "ResultsPerPage" : RentsService.resultsPerPage};
                }

                return $http.post('urent/RentService/AllItem', data).then(function(result) {  
                    
                    if (result.data.length > 0) {   
                    	RentsService.totalItems = result.data[0];
                    	
                    	var item = result.data[1];
                    	RentsService.inItemRents = item.itemId;
                    	RentsService.currentItemName = item.itemName;
                    	
                        RentsService.rents = result.data[2];
                    }
                    else {
                    	RentsService.inItemRents = -1;              	
                        RentsService.rents = [];
                    }
                    
                    return RentsService.rents;
                });
            },
            
            getFeedback : function(currentFeedbackPositionId, customerId) {
            	
                var ccc = CookiesService.getCookie("ccc");
                
            	if (currentFeedbackPositionId == 0) {
            		RentsService.currentFeedbackPositionStr = "As Buyer";
            		RentsService.feedbackSection++;
            		return RentsService.getBuyerFeedback(ccc, customerId);
            	} else if (currentFeedbackPositionId == 1) {
            		RentsService.currentFeedbackPositionStr = "As Supplier";
            		RentsService.feedbackSection++;
            		return RentsService.getSupplierFeedback(ccc, customerId);
            	}
            },
            
            getBuyerFeedback : function(ccc, wantedCustomerId){
                var dataText = "{";
                
                if (!MainService.isUndefinedOrNull(ccc)) {
                	dataText = dataText + "\"CCC\" : \"" + ccc + "\"";
                }
                
                if (!MainService.isUndefinedOrNull(wantedCustomerId)) {
                	if (dataText.length > 1){
                		dataText = dataText + ', ';
                	}
                	
                	dataText = dataText + "\"WantedCustomerId\" : \"" + wantedCustomerId + "\"";
                }
                
            	if (dataText.length > 1){
            		dataText = dataText + ', ';
            	}

            	dataText = dataText + "\"SectionNum\" : \"" + RentsService.feedbackSection + "\"";
        		dataText = dataText + ', ';
            	dataText = dataText + "\"SectionSize\" : \"" + RentsService.sectionSize + "\"";
                
                dataText = dataText + "}";

                if (dataText.length > 2) {

                	var deferred = $q.defer();
	                return $http.post('urent/RentService/getBuyerFeedback', angular.fromJson(dataText)).then(function(result) {
	                	if (result.data.length <= RentsService.sectionSize) {
	                		RentsService.showMore = false;
	                	}
	                	
	                	RentsService.lstFeedback = RentsService.lstFeedback.concat(result.data);
	                	deferred.resolve(RentsService.lstFeedback);
	                	return (RentsService.lstFeedback);
	                });
	                deferred.promise;
                }
            	else {
            		return null;
            	}
            },
            
            getSupplierFeedback : function(ccc, wantedCustomerId){
                var dataText = "{";
                
                if (!MainService.isUndefinedOrNull(ccc)) {
                	dataText = dataText + "\"CCC\" : \"" + ccc + "\"";
                }
                
                if (!MainService.isUndefinedOrNull(wantedCustomerId)) {
                	if (dataText.length > 1){
                		dataText = dataText + ', ';
                	}
                	
                	dataText = dataText + "\"WantedCustomerId\" : \"" + wantedCustomerId + "\"";
                }
                
            	if (dataText.length > 1){
            		dataText = dataText + ', ';
            	}

            	dataText = dataText + "\"SectionNum\" : \"" + RentsService.feedbackSection + "\"";
        		dataText = dataText + ', ';
            	dataText = dataText + "\"SectionSize\" : \"" + RentsService.sectionSize + "\"";
            	
                dataText = dataText + "}";

                if (dataText.length > 2) {
                	var deferred = $q.defer();
	                return $http.post('urent/RentService/getSupplierFeedback', angular.fromJson(dataText)).then(function(result) {
	                	if (result.data.length <= RentsService.sectionSize) {
	                		RentsService.showMore = false;
	                	}

	                	RentsService.lstFeedback = RentsService.lstFeedback.concat(result.data);
	                	deferred.resolve(RentsService.lstFeedback);
	                	return (RentsService.lstFeedback);
	                });
	                deferred.promise;
                }
            	else {
            		return null;
            	}
            },
            
            getItemFeedback : function(itemId){
                var dataText = "{";

            	dataText = dataText + "\"ItemId\" : \"" + itemId + "\"";
        		dataText = dataText + ', ';
            	dataText = dataText + "\"SectionNum\" : \"" + RentsService.feedbackSection + "\"";
        		dataText = dataText + ', ';
            	dataText = dataText + "\"SectionSize\" : \"" + RentsService.sectionSize + "\"";
            	
                dataText = dataText + "}";

                if (dataText.length > 2) {
                	var deferred = $q.defer();
	                return $http.post('urent/RentService/getItemFeedback', angular.fromJson(dataText)).then(function(result) {
	                	if (result.data.length <= RentsService.sectionSize) {
	                		RentsService.showMore = false;
	                	}
	                	
	                	ShowItemsService.selectedItem.lstFeedback = ShowItemsService.selectedItem.lstFeedback.concat(result.data); // FIXME
	                	deferred.resolve(ShowItemsService.selectedItem.lstFeedback);
	                	//return (ShowItemsService.selectedItem.lstFeedback);
	                });
	                deferred.promise;
                }
            	else {
            		return null;
            	}
            },
            
            putNewRentsOnTop : function(){
            	for (var i = RentsService.rents.length; i >= 0; i--){
            		if (RentsService.rents[i].isNew){
            			RentsService.unshift(RentsService.rents[i]);
            			RentsService.splice(i + 1, 1);
            		}
            	}
            }
        }

        return RentsService;
    });