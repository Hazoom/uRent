

    app.directive("headerDirective", function() {
        return {
            restrict: 'E',
            templateUrl: "header.html"
        };
    });

    app.directive("footerDirective", function() {
        return {
            restrict: 'E',
            templateUrl: "footer.html"
        };
    });

    app.directive("bodyitemsDirective", function() {
        return {
            restrict: 'E',
            templateUrl: "body_items.html"
        };
    });

    app.directive("bodyleftwellsDirective", function() {
        return {
            restrict: 'E',
            templateUrl: "body_left_wells.html"
        };
    });

    app.directive("carouselDirective", function() {
        return {
            restrict: 'E',
            templateUrl: "carousel.html"
        };
    });

    app.service('CookiesService', function() {
        function trimFunc(str) {
            return str.replace(/^\s+|\s+$/gm,'');
        }

        this.getCookie = function(cookieName) {
            var cookie = cookieName + "=";
            var cookiesArray = document.cookie.split(';');
            for (var i = 0; i < cookiesArray.length; i++) {
                var currentCookie = trimFunc(cookiesArray[i]);

                if (currentCookie.indexOf(cookie) != -1){
                    return currentCookie.substring(cookie.length,currentCookie.length);
                }
            }

            return "";
        }

        this.deleteCookie = function(cookieName){
            document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;';
        }

        this.deleteCookieWithDomain = function(cookieName, domain){
            document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=.' +
                domain + ';path=/;';
        }

        this.setCookie = function(cookieName, cookieValue){
            document.cookie = cookieName + '=' + cookieValue + ';path=/;'
        }

        this.setCookieWithDomain = function(cookieName, cookieValue, domain){
            document.cookie = cookieName + '=' + cookieValue + ';domain=.' +
                domain + ';path=/;';
        }
    });

    app.service('LoginService', function(CookiesService, RentsService, MessagesService, $websocket , $http, $location, $timeout, $rootScope, $window) {

        var LoginService = {

            authenticated : false,
            firstName : "",
            lastName : "",
            userSuspended : false,
            loginFailed : false,
            ccc : "",
            lat : -1,
            lon : -1,
//            newUserMessagesCount : "0",
            newRentsCount : "0",
            ws : null,

            init : function($http) {
                var cookie = document.cookie;

                if (cookie != null) {

//                    var ccc = CookiesService.getCookie("remember");
//                    
//                    if (ccc == ""){
                	var ccc = CookiesService.getCookie("ccc");
//                    }
                    
                    if (ccc != "") {
                        var data = { "CCC" : ccc};
                        return $http.post('urent/CustomerService/ValidateLogin', data).then(function(result) {

                            var loginRes = result.data.Response;
                            if (loginRes == 0) {
                            	LoginService.startWebSocket(result.data.ccc);

                                LoginService.firstName = result.data.FirstName;
                                LoginService.lastName = result.data.LastName;
                                
                                LoginService.lat = result.data.Lat;
                                LoginService.lon = result.data.Lon;
                                
                                LoginService.ccc = result.data.ccc;

//                                MessagesService.initUserMessagesCount(result.data.ccc, $http);
                                RentsService.initRentsCount(result.data.ccc, $http, LoginService);

                                LoginService.authenticated = true;
                            }
                        });
                    }
                }
            },

            login : function (email, pwd, rememberMe, $http, $modalInstance) {
                var data = { "Email" : email, "Password" :  pwd};
                return $http.post('urent/CustomerService/ValidateLoginByEmail', data).then(function(result) {

                    var loginRes = result.data.Response;

                    LoginService.userSespended = false;
                    if (loginRes == 0) {
                    	
                        LoginService.firstName = result.data.FirstName;
                        LoginService.lastName = result.data.LastName;
                        LoginService.lat = result.data.Lat;
                        LoginService.lon = result.data.Lon;
                        
                    	LoginService.startWebSocket(result.data.ccc);
                		
                        LoginService.ccc = result.data.ccc;
                        if (rememberMe == true) {
//                            if(document.domain === 'localhost') {
//                                CookiesService.setCookie('remember', result.data.ccc);
//                            } else {
//                                CookiesService.setCookieWithDomain('remember', result.data.ccc, document.domain);
//                            }
                        }

                        if(document.domain === 'localhost') {
                            CookiesService.setCookie('ccc', result.data.ccc);
                        } else {
                            CookiesService.setCookieWithDomain('ccc', result.data.ccc, document.domain);
                        }

//                        MessagesService.initUserMessagesCount(result.data.ccc, $http);
                        RentsService.initRentsCount(result.data.ccc, $http, LoginService);

                        LoginService.authenticated = true;

                        $modalInstance.close();

                        $window.location.href="/";
                    } else if (loginRes == 2) {
                        LoginService.userSuspended = true;
                    } else if (loginRes == 1) {
                        alert('Change password');
                    } else {
                        LoginService.loginFailed = true;
                    }
                });
            },

            logOut : function(){
            	LoginService.ws.$close();

                if(document.domain === 'localhost') {
                    CookiesService.deleteCookie("ccc") ;
                } else {
                    CookiesService.deleteCookieWithDomain("ccc", document.domain) ;
                }

                LoginService.newRentsCount = 0;

                LoginService.authenticated = false;
                LoginService.firstName = null;
                LoginService.lastName = null;
                LoginService.lat = -1;
                LoginService.lon = -1;
                LoginService.ccc = null;

                $window.location.href="/";
            },
            
            startWebSocket : function(ccc){
            	var wsUrl;
            	if (window.location.protocol == 'http:') {
            	    wsUrl = 'ws://' + window.location.host + '/check';
            	} else {
            	    wsUrl = 'wss://' + window.location.host + '/check';
            	}
//            	wsUrl = 'ws://localhost:8080/check';
            	LoginService.ws = $websocket.$new(wsUrl);
            	LoginService.ws.$open();
            	
            	LoginService.ws.$on('o', function (data){
                	LoginService.ws.$emit('ccc', ccc);
            	});
	            	
            	LoginService.ws.$on('rent', function (data){
            		var dataJSONObject = JSON.parse(data);
            		
        			$rootScope.$apply(function(){
            			alertify.log("New rent update on " + dataJSONObject.itemName);
            			
            			//LoginService.newRentsCount = "" + (parseInt(LoginService.newRentsCount) + 1);
            			RentsService.initRentsCount(LoginService.ccc, $http, LoginService);
            			
            			if (RentsService.inBuyerRents || RentsService.inSupplierRents){
            				if ((RentsService.inBuyerRents && !dataJSONObject.isBuyer) ||
            							(RentsService.inSupplierRents && dataJSONObject.isBuyer)){
                        		
                        		for (var i = 0; i < RentsService.rents.length; i++){
                        			if (RentsService.rents[i].id == dataJSONObject.id){
                        				RentsService.rents.splice(i, 1);
                        				
                        				break;
                        			}
                        		}
                        		
                        		if (i == RentsService.rents.length){
                    				RentsService.rents.splice(i - 1, 1);
                        		}
                        		
                        		dataJSONObject.isNew = true;
            					RentsService.rents.unshift(dataJSONObject);
            				}
            				
//        					if (RentsService.inBuyerRents && dataJSONObject.isBuyer) {
//    							RentsService.notificationsCount.supplierCount = 
//									"" + (parseInt(RentsService.notificationsCount.supplierCount) + 1);
//        					}
//        					else {
//        						if (RentsService.inSupplierRents && !dataJSONObject.isBuyer) {
//        							RentsService.notificationsCount.buyerCount = 
//        										"" + (parseInt(RentsService.notificationsCount.buyerCount) + 1);
//        						}
//        					}
            			}
            			else if (RentsService.inItemRents == dataJSONObject.itemId){
                    		for (var i = 0; i < RentsService.rents.length; i++){
                    			if (RentsService.rents[i].id == dataJSONObject.id){
                    				RentsService.rents.splice(i, 1);
                    				
                    				break;
                    			}
                    		}
                    		
                    		if (i == RentsService.rents.length){
                				RentsService.rents.splice(i - 1, 1);
                    		}
                    		
                    		dataJSONObject.isNew = true;
        					RentsService.rents.unshift(dataJSONObject);
            			}
        				
        				if (RentsService.selectedRent.id == dataJSONObject.id){
        					
        					// Save those 3 fields
        					var otherId = RentsService.selectedRent.otherId;
        					var otherName = RentsService.selectedRent.otherName;
        					var isBuyer = RentsService.selectedRent.isBuyer;
        					
        					RentsService.selectedRent = dataJSONObject;
        					
        					// Save those 3 fields
        					RentsService.selectedRent.otherId = otherId;
        					RentsService.selectedRent.otherName = otherName;
        					RentsService.selectedRent.isBuyer = isBuyer;
        				}
        			});
            	});
            	
            	LoginService.ws.$on('message', function (data){
            		var dataJSONObject = JSON.parse(data);

        			$rootScope.$apply(function(){
            			alertify.log("New message on rent for " + dataJSONObject.rentMessage[0].itemName);
	            		
	            		if (MessagesService.rentId == dataJSONObject.rentMessage[0].id){
	        	    		var minutesAgo = (new Date() - dataJSONObject.rentMessage[1].dateSent)/1000/60;
	        	    		
	        	    		if (minutesAgo < 1){
	        	    			dataJSONObject.rentMessage[1].timeAgo = "Less than a minute";
	        	    		} 
	        	    		else if (minutesAgo < 60){
	        	    			dataJSONObject.rentMessage[1].timeAgo = Math.floor(minutesAgo) + " minutes";
	        	    		} else if (minutesAgo < 60 * 24){
	        	    			dataJSONObject.rentMessage[1].timeAgo = Math.floor(minutesAgo / 60) + " hours";
	        	    		} else if (minutesAgo < 60 * 24 * 10){
	        	    			dataJSONObject.rentMessage[1].timeAgo = Math.floor(minutesAgo / 60 / 24) + " days";
	        	    		} else {
	        	    			dataJSONObject.rentMessage[1].timeAgo = "Long time";
	        	    		}
	
	        	    		dataJSONObject.rentMessage[1].timeAgo = dataJSONObject.rentMessage[1].timeAgo + " ago";
	        	    		
	            			MessagesService.conversation.push(dataJSONObject.rentMessage[1]);
	            		}
	            		
	            		for (var i = 0; i < RentsService.rents.length; i++){
	            			if (RentsService.rents[i].id == dataJSONObject.rentMessage[0].id){
	            				RentsService.rents.splice(i, 1);
	            				
	            				break;
	            			}
	            		}
	            		
	            		if (i == RentsService.rents.length){
	        				RentsService.rents.splice(i - 1, 1);        				
	            		}

	            		dataJSONObject.rentMessage[0].isNew = true;
						RentsService.rents.unshift(dataJSONObject.rentMessage[0]);
        			});
    			});
            	
//            	LoginService.ws.$on('$close', function () {
//                    if(document.domain === 'localhost') {
//                        CookiesService.deleteCookie("ccc") ;
//                    } else {
//                        CookiesService.deleteCookieWithDomain("ccc", document.domain) ;
//                    }
//                });
            }
        };

        return LoginService;
    });