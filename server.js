const express = require('express');
const {Pool} = require('pg');
const app = express();
const cors = require('cors')
const port = 8082;
app.use(cors());

const pool = new Pool({
    host: 'localhost',
    database: 'postgres',
    user: 'postgres',
    password: 'Ceci23post!',
    port: 5432,
})


app.get('/geometry', (req, res) =>{
    pool.query(
        'SELECT * FROM visualization.table_prueba', (error, results) =>{
            if(error){
                console.error ('Error', error);
                res.status(500).send('Error');
            } else {
                const features  = results.rows;
                res.json(features);
            }
        });
});

/*
app.get('/grupo', (req, res) =>{
    pool.query(
        'SELECT * FROM visualization.grupo', (error, results) =>{
            if(error){
                console.error ('Error', error);
                res.status(500).send('Error');
            } else {
                const geometry  = results.rows.map((row)=> row.geom_visual);
                res.json(geometry);
            }
        });
});
*/
app.listen(port, () =>{
    console.log('Server on port:', port);
});