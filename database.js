const { Pool } = require('pg');

const CityGMLService = class {
  constructor(cesiumGeomService, dataService) {
    this.cesiumGeomService = cesiumGeomService;
    this.dataService = dataService;
    this.subject = new Subject();
    this.crs = { id: undefined, anchor: [0, 0, 0], xyz: { x: 1, y: 1, z: 1 } };
  }

  sendMessage(message) {
    this.subject.next({ text: message });
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage() {
    return this.subject.asObservable();
  }

  async setEPSG(crs) {
    this.epsg = new Promise((resolve) => {
      let val = '';
      if (crs === undefined) {
        val = '+proj=tmerc +ellps=WGS84 +units=m +no_defs';
        resolve(val);
      } else {
        const pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'ARV_district_buildings',
            password: 'Ceci23post!',
            port: '5432',
        });

        const query = `SELECT proj4text FROM epsg_table WHERE srid = ${crs}`;
        pool.query(query, (err, result) => {
          if (err) {
            console.error('Error executing query', err);
            val = '+proj=tmerc +ellps=WGS84 +units=m +no_defs';
            resolve(val);
          } else {
            val = result.rows[0].proj4text;
            if (val === undefined) {
              val = '+proj=tmerc +ellps=WGS84 +units=m +no_defs';
            }
            resolve(val);
          }
        });
      }
    });
  }

  clearEPSG() {
    this.epsg = undefined;
    this.crs = { id: undefined, anchor: [0, 0, 0], xyz: { x: 1, y: 1, z: 1 } };
  }

  projectPtsToWGS84(coords) {
    const projcoords = Object(__WEBPACK_IMPORTED_MODULE_2_proj4__["a" /* default */])(
      this.epsg,
      'WGS84',
      [(coords[0] / this.crs['xyz']['x']), (coords[1] / this.crs['xyz']['y'])]
    );
    const newcoords = [
      projcoords[0] + this.crs['anchor'][0],
      projcoords[1] + this.crs['anchor'][1],
      (coords[2] / this.crs['xyz']['z']) + this.crs['anchor'][2]
    ];
    return newcoords;
  }

  genPoly(srf, props, srf_type) {
    const pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'ARV_district_buildings',
      password: 'Ceci23post!',
      port: '5432',
    });

    const query = 'SELECT * FROM visualization.table WHERE srf = $1';
    pool.query(query, [srf], (err, result) => {
      if (err) {
        console.error('Error executing query', err);
      } else {
        const rows = result.rows;
        const solid = [];

        rows.forEach(row => {
          const coords = row.coords;
          solid.push(this.getCoords(coords));
        });

        this.cesiumGeomService.genSolidGroup(solid, props, srf_type);
      }
    });
  }

  getCoords(coords) {
    const coordsArray = coords.split(' ').map(coord => coord.split(','));
    const vertices = coordsArray.map(coord => {
      const [x, y, z] = coord;
      const newCoords = this.projectPtsToWGS84([parseFloat(x), parseFloat(y), parseFloat(z)]);
      return { x: newCoords[0], y: newCoords[1], z: newCoords[2] };
    });
    return vertices;
  }
};

module.exports = CityGMLService;
