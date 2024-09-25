const viewAllDepartments = async () => {
    try {
      const result = await pool.query('SELECT * FROM department');
      console.clear(); // Clear the console before showing the table
      console.table(result.rows);
      start(); // Return to the main menu
    } catch (err) {
      console.error(err.message);
      start(); // Return to the main menu
    }
  };
  
  // ---------------------------------------
  const addDepartment = async () => {
    try {
      const answer = await inquirer.prompt({
        name: 'name',
        type: 'input',
        message: 'Enter the name of the department:'
      });
  
      await pool.query('INSERT INTO department (name) VALUES ($1)', [answer.name]);
      console.log('Department added successfully!');
      start(); // Returns to the menu
    } catch (err) {
      console.error(err.message);
      start(); // Returns to the menu on error
    }
  };

  // ----------------------------------------------

  const addDepartment = async () => {
    console.clear(); // Clear the console before displaying the prompt
    
    try {
      const answer = await inquirer.prompt({
        name: 'name',
        type: 'input',
        message: 'Enter the name of the department:'
      });
  
      await pool.query('INSERT INTO department (name) VALUES ($1)', [answer.name]);
      console.log('Department added successfully!');
      start(); // Return to the main menu
    } catch (err) {
      console.error(err.message);
      start(); // Return to the main menu on error
    }
  };

  // Check for existing role
  const addRole = async () => {
    const departments = await pool.query('SELECT * FROM department');
    const departmentChoices = departments.rows.map(({ id, name }) => ({
      name: name,
      value: id
    }));
  
    const answers = await inquirer.prompt([
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
    ]);
  
    try {
      // Check if the role title already exists
      const existingRole = await pool.query('SELECT * FROM role WHERE title = $1', [answers.title]);
  
      if (existingRole.rowCount > 0) {
        console.log('Error: A role with this title already exists. Please choose a different title.');
      } else {
        // Proceed with inserting the new role
        await pool.query(
          'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
          [answers.title, answers.salary, answers.department_id]
        );
        console.log('Role added successfully!');
      }
      
      start(); // Return to the main menu
  
    } catch (err) {
      console.error(err.message);
      start(); // Return to the main menu on error
    }
  };
  
  // ---------------------------------------------
  const addRole = async () => {
    try {
      const departments = await pool.query('SELECT * FROM department');
      const departmentChoices = departments.rows.map(({ id, name }) => ({
        name: name,
        value: id
      }));
  
      // Prompt for role details
      const answers = await inquirer.prompt([
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
      ]);
  
      // Check if the role title already exists
      const existingRole = await pool.query('SELECT * FROM role WHERE title = $1', [answers.title]);
  
      if (existingRole.rowCount > 0) {
        console.log('Error: A role with this title already exists. Please choose a different title.');
      } else {
        // Proceed with inserting the new role
        await pool.query(
          'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
          [answers.title, answers.salary, answers.department_id]
        );
        console.log('Role added successfully!');
      }
  
      start(); // Return to the main menu
  
    } catch (err) {
      console.error(err.message);
      start(); // Return to the main menu on error
    }
  };
  
  
  
