'use strict';
    //var app = angular.module('uRent', ['ngRoute', 'item-directives', 'addMember-directives', 'ui.bootstrap', 'myarea-directives']);

    var app = angular.module('uRent', ['ngRoute', 'ui.select', 'ui.router', 'ui.bootstrap', 'ngAside', 'angularFileUpload',
                                       'ngWebsocket', 'luegg.directives', 'angular-loading-bar', 'ahdin']);

    app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $compileProvider) {

    	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|local|data|chrome-extension):/);
        $urlRouterProvider.otherwise('/');
//        $locationProvider.html5Mode(true);
        $stateProvider.
//            state('index', {
//                url: '/',
//                templateUrl: 'index.html'
//            }).
            state('MyArea', {
                url: '/MyArea?p?tab?action?itemId',
                templateUrl: 'myArea.html',
                resolve : {
                	
                	lstFeedback : ['$stateParams', 'RentsService',
                	                function($stateParams, RentsService) {

                		if ($stateParams.tab == 4) {
                			RentsService.currentFeedbackPositionId = 0;
                    		return RentsService.getFeedback(0, $stateParams.customerId);
                		} else if ($stateParams.tab == 5) {
                			RentsService.currentFeedbackPositionId = 1;
                    		return RentsService.getFeedback(1, $stateParams.customerId);
                		}
                	}]
                }
            }).
            state('AddMember', {
                url: '/AddMember',
                templateUrl: 'addMember.html'
            }).
            state('User', {
                url: '/User/:customerId?p=1?tab',
                templateUrl: 'user.html',
                resolve : {
                	
                	lstFeedback : ['$stateParams', 'RentsService',
                	                function($stateParams, RentsService) {

                		if ($stateParams.tab == 2) {
                			RentsService.currentFeedbackPositionId = 0;
                    		return RentsService.getFeedback(0, $stateParams.customerId);
                		} else if ($stateParams.tab == 3) {
                			RentsService.currentFeedbackPositionId = 1;
                    		return RentsService.getFeedback(1, $stateParams.customerId);
                		}
                	}]
                }
            }).
            state('ForgotPassword', {
                url: '/ForgotPassword',
                templateUrl: 'forgotPassword.html'
            }).
            state('InitPassword', {
                url: '/InitPassword/:str',
                templateUrl: 'initPassword.html'
            }).
            state('ItemDetails', {
                url: '/ItemDetails/:itemId',
                templateUrl: 'product.html',
                controller: 'ShowItemController',
                resolve : {
                	
                	selectedItem : ['$stateParams', 'ShowItemsService', 'MainService',
                	                function($stateParams, ShowItemsService, MainService) {

                		return ShowItemsService.getItem($stateParams.itemId, 1, 7);
                	}],
                       
                	itemId : ['$stateParams',
                	          function($stateParams) {
                		return $stateParams.itemId;
                	}]
                }
            }).
            state('MyItems', {
                url: '/MyItems',
                templateUrl: 'myItems.html'
            }).
            state('EditAccount', {
                url: '/EditAccount',
                templateUrl: 'editAccount.html'
            }).
            state('AddItem', {
                url: '/AddItem',
                templateUrl: 'addItem.html'
            }).
            state('Terms', {
                url: '/Terms',
                templateUrl: 'info-terms.html'
            }).
            state('About', {
                url: '/About',
                templateUrl: 'info-about.html'
            }).
            state('Privacy', {
                url: '/Privacy',
                templateUrl: 'info-privacy.html'
            }).
            state('Contact', {
                url: '/Contact',
                templateUrl: 'info-contact.html'
            }).
            state('TopRated', {
                url: '/TopRated',
                templateUrl: 'topRated.html'
            }).
            state('categories', {
                url: '/categories/:category?p?f?s',
                templateUrl: 'categories.html',
                controller: 'ShowItemsController',
                resolve : {
                	
                	items : ['$stateParams', 'ShowItemsService',
                	                function($stateParams, ShowItemsService) {

                		return ShowItemsService.loadCategoriesPage($stateParams.f, $stateParams.s, $stateParams.category, $stateParams.p, false, null);
                	}]
                }
            }).
            state('categories/:category', {
                url: '/categories/:category/:sonCategory?p?f?s',
                templateUrl: 'categories_sub.html',
                controller: 'ShowItemsController',
                resolve : {
                	
                	items : ['$stateParams', 'ShowItemsService',
                	                function($stateParams, ShowItemsService) {

                		return ShowItemsService.loadCategoriesPage($stateParams.f, $stateParams.s, $stateParams.category, $stateParams.p, true, $stateParams.sonCategory);
                	}]
                }
            }).
            state('Messages', {
                url: '/Messages',
                templateUrl: 'messages.html'
            }).
            state('MyRents', {
                url: '/MyRents?p?filter?itemId?f',
                templateUrl: 'myRents.html',
                controller: 'RentsController',
                resolve : {
                	
                	rents : ['$stateParams', 'RentsService',
                	                function($stateParams, RentsService) {

                		return RentsService.loadRentsPage($stateParams.p, $stateParams.filter, $stateParams.itemId, $stateParams.f);
                	}]
                }
            }).
            state('Rent', {
                url: '/Rent/:rentId',
                templateUrl: 'rent.html'
            }).
            state('advanced', {
                url: '/advanced?tab',
                templateUrl: 'advanced.html'
            }).
            state('search', {
                url: '/search/?q?p?category?minDaily?maxDaily?minWeekly?maxWeekly?minMonthly?maxMonthly?minValue?maxValue?minRentCount?maxRentCount?minRate?maxDistance?units',
                templateUrl: 'search.html',
                controller : "SearchController"
            });
    });
    
    app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
