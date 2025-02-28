//Comparer avec le dossier MapBox


// AccesToken supprimé puisqu'on est passé en maplibre



// Configuration de la carte
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', // fond de carte
    zoom: 11.5,
    center: [-1.67, 48.11],
    pitch: 30, // Inclinaison
    bearing: 0 // Rotation
});


// Gestion du changement de style
document.getElementById('style-selector').addEventListener('change', function () {
    map.setStyle(this.value);
    map.once('style.load', addLayers); // Recharge les couches après changement de style
});


// Ajout Marqueur
const marker1 = new maplibregl.Marker()
    .setLngLat([-1.653035, 48.107486])
    


// Contenu de la popup du marqueur
const popup = new maplibregl.Popup({ offset: 25 })
    .setHTML("<h3>Depart running</h3><p>Course n1</p> <br> <img src='https://upload.wikimedia.org/wikipedia/commons/1/1e/Circle-icons-running.svg' width=100% />");



// Associer Contenu et Marqueur
marker1.setPopup(popup);


// Boutons de navigation
var nav = new maplibregl.NavigationControl();
map.addControl(nav, 'top-left');


// Ajout Echelle cartographique
map.addControl(new maplibregl.ScaleControl({
    maxWidth: 120,
    unit: 'metric'
}));


// Bouton de géolocalisation
map.addControl(new maplibregl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true,
    showUserHeading: true
}));


