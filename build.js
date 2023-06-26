const pg = require('pg-promise')();
const XMLBuilder = require('fs');

const database = pg({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Ceci23post!',

});

const queryXml = `
<query xmlns="http://www.3dcitydb.org/importer-exporter/config">
  <typeNames>
    <typeName>core:_CityObject</typeName>
  </typeNames>
</query>
`;
  
function generateCityGML(cityGMLData) {
  const rootElement = {
    CityModel: {
      '@xmlns': 'http://www.opengis.net/citygml/2.0',
      '@xmlns:core': 'http://www.opengis.net/citygml/base/2.0',
      '@xmlns:brid': 'http://www.opengis.net/citygml/bridge/2.0',
      '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      '@xsi:schemaLocation': 'http://www.opengis.net/citygml/2.0 http://schemas.opengis.net/citygml/2.0/cityGMLBase.xsd',
      featureMember: cityGMLData,
    },
  };


  const xmlString = '<?xml version="1.0" encoding="UTF-8"?>' + js2xmlparser.parse('CityGML', rootElement);

  return xmlString;
}

database.any(queryXml)
  .then((cityGMLData) => {
    const cityGMLXml = generateCityGML(cityGMLData);
    fs.writeFileSync('prueba.citygml', cityGMLXml);

    console.log('CityGML file exported successfully.');
  })
  .catch((error) => {
    console.error('Error exporting CityGML file:', error);
  });