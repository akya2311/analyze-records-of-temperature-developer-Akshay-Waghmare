

const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 5000;

// Connect to SQLite database
const db = new sqlite3.Database('temperatures.db');

// Middleware for JSON parsing
app.use(express.json());


// GET all temperatures
app.get('/temperatures', (req, res) => {
    db.all('SELECT * FROM temperatures', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(rows);
        }
    });
});

// POST a new temperature
app.post('/temperatures', (req, res) => {
    const { date, temperature } = req.body;
    db.run('INSERT INTO temperatures (date, temperature) VALUES (?, ?)', [date, temperature], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.json({ id: this.lastID });
        }
    });
});

// PUT update a temperature
app.put('/temperatures/:id', (req, res) => {
    const { id } = req.params;
    const { date, temperature } = req.body;
    db.run('UPDATE temperatures SET date = ?, temperature = ? WHERE id = ?', [date, temperature, id], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.json({ message: 'Temperature updated successfully' });
        }
    });
});

// DELETE a temperature
app.delete('/temperatures/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM temperatures WHERE id = ?', id, function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.json({ message: 'Temperature deleted successfully' });
        }
    });
});



// Handle requests for daily averages
app.get('/daily', (req, res) => {
    db.all("SELECT strftime('%Y-%m-%d', date) AS day, AVG(temperature) AS avg_temperature FROM temperatures GROUP BY day ORDER BY day", (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(rows);
            
        }
    });
});


// Handle requests for weekly averages
app.get('/weekly', (req, res) => {
    db.all("SELECT strftime('%Y-%W', date) AS week, AVG(temperature) AS avg_temperature FROM temperatures GROUP BY week ORDER BY week", (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(rows);
            
        }
    });
});



// Handle requests for monthly averages
app.get('/monthly', (req, res) => {
    db.all("SELECT strftime('%Y-%m', date) AS month, AVG(temperature) AS avg_temperature FROM temperatures GROUP BY month ORDER BY month", (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(rows);
        }
    });
});

// Handle requests for yearly averages
app.get('/yearly', (req, res) => {
    db.all("SELECT strftime('%Y', date) AS year, AVG(temperature) AS avg_temperature FROM temperatures GROUP BY year ORDER BY year", (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(rows);
        }
    });
})

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}
                http://localhost:${port}/temperatures
                http://localhost:${port}/monthly
                http://localhost:${port}/weekly
                http://localhost:${port}/daily
                http://localhost:${port}/yearly                
    `);
});
