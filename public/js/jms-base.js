function initialize() {
	var mapCanvas = document.getElementById('map-canvas');
	var mapOptions = {
		center: new google.maps.LatLng(-33.8667, 151.2116),
		zoom: 18,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	var map = new google.maps.Map(mapCanvas, mapOptions)
	var marker = new google.maps.Marker({
        position: new google.maps.LatLng(-33.8667, 151.2116),
        map: map,
        title: 'Australia Luxury Yacht Club'
  });
}
google.maps.event.addDomListener(window, 'load', initialize);