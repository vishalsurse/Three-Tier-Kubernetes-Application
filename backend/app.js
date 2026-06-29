const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: 'postgres-service',
  user: 'devops',
  password: 'devops123',
  database: 'appdb',
  port: 5432
});

pool.query(`
CREATE TABLE IF NOT EXISTS users (
 id SERIAL PRIMARY KEY,
 name VARCHAR(100),
 email VARCHAR(100)
)
`);

app.get('/', (req, res) => res.send('Backend Running'));

app.get('/users', async (req, res) => {
 const result = await pool.query('SELECT * FROM users');
 res.json(result.rows);
});

app.post('/users', async (req, res) => {
 const { name, email } = req.body;
 await pool.query('INSERT INTO users(name,email) VALUES($1,$2)', [name,email]);
 res.send('User Added');
});

app.listen(8081, () => console.log("Server running on 8081"));
