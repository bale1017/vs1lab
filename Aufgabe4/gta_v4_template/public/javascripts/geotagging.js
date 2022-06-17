// File origin: VS1LAB A2



/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

var myLat
var myLong
var mapManager
/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */

// ... your code here ...
function updateLocation(helper) {
                const longitude = helper.longitude;
                const latitude = helper.latitude;
                myLat = latitude;
                myLong = longitude;
                document.getElementById("lat").value = latitude;
                document.getElementById("long").value = longitude;
                document.getElementById("hidden_lat").value = latitude;
                document.getElementById("hidden_long").value = longitude;

                console.log("update location" + latitude +" "+ longitude);
               mapManager = new MapManager("OCrGXx3RLc0uBLUz3Gkvf6pF4Lt9W8Yi");

                var mapView = document.getElementById("mapView");
                var taglist_json = mapView.getAttribute('data-tags');
                let tags = JSON.parse(taglist_json);

                document.getElementById("mapView").src = mapManager.getMapUrl(latitude, longitude, tags);
                
    
}


// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    var lat = document.getElementById("hidden_lat").value;
    var long = document.getElementById("hidden_long").value;

   if (lat == "" || long == "")
   {
       LocationHelper.findLocation(updateLocation);
   }
   else
   {
       var helper = new LocationHelper(lat, long);
       updateLocation(helper);
   }
   
   document.getElementById("tag-form").addEventListener("submit", (evt) => { 
    
    evt.preventDefault();
    
    fetch ('http://localhost:3000/api/geotags',{
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            name : document.getElementById("name").value,
            latitude : document.getElementById("lat").value,
            longitude : document.getElementById("long").value,
            hashtag : document.getElementById("hash").value
        })
    }).then(res => { res.json() });
})

    document.getElementById("discoveryFilterForm").addEventListener("submit", (evt) => {
        evt.preventDefault();
        fetch ('http://localhost:3000/api/geotags?searchterm=' + document.getElementById('search').value, {
        method: 'GET'
        }).then(res => res.json())
            .then(res => updateGeoTags(res.taglist));
        })
});

function updateGeoTags(taglist) {
    var ul = document.getElementById("discoveryResults");
    ul.innerHTML = "";//remove all child elements inside of ul

    taglist.forEach(function(gtag) { 
        var node = document.createElement("LI");
        node.innerHTML = gtag.name+" ("+gtag.latitude+","+ gtag.longitude + ") " +  gtag.hashtag;
        ul.appendChild(node);
     });

     document.getElementById("mapView").src = mapManager.getMapUrl(myLat, myLong, taglist);
}


