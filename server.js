const inquirer = require('inquirer');
// Import and require Pool (node-postgres)
// We'll be creating a Connection Pool. Read up on the benefits here: https://node-postgres.com/features/pooling
const { Pool } = require('pg');

// Connect to database
const pool = new Pool(
  {
    // Enter PostgreSQL username
    user: 'postgres',
    // Enter PostgreSQL password
    password: '',
    host: 'localhost',
    database: 'rez_technologies'
  },
  console.log(`Connected to the movies_db database.`)
)

pool.connect();

async function viewAllDepartments() {
  const result = await pool.query('SELECT * FROM department');
  return result.rows;
}

// const viewAllDepartments = () => {
//   client.query('SELECT * FROM departments', (err, res) => {
//       if (err) {
//           console.error(err);
//       } else {
//           console.table(res.rows);
//       }
//       options();
//   });
// };

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
