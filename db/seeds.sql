-- Insert Departments Data

INSERT INTO department (name) VALUES
('Marketing'),
('Product'),
('Engineering');

-- Insert Roles Data

INSERT INTO role (title, salary, department_id) VALUES
('Manager', 105000, 1),
('Consultant', 85000, 2),
('Direct Contributor', 75000, 3);

-- Insert Employees Data

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),
('Mike', 'Johnson', 2, 1),
('Mary', 'Shelley', 3, 1);