//      cfpLoadingBarProvider.includeBar = false;
//      cfpLoadingBarProvider.includeSpinner = false;
      cfpLoadingBarProvider.latencyThreshold = 500;
    }])
    
    app.directive('datepickerPopup', function (dateFilter, datepickerPopupConfig) {
    	  return {
    		    restrict: 'A',
    		    priority: 1,
    		    require: 'ngModel',
    		    link: function(scope, element, attr, ngModel) {
    		      var dateFormat = attr.datepickerPopup || datepickerPopupConfig.datepickerPopup;
    		      ngModel.$formatters.push(function (value) {
    		        return dateFilter(value, dateFormat);
    		      });
    		    }
    		  };
	});
    
//    app.factory('WebSocket', function ($websocket) {
//        var ws = $websocket.$new({
//            url: 'ws://localhost:8080/echo',
//            lazy: true,
//            reconnect: true,
//            enqueue: true,
//            mock: true
//        });
//        
//        return ws;
//
//        ws.$on('$open', function () {
//            console.log('Oh my gosh, websocket is really open! Fukken awesome!');
//
//            ws.$emit('ping', 'hi listening websocket server'); // send a message to the websocket server
//
//            var data = {
//                level: 1,
//                text: 'ngWebsocket rocks!',
//                array: ['one', 'two', 'three'],
//                nested: {
//                    level: 2,
//                    deeper: [{
//                        hell: 'yeah'
//                    }, {
//                        so: 'good'
//                    }]
//                }
//            };
//
//            ws.$emit('pong', data);
//        });
//
//        ws.$on('pong', function (data) {
//            console.log('The websocket server has sent the following data:');
//            console.log(data);
//
//            ws.$close();
//        });
//
//        ws.$on('$close', function () {
//            console.log('Noooooooooou, I want to have more fun with ngWebsocket, damn it!');
//        });
//    });

    app.service("MainService" , function($http) {
        var MainService = {
            homePage : true,

            setHomePage : function(bHomePage) {
                MainService.homePage = bHomePage;
            },

            isUndefinedOrNull: function(obj) {
                return !angular.isDefined(obj) || obj == null;
            },
            
            sendContactUsInfo : function(contact) {
                var data = { "Email": contact.email, "FirstName" : contact.firstName, 
                				"LastName" : contact.lastName, "Comment" : contact.comment};
                return $http.post('urent/CustomerService/contactUs', data).then(function(result) {
                });
            }
        }

        return MainService;
    });

    app.controller("MainController", function($scope, $http, LoginService, CategoriesService, MainService, RentsService, MessagesService){
    	
//        $scope.ws = new WebSocket("ws://localhost:8080/echo");
//        $scope.ws.onmessage = function (evt)
//        {
//            alert ("got Rent!")
//        };
        
        $scope.init = function() {
            
            LoginService.init($http);
            $scope.myLoginService = LoginService;
            CategoriesService.getAllCategories($http);
        };

        $scope.isHomePage = function() {
            return MainService.homePage;
        }

        $scope.setHomePage = function(bHomePage) {
            MainService.setHomePage(bHomePage);
        }
    });

    app.controller("LoginController", function($scope, LoginService) {

        $scope.logOut = function() {
            LoginService.logOut();
            $scope.myLoginService = LoginService;
        };
    });

    app.controller('LoginModalController', function ($scope, $http, $modal) {

        $scope.open = function (size) {

            var modalInstance = $modal.open({
                templateUrl: 'loginModal.html',
                controller: 'LoginModalInstanceCtrl',
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

    app.controller('LoginModalInstanceCtrl', function ($scope, $http, $modalInstance, LoginService) {

        $scope.ok = function () {
            LoginService.login($scope.email, $scope.pwd, $scope.rememberMe, $http, $modalInstance);
            $scope.myLoginService = LoginService;
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    });

    app.controller('SearchModalController', function ($scope, $http, $modal) {

        $scope.open = function (size) {

            var modalInstance = $modal.open({
                templateUrl: 'searchModal.html',
                controller: 'SearchModalInstanceCtrl',
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
    
    app.controller('SearchModalInstanceCtrl', function ($scope, $http, $modalInstance) {

        $scope.close = function () {
            $modalInstance.close();
        }
    });

    app.controller('ContactUsController', function ($scope, $http, $modal) {

        $scope.open = function (size) {

            var modalInstance = $modal.open({
                templateUrl: 'info-contact.html',
                controller: 'ContactUsInstanceCtrl',
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

    app.controller('ContactUsInstanceCtrl', function ($scope, $http, $modalInstance, MainService) {

    	$scope.contact = [];
    	$scope.contact.email = "";
    	$scope.contact.firstName = "";
    	$scope.contact.lastName = "";
    	$scope.contact.comment = "";
    	
        $scope.send = function () {
        	MainService.sendContactUsInfo($scope.contact);
            $modalInstance.close();
        }

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        }
    });
    
    app.directive("validSubmit", [ "$parse", function($parse) {
        return {
            // we need a form controller to be on the same element as this directive
            // in other words: this directive can only be used on a <form>
            require: 'form',
            // one time action per form
            link: function(scope, element, iAttrs, form) {
                form.$submitted = false;
                // get a hold of the function that handles submission when form is valid
                var fn = $parse(iAttrs.validSubmit);

                // register DOM event handler and wire into Angular's lifecycle with scope.$apply
                element.on("submit", function(event) {
                    scope.$apply(function() {
                        // on submit event, set submitted to true (like the previous trick)
                        form.$submitted = true;
                        // if form is valid, execute the submission handler function and reset form submission state
                        if (form.$valid) {
                            fn(scope, { $event : event });
                            form.$submitted = false;
                        }
                    });
                });
            }
        };
    }
    ]);