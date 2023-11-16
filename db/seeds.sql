-- Use the employee_trackerdb database
USE employee_trackerdb;

-- Inserting initial data into 'department' table
INSERT INTO department (name) VALUES
('Game Design'),
('Programming'),
('Art and Graphics'),
('Quality Assurance'),
('Marketing'),
('Human Resources');

-- Inserting initial data into 'role' table
INSERT INTO role (title, salary, department_id) VALUES
('Lead Game Designer', 85000, 1),
('Software Developer', 95000, 2),
('Graphic Artist', 70000, 3),
('QA Tester', 50000, 4),
('Marketing Specialist', 60000, 5),
('HR Manager', 65000, 6);

-- Inserting initial data into 'employee' table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Alex', 'Johnson', 1, NULL),
('Sam', 'Taylor', 2, NULL),
('Morgan', 'Lee', 3, NULL),
('Jordan', 'Smith', 4, NULL),
('Casey', 'Daniels', 5, NULL),
('Taylor', 'Brown', 6, NULL);

