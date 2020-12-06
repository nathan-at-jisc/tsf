const express = require('express');
const pgp = require('pg-promise')();
const cors = require('cors');
const bodyParser = require('body-parser');

const PORT = 4003;
const app = express();

const db = pgp({
    database: 'postgres',
    host: '0.0.0.0',
    password: 'postgres',
    port: '5434',
    user: 'postgres'
});

app.use(cors());
app.use(bodyParser());

app.post('/devices/scan', async (req, res) => {
    const { scanning_device_id, visible_devices } = req.body;

    try {
        const columns = new pgp.helpers.ColumnSet(['scanning_device_id', 'visible_device_id', 'time', 'interface', 'signal_strength'], {table: 'devices'});
        const values = visible_devices.map(row => ({
            ...row,
            scanning_device_id
        }));
    
        const query = pgp.helpers.insert(values, columns);
    
        const dbRes = await db.query(query);
    
        res.json(dbRes);
    } catch (err) {
        res.status(503).json(null);
    }
});

app.get('/devices/:id', async (req, res) => {
    const { id } = req.params;
    const { date_from, date_to } = req.query;

    try {
        const query = `SELECT 
            id, 
            scanning_device_id, 
            visible_device_id, 
            time, 
            interface, 
            signal_strength, 
            AVG(signal_strength) OVER() 
            FROM devices 
            WHERE (scanning_device_id = $1 OR visible_device_id = $1) 
            AND time >= $2 
            AND time <= $3`;

        const dbRes = await db.query(query, [id, date_from, date_to]);

        res.json(dbRes);
    } catch (err) {
        res.status(503).json(null);
    }
});

app.get('/devices', async (req, res) => {
    try {
        const query = `SELECT scanning_device_id
        FROM devices
        WHERE scanning_device_id IS NOT NULL
        UNION
        SELECT visible_device_id
        FROM devices
        WHERE visible_device_id IS NOT NULL;`
        const dbRes = await db.query(query);

        const data = dbRes.map(row => row.scanning_device_id);

        res.json(data);
    } catch (err) {
        res.status(503).json(null);
    }
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});