
    app.controller('AddMemberController', function($scope, $http, AddMemberService) {

    	$scope.member = {};
    	$scope.member.samePasswords = false;
    	$scope.member.notPlace = false;

        $scope.init = function() {
        	//$scope.myAddMemberService = AddMemberService;
            AddMemberService.initialize();
        }

        $scope.sendForm = function() {

        	$scope.member.samePasswords = false;
        	$scope.member.notPlace = false;
        	$scope.member.afterAddMember = false;
        	$scope.member.userExists = false;
        	$scope.member.serverError = false;
        	$scope.member.success = false;

            var email = $scope.member.Email;
            var firstName = $scope.member.firstName;
            var lastName = $scope.member.lastName;
            var password = $scope.member.pwd;
            var passwordAgain = $scope.member.pwdAgain;
            var position = AddMemberService.getPosition();
            
            if (position == null) {
            	$scope.member.notPlace = true;
            	return;
            }
            
            var lat = position.lat();
            var lon = position.lng();

            if (password != passwordAgain) {
            	$scope.member.notSamePasswords = true;
            } else if (position == {}) {
            	$scope.member.notPlace = true;
            } else {
                AddMemberService.addMember($http, $scope, email, firstName, lastName, lat, lon, password);
            }
        }
    });

    app.service('AddMemberService', function(MainService) {
        var map;
        var markers = [];
        var searchBox;
        var center;
        var zoom;

        this.addMember = function($http, $scope, email, firstName, lastName, lat, lon, password) {
            var data = { "Email" : email, "FirstName" : firstName, "LastName" : lastName, "Latitude" : lat , "Longitude" : lon, "Password" : password};
            return $http.post('urent/CustomerService/AddCustomer', data).then(function(result) {
                var res = result.data.Response;
                if (res == 0) {
                	$scope.member.success = true;
                	$scope.member.afterAddMember = true;
                } else if (res == 1) {
                	$scope.member.userExists = true;
                } else {
                	$scope.member.afterAddMember = true;
                	$scope.member.serverError = true;
                }
            });
        }

        this.initialize = function()
        {
            // Most shithole in the world: Bouvet island
            //var center = new google.maps.LatLng(-54.432311959646796, 3.408679962158203);

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(setPositionByNavigator, setPositionByRandom);
            }
            else {
            	setPositionByRandom();
            }
        }

        // Get the first marker
        this.getPosition = function () {
//            alert(markers[0].getPosition().toString())
        	
        	if (MainService.isUndefinedOrNull(markers[0])) {
        		return null;
        	}
        	
            return markers[0].getPosition();
        }
        
        function setPositionByNavigator(position){
        	center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        	zoom = 15;
        	
        	defineMap();
        }
        
        function setPositionByRandom() {
            center = new google.maps.LatLng(Math.floor((Math.random() * 180) + 1) - 90 + Math.random(),
                    Math.floor((Math.random() * 360) + 1) - 180 + Math.random());
            zoom = 3;
            
            defineMap();
        }
        
        function defineMap(){
            var mapProp = {
                center : center,
                zoom : zoom,
                mapTypeId : google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                streetViewControl: false
                /*panControl: true,
                 panControlOptions: {
                 position: google.maps.ControlPosition.TOP_RIGHT
                 },
                 zoomControl: true,
                 zoomControlOptions: {
                 position: google.maps.ControlPosition.BOTTOM_RIGHT
                 }, */
            };

            map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

            var input = (document.getElementById('searchBox'));

            // Create the search box and link it to the UI element.
            map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

            searchBox = new google.maps.places.SearchBox((input));

//            addMarker(center)

            google.maps.event.addListener(map, 'click', function(event) {
                input.value = "";
                addMarker(event.latLng);
//                alert(event.latLng.lat())
//                alert(event.latLng.lng())
//                alert(event.latLng.toString())
//                alert(getDistance(center, event.latLng))
//                alert(calcDistance(center, event.latLng))


            });

            // Listen for the event fired when the user selects an item from the
            // pick list. Retrieve the matching places for that item.
            google.maps.event.addListener(searchBox, 'places_changed', function() {
                addMarkerViaSearchBox();
                map.setZoom(16);
            });

            // Bias the SearchBox results towards places that are within the bounds of the
            // current map's viewport.
            /*google.maps.event.addListener(map, 'bounds_changed', function() {
             var bounds = map.getBounds();
             searchBox.setBounds(bounds);
             });   */

            //addMarker(center);
        }

        // Add a marker to the map and push to the array.
        function addMarker(location) {
            deleteMarkers();

            var marker = new google.maps.Marker({
                position: location,
                map: map
            });

            markers.push(marker);
        }

        // Deletes all markers in the array by removing references to them.
        function deleteMarkers() {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }

            markers = [];
        }

        function addMarkerViaSearchBox(){
            var places = searchBox.getPlaces();
            if (places.length == 0) {
                return;
            }

            deleteMarkers();

            var bounds = new google.maps.LatLngBounds();

            for (var i = 0, place; place = places[i]; i++) {
                addMarker(place.geometry.location);

                bounds.extend(place.geometry.location);
            }

            map.fitBounds(bounds);
        }

        function getDistance(p1, p2) {
            var R = 6378137; // Earth’s mean radius in meter
            var dLat = rad(p2.lat() - p1.lat());
            var dLong = rad(p2.lng() - p1.lng());
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
                    Math.sin(dLong / 2) * Math.sin(dLong / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            return d; // returns the distance in meter
        }

        //calculates distance between two points in km's
        function calcDistance(p1, p2){
            return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2)/1000).toFixed(3);
        }

        function rad(x) {
            return x * Math.PI / 180;
        }

        //google.maps.event.addDomListener(window, 'load', initialize);
    });