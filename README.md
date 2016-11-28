
# General course assignment

Build a map-based application, which lets the user see geo-based data on a map and filter/search through it in a meaningfull way. Specify the details and build it in your language of choice. The application should have 3 components:

1. Custom-styled background map, ideally built with [mapbox](http://mapbox.com). Hard-core mode: you can also serve the map tiles yourself using [mapnik](http://mapnik.org/) or similar tool.
2. Local server with [PostGIS](http://postgis.net/) and an API layer that exposes data in a [geojson format](http://geojson.org/).
3. The user-facing application (web, android, ios, your choice..) which calls the API and lets the user see and navigate in the map and shows the geodata. You can (and should) use existing components, such as the Mapbox SDK, or [Leaflet](http://leafletjs.com/).

## Example projects

- Showing nearby landmarks as colored circles, each type of landmark has different circle color and the more interesting the landmark is, the bigger the circle. Landmarks are sorted in a sidebar by distance to the user. It is possible to filter only certain landmark types (e.g., castles).

- Showing bicykle roads on a map. The roads are color-coded based on the road difficulty. The user can see various lists which help her choose an appropriate road, e.g. roads that cross a river, roads that are nearby lakes, roads that pass through multiple countries, etc.

## Data sources

- [Open Street Maps](https://www.openstreetmap.org/)

## My project

Fill in (either in English, or in Slovak):
# BikeParkingLocator
**Application description**:

Aplikácia slúži na pomoc cyklistom pri prejazde mestom. Hlavná funkcionalita aplikácie obsahuje: 
-	Presné zobrazenie polohy používateľa, aktuálne údaje sú zobrazené v určenom okruhu okolo používateľa
-	Presné zobrazenie parkovísk pre bicykle na mape 
-	Vyhľadanie stojísk pre bicykle do 100 metrov od cyklotrasy a zároveň reštaurácií do 100 metrov od nájdených stojísk pre bicykle
-	Vyhľadanie pamiatok, ktoré sú dostupné z cyklotrasy do vzdialenosti 100 metrov 
-	Vyhľadanie parkov a zelených plôch, ktoré sú dostupné z cyklotrasy alebo cez ich cyklotrasy priamo križujú  
-	Vyhľadanie všetkých cyklotrás 
-	Vyhľadanie údajov podľa konkrétne zadaného mesta
Aplikácia je riešená spôsobom klient server. Časti navzájom komunikujú pomocou REST API. Serverová aplikácia je vytvorená pomocou Node.js. Klientská strana pomocou HTML, CSS a javascript. 

**Data source**: 
- [Open Street Maps](https://www.openstreetmap.org/)
**Technologies used**:
Mapbox, Postgresql, PostGis, OpenStreetMap, HTML, Javascript, CSS, Node.js
