const inquirer = require('inquirer');
const { Pool } = require('pg');

require('console.table');
require('dotenv').config();

// Connect to database
const pool = new Pool({
  user: process.env.DB_USER || 'postgres', 
  password: process.env.DB_PASSWORD || '', 
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

pool.connect((err) => {
  if (err) {
    console.error('Connection error', err.stack);
  } else {
    console.log('Connected to the rez_technologies database.');
    start();
  }
});

// Start function to prompt user choices
function start() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          pool.end();
          console.log('Goodbye!');
          break;
      }
    });
}

// View all departments
const viewAllDepartments = async () => {
  console.clear();
  try {
    const result = await pool.query('SELECT * FROM department');
    console.clear(); // Clear the console before showing the table
    console.log();  // Insert an empty line to avoid Inquierer boilerplate
    console.table(result.rows);
    start();  // Return to the main menu
  } catch (err) {
    console.error(err.message);
    start();  // Return to the main menu
  }
};

// View all roles
const viewAllRoles = async () => {
  try {
    const result = await pool.query(`
      SELECT role.id, role.title, role.salary, department.name AS department
      FROM role
      INNER JOIN department ON role.department_id = department.id
    `);
    console.clear();
    console.table(result.rows);
    start();
  } catch (err) {
    console.error(err.message);
    start();
  }
};

// View all employees
const viewAllEmployees = async () => {
  try {
    const result = await pool.query(`
      SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary,
             CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      LEFT JOIN employee manager ON employee.manager_id = manager.id
    `);
    console.clear();
    console.table(result.rows);
    start();
  } catch (err) {
    console.error(err.message);
    start();
  }
};

// Add a department
const addDepartment = async () => {
  console.clear(); // Clear the console before displaying the prompt
  inquirer
    .prompt({
      name: 'name',
      type: 'input',
      message: 'Enter the name of the department:'
    })
    .then(async (answer) => {
      try {
        await pool.query('INSERT INTO department (name) VALUES ($1)', [answer.name]);
        console.log('Department added successfully!');
        start();
      } catch (err) {
        console.error(err.message);
        start();
      }
    });
};

// Add a role
const addRole = async () => {
  console.clear(); // Clear the console before displaying the prompt
  const departments = await pool.query('SELECT * FROM department');
  const departmentChoices = departments.rows.map(({ id, name }) => ({
    name: name,
    value: id
  }));
  inquirer
    .prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Enter the role title:'
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Enter the salary for this role:'
      },
      {
        name: 'department_id',
        type: 'list',
        message: 'Select the department for this role:',
        choices: departmentChoices
      }
    ])
    .then(async (answers) => {
      try {
        await pool.query(
          'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
          [answers.title, answers.salary, answers.department_id]
        );
        console.log('Role added successfully!');
        start();
      } catch (err) {
        console.error(err.message);
        start();
      }
    });
};

// Add an employee
const addEmployee = async () => {
  console.clear(); // Clear the console before displaying the prompt
  const roles = await pool.query('SELECT * FROM role');
  const roleChoices = roles.rows.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const employees = await pool.query('SELECT * FROM employee');
  const managerChoices = employees.rows.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));
  managerChoices.push({ name: 'None', value: null });

  inquirer
    .prompt([
      {
        name: 'first_name',
        type: 'input',
        message: 'Enter the employee\'s first name:'
      },
      {
        name: 'last_name',
        type: 'input',
        message: 'Enter the employee\'s last name:'
      },
      {
        name: 'role_id',
        type: 'list',
        message: 'Select the employee\'s role:',
        choices: roleChoices
      },
      {
        name: 'manager_id',
        type: 'list',
        message: 'Select the employee\'s manager:',
        choices: managerChoices
      }
    ])
    .then(async (answers) => {
      try {
        await pool.query(
          'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
          [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]
        );
        console.log('Employee added successfully!');
        start();
      } catch (err) {
        console.error(err.message);
        start();
      }
    });
};

// Update an employee's role
const updateEmployeeRole = async () => {
  console.clear(); // Clear the console before displaying the prompt
  const employees = await pool.query('SELECT * FROM employee');
  const employeeChoices = employees.rows.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const roles = await pool.query('SELECT * FROM role');
  const roleChoices = roles.rows.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  inquirer
    .prompt([
      {
        name: 'employee_id',
        type: 'list',
        message: 'Select the employee to update:',
        choices: employeeChoices
      },
      {
        name: 'role_id',
        type: 'list',
        message: 'Select the new role:',
        choices: roleChoices
      }
    ])
    .then(async (answers) => {
      try {
        await pool.query(
          'UPDATE employee SET role_id = $1 WHERE id = $2',
          [answers.role_id, answers.employee_id]
        );
        console.log('Employee role updated successfully!');
        start();
      } catch (err) {
        console.error(err.message);
        start();
      }
    });
};

start();