// Fonction pour ajouter les couches après le chargement du style
function addLayers() {
    map.addSource('mapbox-streets-v8', {
        type: 'vector',
        url: 'https://openmaptiles.geo.data.gouv.fr/data/france-vector.json'
    });
    map.addLayer({
        "id": "Routes",
        "type": "line",
        "source": "mapbox-streets-v8",
        "layout": { 'visibility': 'visible' },
        "source-layer": "transportation",
        "filter": ["all", ["in", "class", "motorway", "trunk", "primary"]],
        "paint": { "line-color": "#ffa833", "line-width": 2 },
        "maxzoom" : 15.5
    });
  
  
  // Ajout BDTOPO
map.addSource('BDTOPO', {
type: 'vector',
url: 'https://data.geopf.fr/tms/1.0.0/BDTOPO/metadata.json',
minzoom: 15,
maxzoom: 19
});
  
map.addLayer({
'id': 'batiments',
'type': 'fill-extrusion',
'source': 'BDTOPO',
'source-layer': 'batiment',
'paint': {'fill-extrusion-color': {'property': 'hauteur',
'stops': 
[[1, '#1a9850'],
[5, '#91cf60'],
[10, '#d9ef8b'],
[15, '#ffffbf'],
[30, '#fee08b'],
[50, '#fc8d59'],
[150, '#d73027']]}, 
          
'fill-opacity': 0.9,
'fill-extrusion-height':{'type': 'identity','property': 'hauteur', },
'fill-extrusion-opacity': 0.90,
'fill-extrusion-base': 0},
'layout': { 'visibility': 'none' }
});


    // Hydrologie
    map.addLayer({"id": "hydrologie",
      "type": "line",
      "source": "mapbox-streets-v8",
      "source-layer": "waterway",
      "layout": { 'visibility': 'visible' },
      "paint": {"line-color": "#4dd2ff",
      "line-width": 2}
                 
  });
  
    map.moveLayer('Routes','hydrologie', 'batiment'); // Assure que les couches reste au-dessus

      // Arret de bus (visibility: none, mettre visible...)
      map.addSource('Arrets', {
      type: 'vector',
      url: 'mapbox://ninanoun.58widelk'});
  
      map.addLayer({
      'id': 'Arrets',
      'type': 'symbol',
      'source': 'Arrets',
      'source-layer': 'Bus-5ypx1k',
      'layout': {'icon-image': 'bus','icon-size': 1.5},
       minzoom:12
      });

// Equipements publics (visibility: none, mettre visible...)
      map.addSource('Equipements', {
      type: 'vector',
      url: 'mapbox://ninanoun.4xcn5ude'});
      map.addLayer({
      'id': 'Equipements',
      'type': 'circle',
      'source': 'Equipements',
      'source-layer': 'base-orga-var-6k0zky',
      'layout': {'visibility': 'none'},
      'paint': {'circle-radius': {'base': 1.5,'stops': [[13, 2], [22, 60]]}, 'circle-color':                 '#16f337'}, minzoom:14
      });

        //Proprietes
      map.addSource('Proprietes', {
      type: 'vector',
      url: 'mapbox://ninanoun.a4kdgiot'
      });
      map.addLayer({
      'id': 'Proprietes',
      'type': 'line',
      'source': 'Proprietes',
      'source-layer': 'limites_proprietes',
      'layout': {'visibility': 'none',
      'line-join': 'round','line-cap': 'round'},
      'paint': {'line-color': '#frrhhh', 'line-width': 0.9}, minzoom:16
      });

/*
    // Ajout stations de vélos, fichiers hébergé sur github
      map.addSource('Stations', {
          type: 'geojson',
          data: 'https://raw.githubusercontent.com/Goulvix/DATA/refs/heads/main/stations_vls.geojson'
      });

      map.addLayer({
          id: 'Stations',
          type: 'circle',
          source: 'Stations',
          paint: {
              'circle-color': 'blue',
              'circle-stroke-color': 'white',
              'circle-stroke-width': 2,
              'circle-radius': 8,
              },  minzoom:14,
              'layout': {'visibility': 'visible'}
      }); */
        
  // AJOUT DU CADASTRE ETALAB
          map.addSource('Cadastre', {
          type: 'vector',
          url: 'https://openmaptiles.geo.data.gouv.fr/data/cadastre.json' });
          map.addLayer({
          'id': 'Cadastre',
          'type': 'line',
          'source': 'Cadastre',
          'source-layer': 'parcelles',
          'layout': {'visibility': 'none'},
          'paint': {'line-color': '#000000'},
          // "filter": [">","contenance", 1000],
          'minzoom':16, 'maxzoom':19 }); 
          
          map.setPaintProperty('communeslimites', 'line-width', ["interpolate",             ["exponential",1], ["zoom"],16,0.3,18,1]);
  
  
  //PLU
  
 dataPLU = 'https://apicarto.ign.fr/api/gpu/zone-urba?partition=DU_243500139';
jQuery.when(jQuery.getJSON(dataPLU)).done(function(json) {
// Filtrer les entités pour ne garder que celles avec typezone = 'U'
var filteredFeatures = json.features.filter(function(feature) 
{return feature.properties.typezone === 'N';});
// Créer un objet GeoJSON avec les entités filtrées
var filteredGeoJSON = { type: 'FeatureCollection', features: filteredFeatures};
map.addLayer({
'id': 'PLU',
'type': 'fill',
'source': {'type': 'geojson',
'data': filteredGeoJSON},
'paint': {'fill-color': 'green',
'fill-opacity': 0.5},
'layout': {'visibility': 'none'}
});
});
  
  
//Parking relais 

  $.getJSON('https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/tco-parcsrelais-star-etat-tr/records?limit=20', 
function(data) {var geojsonData4 = {
type: 'FeatureCollection',
features: data.results.map(function(element) {
return {type: 'Feature',
geometry: {type: 'Point',
coordinates: [element.coordonnees.lon, element.coordonnees.lat]},
properties: { name: element.nom,
capacity: element.jrdinfosoliste}};

})
};
map.addLayer({ 'id': 'Parcrelais',
'type':'circle',
'source': {'type': 'geojson',
'data': geojsonData4},
'paint': {'circle-color': '#ff4233', 'circle-radius': {property: 'capacity',
type: 'exponential', stops: [[10, 5],[2000, 60]]}, 'circle-opacity': 0.8, 'circle-stroke-width': 2, 'circle-stroke-color': '#ffffff'},
'layout': {'visibility': 'visible'}
});
});

//Vélo temps réel
 
$.getJSON('https://data.explore.star.fr/api/explore/v2.1/catalog/datasets/vls-stations-etat-tr/records?limit=57', 
function(data) {var geojsonVLS = {
type: 'FeatureCollection',
features: data.results.map(function(element) {
return {type: 'Feature',
geometry: {type: 'Point',
coordinates: [element.coordonnees.lon, element.coordonnees.lat]},
properties: { name: element.nom,
capacity: element.nombreemplacementsdisponibles,
            velos: element.nombrevelosdisponibles}};
})
};
map.addLayer({ 'id': 'VLS',
'type':'circle',
'source': {'type': 'geojson',
'data': geojsonVLS},
'paint': {'circle-color': 'green', 'circle-radius': {property: 'velos',
type: 'exponential', stops: [[10, 5],[50, 20]]}, 'circle-opacity': 0.8, 'circle-stroke-width': 2, 'circle-stroke-color': '#ffffff'},
'layout': {'visibility': 'none'}
});
});
  
  
  
 //bus temps réel
 
$.getJSON('https://data.explore.star.fr/api/explore/v2.1/catalog/datasets/tco-bus-vehicules-position-tr/records?limit=100', 
function(data) {var geojsonBUS = {
type: 'FeatureCollection',
features: data.results.map(function(element) {
return {type: 'Feature',
geometry: {type: 'Point',
coordinates: [element.coordonnees.lon, element.coordonnees.lat]},
properties: { ligne: element.idligne,
destination: element.destination
         }};
})
};
map.addLayer({ 
'id': 'BUS',
'type': 'symbol',
'source': {'type': 'geojson',
'data': geojsonBUS},
'paint': {'circle-color': 'purple'},
'layout': {'visibility': 'none', 'icon-image': 'bus',
'icon-size': 1.5}             
             
});
}); 

//Police 
const ville = "Rennes";
$.getJSON(`https://overpass-api.de/api/interpreter?data=[out:json];area[name="${ville}"]->.searchArea;(node["highway"="bus_stop"](area.searchArea););out center;`, 
function(data) {var geojsonData = {
type: 'FeatureCollection',
features: data.elements.map(function(element) {
return {type: 'Feature',
geometry: { type: 'Point',coordinates: [element.lon, element.lat] },
properties: {}};
})
};
map.addSource('customData', {
type: 'geojson',
data: geojsonData
});
map.addLayer({
'id': 'police',
'type': 'circle',
'source': 'customData',
'paint': {'circle-color': 'green',
'circle-radius': 5},
'layout': {'visibility': 'none'}
});
}); 
  
  
//Métro 
$.getJSON(
    `https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3Bway%5B"railway"%3D"subway"%5D%2848.055480065673166%2C-1.7430496215820315%2C48.16196348345478%2C-1.574993133544922%29%3Bout%20geom%3B`,
    function(data) {
        var geojsonOSM_metro = {
            type: 'FeatureCollection',
            features: data.elements.map(function(element) {
                return {
                    type: 'Feature',
                    geometry: { 
                        type: 'LineString',
                        coordinates: element.geometry.map(coord => [coord.lon, coord.lat]) // Correction ici
                    },
                    properties: {}
                };
            })
        };

        map.addSource('customData_metro', {
            type: 'geojson',
            data: geojsonOSM_metro
        });

        map.addLayer({
            'id': 'pubs', // Vous pouvez le renommer en 'metro_lines' pour plus de clarté
            'type': 'line',
            'source': 'customData_metro',
            'paint': {'line-color': 'green'},
            'layout': {'visibility': 'none'}
        });
    }
);
  
 
  
      
}




