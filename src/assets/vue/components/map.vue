<template>
  <div class="google-map" :id="id"></div>
</template>

<script>

// import GoogleMapsLoader from "google-maps";
import { gmaploaded } from '../../../assets/js/async-map-manager.js'
import moment from 'moment'

export default {
	name: "google-map",
	props: ["id", "center", "zoom", "markers", "nextlocation", "userlocation", "locationopened"],
	data: function() {
		return {
			map: null,
			bounds: null,
			element: null,
			markerObjects: [],
			directionsDisplay: null
			// key: "AIzaSyBLXvlal6niC0b49NWSorcdFV9cQT3Y754"
		};
	},
	watch: {
		center: function(newval, oldval) {
			if(newval !== oldval) {
				this.setCenter(newval);
			}
		},
		markers: function(newval, oldval) {
			this.setMarkers(newval);
		},
		zoom: function(newval, oldval) {
			this.setZoom(newval);
		},
		// nextlocation: function(newval) {
		// 	this.setNextLocationDirections(newval);
		// },
		userlocation: function(newval, oldval) {
			if(!newval && !oldval) return;
			if(!_.isEqual(newval, oldval))
				this.setNextLocationDirections(newval);
		},
		locationopened: function(newval) {
			if(newval == true) {
				console.log('directions bro')
				this.hideMarkers();
				this.setNextLocationDirections();
			}
			else {
				console.log('complete it bro');
				this.clearDirections();
				this.showMarkers();
			}
		}
	},
	mounted: function() {

		console.log('sasasaaas');

		// GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];

		let instance = this;
		instance.initMap();

		// if the below props have values already at this moment, update the map
		if(instance.markers) 
			instance.setMarkers(instance.markers);
		if(instance.center)
			instance.setCenter(instance.center);
	},
	methods: {

		initMap: function() {
			let instance = this;
			// GoogleMapsLoader.KEY = instance.key;
			// GoogleMapsLoader.load(function(google) {
			gmaploaded.then(() => {

console.log('qqqq')
				cordova.plugins.notification.local.schedule({
					title: 'FreshRoute Notification',
					text: 'draw map bro.',
					foreground: true,
					priority: 1
				});

				instance.bounds = new google.maps.LatLngBounds();
				instance.element = document.getElementById(instance.id);
				let options = {
					zoom: instance.zoom,
					disableDefaultUI: true
				};

				if(instance.center)
					options.center = new google.maps.LatLng(instance.center.lat, instance.center.lng);
				else
					options.center= new google.maps.LatLng(43.653908, -79.384293);

				instance.map = new google.maps.Map(instance.element, options);
			});
		},

		setCenter: function(coords) {
			let instance = this;
			// GoogleMapsLoader.KEY = instance.key;
			// GoogleMapsLoader.load(function(google) {
			gmaploaded.then(() => {
				if(coords && coords.lat) {
					let ctr = new google.maps.LatLng(coords.lat, coords.lng);
					instance.map.setCenter(ctr);
				}
			});
		},

		setZoom: function(zoom) {
			let instance = this;		
			// GoogleMapsLoader.KEY = instance.key;
			// GoogleMapsLoader.load(function(google) {
			gmaploaded.then(() => {
				instance.map.setZoom(parseInt(zoom));
			});
		},

		setMarkers: function(mrkrs) {
			let instance = this;		
			// GoogleMapsLoader.KEY = instance.key;
			// GoogleMapsLoader.load(function(google) {
			gmaploaded.then(() => {
				mrkrs.forEach(coord => {
					let position = new google.maps.LatLng(
						coord.position.lat,
						coord.position.lng
					);

					let marker = new google.maps.Marker({
						position,
						map: instance.map,
					});
					instance.markerObjects.push(marker);
					// instance.map.fitBounds(instance.bounds.extend(position));
				});
			});
		},

		hideMarkers: function() {
			let instance = this;		
			gmaploaded.then(() => {
				instance.markerObjects.forEach(obj => {
					if(obj && obj.setMap)
						obj.setMap(null);
				});
			});
		},

		showMarkers: function() {
			let instance = this;		
			gmaploaded.then(() => {
				instance.markerObjects.forEach(obj => {
					if(obj && obj.setMap)
						obj.setMap(instance.map);
				});
			});
		},

		setNextLocationDirections: function() {

			let instance = this;

			if(!instance.nextlocation || !instance.userlocation) return;

			// GoogleMapsLoader.KEY = instance.key;
			// GoogleMapsLoader.load(function(google) {
			console.log('set directions bro');
			gmaploaded.then(() => {
				let directionsService = new google.maps.DirectionsService;

				instance.clearDirections();

				instance.directionsDisplay = new google.maps.DirectionsRenderer({
					map: instance.map
				});

				let ptA = new google.maps.LatLng(instance.userlocation.lat, instance.userlocation.lng);
				let ptB = new google.maps.LatLng(instance.nextlocation.lat, instance.nextlocation.lng);

				directionsService.route({
					origin: ptA,
					destination: ptB,
					avoidTolls: true,
					avoidHighways: false,
					travelMode: google.maps.TravelMode.DRIVING,
					drivingOptions: {
						trafficModel: 'pessimistic',
						departureTime: moment()._d,
					}
				}, function (response, status) {
					if (status == google.maps.DirectionsStatus.OK) {
						instance.directionsDisplay.setDirections(response);
					} else {
						instance.$f7.notification.create({
							closeOnClick: true,
							title: "FreshRoute",
                    		subtitle: "Directions Error",
							closeTimeout: 3000,
							text: 'Cannot get directions between user and next location.',
						}).open();
					}
				});

			});
		},

		clearDirections: function() {
			let instance = this;
			if(instance.directionsDisplay && instance.directionsDisplay.setMap)
				instance.directionsDisplay.setMap(null);
		}

	}
};

</script>

<style scoped>
.google-map {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: gray;
}
</style>
