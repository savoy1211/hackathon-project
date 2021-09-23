let displayLocation = document.getElementById("userLocation");

console.log('hello');
const FLICKR_API_KEY = 'd9c64386725633bb757d9cf4c7e2fcb9';
//https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=your_key&per_page=10&format=json&nojsoncallback=1
fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=${FLICKR_API_KEY}&per_page=10&format=json&nojsoncallback=1`)
    .then(response => response.json())
    .then(data => console.log('fetched data', data));


const getLocation = new Promise((resolve) => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            resolve({
                "lat": position.coords.latitude, "long": position.coords.longitude
            });
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
})

const setCurrentLocation = () => {
    chrome.storage.sync.get("currentLocation", (currentLocation) => {
        displayLocation.innerText = `Here is your current locations: ${currentLocation.currentLocation.long}, ${currentLocation.currentLocation.lat}`;
    });
}

// Create a location variable, assign longitude and latitude
getLocation.then(retrievedLocation => {
    // Store location to chrome.storage
    chrome.storage.sync.set({ "currentLocation": retrievedLocation })

    // Execute setCurrentLocation()
    setCurrentLocation();
});