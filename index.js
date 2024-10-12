const express = require('express');
const bodyParser = require('body-parser');
const { application } = require('express');
const port = process.env.port || 5000;
const app = express();

const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'korawit.ddns.net',
    user: 'webapp',
    password: 'secret2024',
    database: 'shop',
    port: 3307
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE"
    );
    next();
});
app.use(express.json());
 

 
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});
  app.get('/',(req, res) => {
    res.send('Hello world')
  })
 
  app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching products');
        }
        res.send(results);
    });
}); //ใช้งานปกติ เทสแล้วผ่าน /api/products ใช้ได้อิอิ

app.get('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).send('ไม่ใช่เลข ID');
    }

    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching product');
        }
        if (results.length > 0) {
            res.send(results[0]);
        } else {
            res.status(404).send('Product not found');
        }
    });
});//ใช้งานปกติ เทสแล้วผ่าน /api/products/6 ใช้ได้อิอิ

app.listen(port, function () {
    console.log('Listening on port', port);
});