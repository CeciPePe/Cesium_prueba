# -*- coding: utf-8 -*-
"""
Created on Thu Jun 22 10:23:10 2023

@author: cperez
"""
import http.server
import psycopg2
import geojson
import shapely.wkt as wkt
import requests
import pygeos
import json

hostname = "localhost"
database = "postgres"
username = "postgres"
pwd = "Ceci23post!"
port_id = 5432

html_template = """
<html>
<head>
    <title>Server</title>
</head>
<body>
    <h1>{message}</h1>
</body>
</html>
"""

#class that defines the connection server
class Server(http.server.BaseHTTPRequestHandler):
    def get_geometry(self):
        conn = psycopg2.connect(
            host=hostname,
            port=port_id,
            database=database,
            user=username,
            password=pwd
        )
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM visualization.table;")
        result = cursor.fetchall()

        cursor.close()
        conn.close()
        response = "Query result: {}".format(result)
        html_response = html_template.format(message=response)
        # Send the response to the client
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        self.wfile.write(html_response.encode())

if __name__ == "__main__":
    server_address = ("", 8082)
    httpd = http.server.HTTPServer(server_address, Server)
    print("Server running on port 8082...")
    httpd.serve_forever()