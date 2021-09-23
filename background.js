let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
  getLocation();
});


// var x = document.getElementById("demo");
function getLocation() {
  console.log(navigator);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  return "Latitude: " + position.coords.latitude + "Longitude: " + position.coords.longitude;
}