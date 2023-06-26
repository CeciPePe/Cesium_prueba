# -*- coding: utf-8 -*-
"""
Created on Thu Jun 22 10:23:10 2023

@author: cperez
"""
import requests 
import pygeos
import json

#functions convert wkb to geojson(to be read by cesium)   
response = requests.get('http://localhost:8082/geometry')
geometry_data = response.json()
geometries=[]
for wkb in geometry_data:
    geometry = pygeos.from_wkb(bytes.fromhex(wkb['geom_visual']))
    geometries.append(pygeos.to_wkt(geometry))
    
geojson_data = {
    'type': 'FeatureCollection',
    'name': 'geojson',
    'crs' :{
        'type': 'name',
        'properties':{
            'name': 'urn:ogc:def:crs:OGC:1.3:CRS84'
        }
    },
    'features':[]
}

for wkt, wkb in zip(geometries, geometry_data):
    feature = {
        'type': 'Feature',
        'properties': {
            'refcat_visual': wkb['refcat_visual'],
            'id': wkb['id']
        },
        'geometry': {
            'type': 'MultiPolygon',
            'coordinates': [(wkt)]
        }
    }
    geojson_data['features'].append(feature)
    json =json.dumps(geojson_data)
        