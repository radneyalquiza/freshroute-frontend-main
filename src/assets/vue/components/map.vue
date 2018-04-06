<template>
  <div class="google-map" :id="id"></div>
</template>

<script>

import GoogleMapsLoader from "google-maps";

export default {
	name: "google-map",
	props: ["id", "center", "zoom", "markers"],
	data: function() {
		return {
			map: null,
			bounds: null,
			element: null,
			key: "AIzaSyBLXvlal6niC0b49NWSorcdFV9cQT3Y754"
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
		}
	},
	mounted: function() {

		// GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];

		let instance = this;
		console.log('init?', instance.map)
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
			GoogleMapsLoader.KEY = instance.key;
			GoogleMapsLoader.load(function(google) {
				instance.bounds = new google.maps.LatLngBounds();
				instance.element = document.getElementById(instance.id);
				let options = null;
				console.log('go????????', instance.center);
				if(instance.center) {
					options = {
						center: new google.maps.LatLng(instance.center.lat, instance.center.lng),
						zoom: instance.zoom
					};
				}
				instance.map = new google.maps.Map(instance.element, options);
			});
		},

		setCenter: function(coords) {
			let instance = this;
			GoogleMapsLoader.load(function(google) {
				if(coords && coords.lat) {
					let ctr = new google.maps.LatLng(coords.lat, coords.lng);
					instance.map.setCenter(ctr);
				}
			});
		},

		setZoom: function(zoom) {
			let instance = this;		
			GoogleMapsLoader.load(function(google) {
				instance.map.setZoom(parseInt(zoom));
			});
		},

		setMarkers: function(mrkrs) {
			let instance = this;		
			GoogleMapsLoader.load(function(google) {
				mrkrs.forEach(coord => {
					let position = new google.maps.LatLng(
						coord.position.lat,
						coord.position.lng
					);

					let marker = new google.maps.Marker({
						position,
						map: instance.map
					});
					// instance.map.fitBounds(instance.bounds.extend(position));
				});
			});
		},

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
