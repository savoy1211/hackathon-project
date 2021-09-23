// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");


// var x = document.getElementById("demo");
function getLocation() {
    console.log('navigator', navigator);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    console.log("Latitude: " + position.coords.latitude + "Longitude: " + position.coords.longitude);
}
// storage.sync represents storage for all users
// storage.local represents storage for the current user
// chrome.storage holds all properties of the extension
chrome.storage.sync.get("color", ({ color }) => {
    // Changes background color of extension's little window
    changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
    // Gets current tab
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setPageBackgroundColor,
    });
    console.log(getLocation())
});

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
    chrome.storage.sync.get("color", ({ color }) => {
        document.body.style.backgroundColor = color;
    });
}

