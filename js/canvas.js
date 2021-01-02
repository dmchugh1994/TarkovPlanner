var context, mapOverlay;
var map;

const interchangeURL = 'images/interchange.png';

// Check for the canvas tag onload. 
if (window.addEventListener) {
    window.addEventListener('load', function () {

        function init() {

            var map_select = document.getElementById('selector');
            if (!map_select) {
                alert('Error! Failed to get the select element!');
                return;
            }
            map_select.addEventListener('change', ev_map_change, false);

            window.addEventListener("contextmenu", (e) => { e.preventDefault(); return false; });

            map = L.map('map', {
                minZoom: 0.1,
                maxZoom: 3,
                center: [0, 0],
                zoom: 2,
                crs: L.CRS.Simple
            });

            var bounds = getImageBounds(interchangeURL);

            // add the image overlay, 
            // so that it covers the entire map
            mapOverlay = L.imageOverlay(interchangeURL, bounds).addTo(map);

            // tell leaflet that the map is exactly as big as the image
            map.setMaxBounds(bounds);

            window.onresize = function () {
                resize();
            };
        }

        function resize() {
            var heights = window.innerHeight;
            document.getElementById("map").style.height = heights - 40 + "px";
        }
        resize();

        function getImageBounds(imageURL) {
            var w, h;

            var img = new Image();
            img.src = imageURL;

            w = img.width;
            h = img.height;

            // calculate the edges of the image, in coordinate space
            var southWest = map.unproject([0, h], map.getMaxZoom() - 1);
            var northEast = map.unproject([w, 0], map.getMaxZoom() - 1);
            var bounds = new L.LatLngBounds(southWest, northEast);

            return bounds;
        }

        function ev_map_change(ev) {
            if (maps[this.value]) {
                map = new maps[this.value]();

                console.log("changing map");
            }
        }

        var maps = {};

        // Maps. 
        maps.interchange = function () {
            var imageURL = interchangeURL;
            mapOverlay.setMaxBounds = getImageBounds(interchangeURL);
            mapOverlay.setUrl(imageURL);
        };

        maps.customs = function () {
            mapOverlay.setUrl('images/customs.png');
        };

        maps.customsDorms = function () {
            mapOverlay.setUrl('images/customsDorms.png');
        };

        init();

    }, false);
}