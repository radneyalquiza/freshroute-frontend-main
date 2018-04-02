<template>
  <div class="google-map" :id="mapName"></div>
</template>

<script>
import GoogleMapsLoader from 'google-maps'

export default {
  name: 'google-map',
  props: ['name', 'center', 'zoom'],
  data: function () {
    return {
      mapName: this.name + "-map",
      markerCoordinates: [{
        latitude: 51.501527,
        longitude: -0.1921837
      }, {
        latitude: 51.505874,
        longitude: -0.1838486
      }, {
        latitude: 51.4998973,
        longitude: -0.202432
      }],
      map: null,
      bounds: null,
      markers: []
    }
  },
  mounted: function () {

    GoogleMapsLoader.KEY = 'AIzaSyBLXvlal6niC0b49NWSorcdFV9cQT3Y754';
    // GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];

    let instance = this;

    GoogleMapsLoader.load(function(google) {
        instance.bounds = new google.maps.LatLngBounds();
        const element = document.getElementById(instance.mapName)
        const mapCentre = instance.markerCoordinates[0]
        const options = {
          center: new google.maps.LatLng(mapCentre.latitude, mapCentre.longitude)
        }
        console.log('ye?')
        instance.map = new google.maps.Map(element, options);
        instance.markerCoordinates.forEach((coord) => {
          const position = new google.maps.LatLng(coord.latitude, coord.longitude);
          const marker = new google.maps.Marker({ 
            position,
            map: instance.map
          });
        instance.markers.push(marker)
          instance.map.fitBounds(instance.bounds.extend(position))
        });
    })

    
    
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