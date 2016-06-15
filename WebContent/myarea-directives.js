    app.directive("myareabodyDirective", function() {
        return {
            restrict: 'E',
            templateUrl: "myarea-body.html"
        };
    });

    app.directive("myaccountDirective", function() {
        return {
            restrict: 'E',
            templateUrl: "myAccount.html"
        };
    });

    app.directive("editaccountDirective", function() {
        return {
            restrict: 'E',
            templateUrl: "editAccount.html"
        };
    });

    app.directive("changepasswordDirective", function() {
        return {
            restrict: 'E',
            templateUrl: "changePassword.html"
        };
    });

    app.directive("showitemsDirective", function() {
        return {
            restrict: 'E',
            templateUrl: "showItems.html"
        };
    });

    app.directive("additemDirective", function() {
        return {
            restrict: 'E',
            templateUrl: "addItem.html"
        };
    });

    app.directive("edititemDirective", function() {
        return {
            restrict: 'E',
            templateUrl: "editItem.html"
        };
    });

    app.directive("userbodyDirective", function() {
        return {
            restrict: 'E',
            templateUrl: "user-body.html"
        };
    });

    app.directive("userdetailsDirective", function() {
        return {
            restrict: 'E',
            templateUrl: "userDetails.html"
        };
    });

    app.controller('MyAreaController', function($scope, $http, $stateParams, EditMemberService, LocationService, LoginService, CookiesService, UserService, MainService, ShowItemsService) {

        $scope.member = {};
        $scope.member.id = -1;
        $scope.member.lat = 0.0;
        $scope.member.lon = 0.0;
        
        $scope.passwordChange = {};
        $scope.passwordChange.NewPassword = "";
        $scope.passwordChange.RewriteNewPassword = "";
        $scope.passwordChange.success = false;
        $scope.passwordChange.afterSubmit = false;
        
        $scope.user = {};

        $scope.init = function() {
        	$scope.tab = parseInt($stateParams.tab, 10);
        	
        	$scope.action = $stateParams.action;
        	
        	if (MainService.isUndefinedOrNull($stateParams.itemId)){
        		if ($scope.action == 'add'){
            		$scope.addItem = true;
            	} else if ($scope.action == 'edit'){
            		$scope.editItem = true;
            	}
        	} else if ($scope.action == 'show') {
	        	$scope.itemId = $stateParams.itemId;
	        	
	    		$scope.showItem = true;
        	}

            UserService.getDetailsOfUser($http, $scope);
            $scope.member.samePasswords = false;
            $scope.member.notPlace = false;
            $scope.member.afterEditMember = false;
            $scope.member.userExists = false;
            $scope.member.serverError = false;
            $scope.member.success = false;
        }

        $scope.initMap = function() {
            LocationService.initializeMap(UserService.user.Lat, UserService.user.Lon);
            $scope.member.samePasswords = false;
            $scope.member.notPlace = false;
            $scope.member.afterEditMember = false;
            $scope.member.userExists = false;
            $scope.member.serverError = false;
            $scope.member.success = false;
        }

        $scope.sendForm = function() {

            $scope.member.samePasswords = false;
            $scope.member.notPlace = false;
            $scope.member.afterEditMember = false;
            $scope.member.userExists = false;
            $scope.member.serverError = false;
            $scope.member.success = false;

            var id = $scope.member.id;
            var email = $scope.member.Email;
            var firstName = $scope.member.firstName;
            var lastName = $scope.member.lastName;
            var position = LocationService.getPosition();
            
            if (position == null) {
            	$scope.member.notPlace = true;
            	return;
            }
            
            var lat = position.lat();
            var lon = position.lng();

            if (lat == 0) {
                lat = 0.0;
            }
            if (lon == 0) {
                lon = 0.0;
            }

            EditMemberService.editMember($http, id, email, firstName, lastName, lat, lon, $scope.member);
        }
        
        $scope.setFormScope= function(scope){
        	   this.passwordFormScope = scope;
    	}
        
        $scope.checkValidityPasswordChangeForm = function() {
        	this.passwordFormScope.passwordChangeForm.RewriteNewPassword.$setValidity(
    				"same", $scope.passwordChange.NewPassword == $scope.passwordChange.RewriteNewPassword);
        }
        
        $scope.sendPasswordChangeForm = function() {
        	$scope.passwordChange.success = false;

            var ccc = CookiesService.getCookie("ccc");
            var newPassword = $scope.passwordChange.NewPassword;
        	
        	UserService.changePassword($http, $scope, ccc, newPassword);
        }
        
        $scope.isTabUndefined = function() {
        	return MainService.isUndefinedOrNull($stateParams.tab);
        }
        
        $scope.isItemOwner = function() {
        	return ShowItemsService.isOwner;
        }

        $scope.getTab = function() {
            return $scope.tab;
        }

        $scope.setTab = function(tab) {
            $scope.tab = tab;
        }
    });
    
    app.controller('UserController', function($http, $scope, $stateParams, UserService, CookiesService, MainService) {

        $scope.user = {};
        $scope.tab = 1;

        $scope.forgotPassword = {};
        $scope.forgotPassword.Email = "";
		$scope.forgotPassword.sentMail = false;
    	$scope.forgotPassword.afterSubmit = false;
    	
    	$scope.initPassword = {};
    	$scope.initPassword.email = "";
        $scope.initPassword.InitPassword = "";
        $scope.initPassword.RewriteInitPassword = "";
        $scope.initPassword.success = false;
        $scope.initPassword.wrong = false;
        $scope.initPassword.afterSubmit = false;

        $scope.init = function() {
            var ccc = CookiesService.getCookie("ccc");
        	
        	if (!MainService.isUndefinedOrNull($stateParams.tab)){
        		$scope.tab = $stateParams.tab;
        	}
            
        	var customerId = $stateParams.customerId;
        	
            UserService.getCustomerDetails($http, $scope, ccc, customerId);
        }
        
        $scope.setFormScope= function(scope){
        	   this.initPasswordFormScope = scope;
    	}
        
        $scope.checkValidityInitPasswordForm = function() {
        	this.initPasswordFormScope.initPasswordForm.RewriteNewPassword.$setValidity(
    				"same", $scope.initPassword.NewPassword == $scope.initPassword.RewriteNewPassword);
        }
        
        $scope.sendForgotPasswordForm = function() {
        	$scope.forgotPassword.success = false;

            var email = $scope.forgotPassword.Email;
        	
        	UserService.forgotPassword($http, $scope, email);
        }
        
        $scope.verifyStr = function() {
            var str = $stateParams.str;

        	if (!MainService.isUndefinedOrNull(str)){
            	UserService.verifyStr($http, $scope, str);
        	}
        }
        
        $scope.sendInitPasswordForm = function() {
        	$scope.initPassword.success = false;
        	
        	UserService.changeInitPassword($http, $scope);
        }

        $scope.getTab = function() {
            return $scope.tab;
        }
    });

    app.service('EditMemberService', function() {

        this.editMember = function($http, id, email, firstName, lastName, lat, lon, member) {
            var data = { "ID" : id, "Email" : email, "FirstName" : firstName, "LastName" : lastName,  "Latitude" : lat , "Longitude" : lon};
            return $http.post('urent/CustomerService/UpdateCustomer', data).then(function(result) {
                var res = result.data.Response;
                if (res == true) {
                    member.success = true;
                    member.afterEditMember = true;
                } else {
                    member.afterEditMember = true;
                    member.serverError = true;
                }
            });
        }
    });

    app.service('UserService', function($window, CookiesService, LocationService) {

        var UserService = {

            user : {},

            getDetailsOfUser : function($http, $scope) {
                var cookie = document.cookie;

                if (cookie != null) {

                    var ccc = CookiesService.getCookie("ccc");
                    if (ccc != "") {
                        var data = { "CCC" : ccc};
                        return $http.post('urent/CustomerService/getUserDetails', data).then(function(result) {

                            var loginRes = result.data.Response;
                            if (loginRes == 0) {
                                UserService.user = result.data;
                                $scope.user = result.data;

                                $scope.member.id = new String($scope.user.ID);
                                $scope.member.Email = $scope.user.Email;
                                $scope.member.firstName = $scope.user.FirstName;
                                $scope.member.lastName = $scope.user.LastName;
                                $scope.member.lat = $scope.user.Lat;
                                if ($scope.member.lat == 0) {
                                    $scope.member.lat = 0.0;
                                }
                                $scope.member.lon = $scope.user.Lon;
                                if ($scope.member.lon == 0) {
                                    $scope.member.lon = 0.0;
                                }
                            }
                        });
                    }
                }
            },
            
            changePassword : function($http, $scope, ccc, newPassword){
                var data = { "CCC" : ccc, "NewPassword" : newPassword};
                
                return $http.post('urent/CustomerService/ChangePassword', data).then(function(result) {
                	if (result.data.NewCCC != ""){
                    	$scope.passwordChange.success = true;

                        if(document.domain === 'localhost') {
                            CookiesService.setCookie('ccc', result.data.NewCCC);
                        } else {
                            CookiesService.setCookieWithDomain('ccc', result.data.NewCCC, document.domain);
                        }
                	}
                	
                	$scope.passwordChange.afterSubmit = true;
                });
            },
            
            changeInitPassword : function($http, $scope){
                var data = { "Email" : $scope.initPassword.email, "NewPassword" : $scope.initPassword.NewPassword};
                
                return $http.post('urent/CustomerService/ChangePassword', data).then(function(result) {
                	if (result.data.NewCCC != ""){
                        if(document.domain === 'localhost') {
                            CookiesService.setCookie('ccc', result.data.NewCCC);
                        } else {
                            CookiesService.setCookieWithDomain('ccc', result.data.NewCCC, document.domain);
                        }
                        
                        $window.location.href="/";
                	}
                	
                	$scope.passwordChange.afterSubmit = true;
                });
            },
            
            forgotPassword : function($http, $scope, email){
                var data = { "Email" : email};
                
                return $http.post('urent/CustomerService/ForgotPasswordMail', data).then(function(result) {
                	if (result.data.Response == 0){
                		$scope.forgotPassword.sentMail = true;
                	}
                	
                	$scope.forgotPassword.afterSubmit = true;
                });
            },
            
            verifyStr : function($http, $scope, str){
                var data = { "Str" : str};
                
                return $http.post('urent/CustomerService/VerifyStr', data).then(function(result) {
                	if (result.data.Email != null){
                		$scope.initPassword.email = result.data.Email;
                	}
                	else {
                        $scope.initPassword.wrong = true;
                	}
                });
            },
            
            getCustomerDetails : function($http, $scope, ccc, UserId){
            	if (ccc != null){
                    var data = { "CCC" : ccc, "WantedCustomerId" : UserId};
            	}
            	else{
                    var data = {"WantedCustomerId" : UserId};
            	}
            	
                return $http.post('urent/CustomerService/showCustomerDetails', data).then(function(result) {
                	$scope.user = result.data;
                	
                });
            },
        }

        return UserService;
    });

    app.service('LocationService', function(MainService) {
    	var LocationService = {
    			
	        map : null,
	        markers : [],
	        searchBox : null,
	        
	        initializeMap : function(lat, lon)
	        {
	            // Most shithole in the world: Bouvet island
	            //var center = new google.maps.LatLng(-54.432311959646796, 3.408679962158203);
	            var center = new google.maps.LatLng(lat, lon);
	            var mapProp = {
	                center : center,
	                zoom : 15,
	                mapTypeId : google.maps.MapTypeId.ROADMAP,
	                mapTypeControl: false,
	                streetViewControl: false
	//                panControl: true,
	//                 panControlOptions: {
	//                 position: google.maps.ControlPosition.TOP_RIGHT
	//                 },
	//                 zoomControl: true,
	//                 zoomControlOptions: {
	//                 position: google.maps.ControlPosition.BOTTOM_RIGHT
	//                 }
	            };
	
	            LocationService.map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
	
	            var input = (document.getElementById('searchBox'));
	
	            // Create the search box and link it to the UI element.
	            LocationService.map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
	
	            LocationService.searchBox = new google.maps.places.SearchBox((input));
	
	            LocationService.addMarker(center)
	
	            google.maps.event.addListener(LocationService.map, 'click', function(event) {
	                input.value = "";
	                LocationService.addMarker(event.latLng);
	//                alert(event.latLng.lat())
	//                alert(event.latLng.lng())
	//                alert(event.latLng.toString())
	//                alert(getDistance(center, event.latLng))
	//                alert(calcDistance(center, event.latLng))
	
	
	            });
	
	            // Listen for the event fired when the user selects an item from the
	            // pick list. Retrieve the matching places for that item.
	            google.maps.event.addListener(LocationService.searchBox, 'places_changed', function() {
	            	LocationService.addMarkerViaSearchBox();
	                LocationService.map.setZoom(17);
	            });
	
	            // Bias the SearchBox results towards places that are within the bounds of the
	            // current map's viewport.
	            /*google.maps.event.addListener(map, 'bounds_changed', function() {
	             var bounds = map.getBounds();
	             searchBox.setBounds(bounds);
	             });   */
	
	            //addMarker(center);
	        },
	
	        // Get the first marker
	        getPosition : function () {
	//            alert(markers[0].getPosition().toString())
	        	
	        	if (MainService.isUndefinedOrNull(markers[0])) {
	        		return null;
	        	}
	        	
	            return LocationService.markers[0].getPosition();
	        },
	
	        // Add a marker to the map and push to the array.
	        addMarker : function(location) {
	        	LocationService.deleteMarkers();
	
	            var marker = new google.maps.Marker({
	                position: location,
	                map: LocationService.map
	            });
	
	            LocationService.markers.push(marker);
	        },
	
	        // Deletes all markers in the array by removing references to them.
	        deleteMarkers : function() {
	            for (var i = 0; i < LocationService.markers.length; i++) {
	            	LocationService.markers[i].setMap(null);
	            }
	
	            LocationService.markers = [];
	        },
	
	        addMarkerViaSearchBox : function() {
	            var places = LocationService.searchBox.getPlaces();
	            if (places.length == 0) {
	                return;
	            }
	
	            LocationService.deleteMarkers();
	
	            var bounds = new google.maps.LatLngBounds();
	
	            for (var i = 0, place; place = places[i]; i++) {
	            	LocationService.addMarker(place.geometry.location);
	
	                bounds.extend(place.geometry.location);
	            }
	
	            LocationService.map.fitBounds(bounds);
	        },
	
	        getDistance : function(p1, p2) {
	            var R = 6378137; // Earth’s mean radius in meter
	            var dLat = rad(p2.lat() - p1.lat());
	            var dLong = rad(p2.lng() - p1.lng());
	            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	                Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
	                    Math.sin(dLong / 2) * Math.sin(dLong / 2);
	            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	            var d = R * c;
	            return d; // returns the distance in meter
	        },
	
	        //calculates distance between two points in km's
	        calcDistance : function(p1, p2) {
	            return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2)/1000).toFixed(3);
	        },
	
	        rad : function(x) {
	            return x * Math.PI / 180;
	        }
    	}
    	
    	return LocationService;
    });