map.on('load', addLayers);


const communes = [
    { code: '35278', name: 'Saint-Grégoire' },
    { code: '35051', name: 'Cesson-Sévigné' },
    { code: '35238', name: 'Rennes' }
];



communes.forEach(commune => {
    let dataCadastre = `https://apicarto.ign.fr/api/cadastre/commune?code_insee=${commune.code}`;
    
    jQuery.when(jQuery.getJSON(dataCadastre)).done(function(json) {
        json.features.forEach(feature => {
            feature.geometry = feature.geometry;
        });
        
        map.addLayer({
            'id': `Contour_${commune.code}`,
            'type': 'line',
            'source': { 'type': 'geojson', 'data': json },
            'paint': {
                'line-color': 'black',
                'line-width': 2.5
            },
            'layout': { 'visibility': 'none' }
        });
     
    
    });
  
  switchlayer = function (lname) {
            if (document.getElementById(lname + "CB").checked) {
                map.setLayoutProperty(lname, 'visibility', 'visible');
            } else {
                map.setLayoutProperty(lname, 'visibility', 'none');
           }
        }
});

//Interactivité 


//Interactivité CLICK
map.on('click', function (e) {
var features = map.queryRenderedFeatures(e.point, { layers: ['Arrets'] });
if (!features.length) {
return;
}
var feature = features[0];
var popup = new maplibregl.Popup({ offset: [0, -15], className: "Mypopup" })
.setLngLat(feature.geometry.coordinates)
.setHTML('<h2>' + feature.properties.nom + '</h2><hr><h3>' 
+"Mobilier : " + feature.properties.mobilier + '</h3><p>'
) 
.addTo(map);
});
map.on('mousemove', function (e) {
var features = map.queryRenderedFeatures(e.point, { layers: ['Arrets'] });
map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
});




//Interactivité HOVER parc relais 
var popup2 = new maplibregl.Popup({
className: 'Parcrelaispop',
closeButton: false,
closeOnClick: false });
map.on('mousemove', function(e) {
var features = map.queryRenderedFeatures(e.point, { layers: ['Parcrelais'] });
// Change the cursor style as a UI indicator.
map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
if (!features.length) {
popup.remove();
return; }
var feature = features[0];
popup.setLngLat(feature.geometry.coordinates)
.setHTML('<h2>'+ feature.properties.name +'</h3><hr><h3>' + feature.properties.capacity + 
' places disponibles 😜 </h3>')
.addTo(map);
});


//Interactivité CLICK
map.on('click', function (e) {
var features = map.queryRenderedFeatures(e.point, { layers: ['VLS'] });
if (!features.length) {
return;
}
var feature = features[0];
var popup3 = new maplibregl.Popup({ offset: [0, -15] })
.setLngLat(feature.geometry.coordinates)
.setHTML('<h2>' + feature.properties.name + '</h2><h3>' 
+"Nombre de vélos disponible : " + feature.properties.velos + '</h3><p>'
+"Nombre d'emplacements disponibles : " + feature.properties.capacity + '</p>' ) 
.addTo(map);
});
map.on('mousemove', function (e) {
var features = map.queryRenderedFeatures(e.point, { layers: ['Arrets'] });
map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
});



// Configuration onglets geographiques
document.getElementById('Gare').addEventListener('click', function () 
{ map.flyTo({zoom: 16,
center: [-1.672, 48.1043],
pitch: 145,
bearing: -197.6 });
});

document.getElementById('Rennes1').addEventListener('click', function () 
{ map.flyTo({zoom: 16,
center: [-1.637309, 48.116019],
pitch: 145,
bearing: -197.6 });
});


document.getElementById('Rennes2').addEventListener('click', function () 
{ map.flyTo({zoom: 16,
center: [-1.702744, 48.119741],
pitch: 30,
bearing: -197.6});
});