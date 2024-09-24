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
  