// File origin: VS1LAB A3

const GeoTag = require("./geotag");
const GeoTagExamples = require("./geotag-examples");

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{

    #store = [];
    // TODO: ... your code here ...

    constructor(){
        GeoTagExamples.tagList.forEach(tag => {
            this.#store.push(new GeoTag(tag[0], tag[1], tag[2], tag[3]))
        })
    }

    get store(){
        return  this.#store;
    }

    addGeoTag(geotag){
        this.#store.push(geotag);
    }

    removeGeoTag(name){
        var index = 0;
        this.#store.forEach(gt => {
            if (gt.name == name){
                return;
            }
            index++;
        })

        if (index == this.#store.length){
            return;
        }
        this.#store.splice(index, 1);
    }

    getNearbyGeoTags(long, lat, distance){
        
        var closeTags = [];
        this.#store.forEach(gt => {
            var dist = Math.sqrt(Math.pow((gt.longitude - long), 2) + Math.pow((gt.latitude - lat), 2));
            if (dist <= distance){
                closeTags.push(gt);
            }
        })
        return closeTags;
    }

    searchNearbyGeotags(long, lat, distance, keyword){
        var closeTags = [];
        this.getNearbyGeoTags(long, lat, distance).forEach(gt => {
            if (gt.name == keyword || gt.hashtag == keyword){
                closeTags.push(gt);
            }
        })
        return closeTags;
    }
}

module.exports = InMemoryGeoTagStore
