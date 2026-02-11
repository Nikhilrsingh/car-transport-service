let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 20.5937, lng: 78.9629 }, // India
    zoom: 5,
  });

  const pickupInput = document.getElementById("pickup");
  const dropInput = document.getElementById("drop");

  new google.maps.places.Autocomplete(pickupInput);
  new google.maps.places.Autocomplete(dropInput);
}