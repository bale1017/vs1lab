// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * A class to help using the HTML5 Geolocation API.
 */
 const LocationHelper = require("./location-helper.js");

/**
 * A class to help using the MapQuest map service.
 */
 const MapManager = require("./map-manager.js");


/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...
function updateLocation(helper) {
 //   if (document.getElementById("lat").value == "" || document.getElementById("long") == ""){
       
                const longitude = helper.longitude;
                const latitude = helper.latitude;
                document.getElementById("lat").value = latitude;
                document.getElementById("long").value = longitude;
                document.getElementById("hidden_lat").value = latitude;
                document.getElementById("hidden_long").value = longitude;

                const mapManager = new MapManager("OCrGXx3RLc0uBLUz3Gkvf6pF4Lt9W8Yi");
                document.getElementById("mapView").src = mapManager.getMapUrl(latitude, longitude);
           
    }
//}
// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    LocationHelper.findLocation(updateLocation);
});

