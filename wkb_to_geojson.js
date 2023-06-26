const fetch = require('node-fetch');
const pygeos = require('pygeos');
const fs = require('fs')

fetch('http://localhost:8082/geometry')
    .then(response => response.json())
    .then(geometryData =>{
        const geometries = [];
        geometryData.forEach(wkb =>{
            const geometry = pygeos.from_wkb(Buffer.from(wkb.geom_visual, 'hex'));
            geometries.push(pygeos.to_wkt(geometry));
        });

        const geojsonData = {
            type:'FeatureCollection',
            name: 'geojson',
            crs :{
                type: 'name',
                properties:{
                    name: 'urn:ogc:def:crs:OGC:1.3:CRS84'
                }
            },
            features:[],
        };
        for(let i = 0; i<geometries.length; i++){
            const wkt = geometries[i];
            const wkb = geometryData[i];
            const feature = {
                type: 'Feature',
                properties: {
                    refcat_visual: wkb.refcat_visual,
                    id: wkb.id,
                },
                geometry:{
                    type: 'MultiPolygon',
                    coordinates: [wkt],
                },
            };
            geojsonData.features.push(features);
        }
        const jsonString= JSON.stringigy(geojsonData);
        console.log(jsonString);
    })
    .catch(error =>{
        console.error('Error', error);
    });
