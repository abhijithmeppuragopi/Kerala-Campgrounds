

mapboxgl.accessToken =mapToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  
  center: campground, // starting position [lng, lat]
  zoom: 8, // starting zoom
});

// Create a new marker.
const marker = new mapboxgl.Marker()
    .setLngLat(campground)
    .addTo(map);