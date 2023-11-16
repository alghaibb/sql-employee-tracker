-- Use the employee_trackerdb database
USE employee_trackerdb;

-- Inserting initial data into 'department' table
INSERT INTO departments (department_name) VALUES
('Game Design'),
('Programming'),
('Art and Graphics'),
('Quality Assurance'),
('Marketing'),
('Human Resources');

-- Inserting initial data into 'role' table
INSERT INTO roles (title, salary, department_id) VALUES
('Senior Game Designer', 95000, 1),
('Lead Software Developer', 100000, 2),
('Art Director', 90000, 3),
('QA Lead', 80000, 4),
('Marketing Director', 85000, 5),
('HR Director', 85000, 6),
('Game Designer', 75000, 1),
('Software Developer', 80000, 2),
('Graphic Artist', 70000, 3),
('QA Tester', 55000, 4),
('Marketing Specialist', 60000, 5),
('HR Associate', 60000, 6);

-- Inserting initial data into 'employee' table
-- First, insert managers
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Alice', 'Wright', 1, NULL), -- Senior Game Designer
('Bob', 'Smith', 2, NULL),    -- Lead Software Developer
('Carol', 'Johnson', 3, NULL),-- Art Director
('Dave', 'Brown', 4, NULL),   -- QA Lead
('Eva', 'Davis', 5, NULL),    -- Marketing Director
('Frank', 'Miller', 6, NULL); -- HR Director

-- Then, insert employees with managers
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Alex', 'Johnson', 7, 1), -- Game Designer reporting to Alice Wright
('Sam', 'Taylor', 8, 2),   -- Software Developer reporting to Bob Smith
('Morgan', 'Lee', 9, 3),   -- Graphic Artist reporting to Carol Johnson
('Jordan', 'Smith', 10, 4),-- QA Tester reporting to Dave Brown
('Casey', 'Daniels', 11, 5),-- Marketing Specialist reporting to Eva Davis
('Taylor', 'Brown', 12, 6);-- HR Associate reporting to Frank Miller

