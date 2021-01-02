var mapOverlay;
var map;
var maps = {};
var selectedMap;

maps.interchange = new MapObject('images/interchange.png', 6626, 3584);
maps.customs = new MapObject('images/customs.png', 3840, 1920);
maps.customsDorms = new MapObject('images/customsDorms.png', 1572, 859);

// Check for the canvas tag onload. 
if (window.addEventListener) {
    window.addEventListener('load', function () {

        var mapSelector = document.getElementById('selector');
        if (!mapSelector) {
            alert('Error! Failed to get the select element!');
            return;
        }
        mapSelector.addEventListener('change', changeMap, false);

        window.addEventListener("contextmenu", (e) => { e.preventDefault(); return false; });

        map = L.map('map', {
            minZoom: 0.1,
            maxZoom: 3,
            center: [0, 0],
            zoom: 2,
            crs: L.CRS.Simple
        });

        resize();

        var bounds = getImageBounds(maps.interchange);

        // add the image overlay, 
        // so that it covers the entire map
        mapOverlay = L.imageOverlay(maps.interchange.url, bounds).addTo(map);

        // tell leaflet that the map is exactly as big as the image
        map.setMaxBounds(bounds);

        window.onresize = function () {
            resize();
        };

        function resize() {
            var heights = window.innerHeight;
            document.getElementById("map").style.height = heights - 40 + "px";
        }

        function getImageBounds(mapToLoad) {
            // calculate the edges of the image, in coordinate space
            var southWest = map.unproject([0, mapToLoad.height], map.getMaxZoom() - 1);
            var northEast = map.unproject([mapToLoad.width, 0], map.getMaxZoom() - 1);

            return new L.LatLngBounds(southWest, northEast);
        }

        function changeMap(ev) {
            if (maps[this.value]) {
                selectedMap = maps[this.value];

                mapOverlay.setMaxBounds = getImageBounds(selectedMap);
                mapOverlay.setUrl(selectedMap.url);

                console.log("Changing map: " + this.value);
            }
        }

    }, false);
}

