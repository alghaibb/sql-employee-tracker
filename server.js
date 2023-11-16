const inquirer = require("inquirer");
const mysql = require("mysql2");
const cfonts = require('cfonts');

// create a MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Kolkolpop123!",
  database: "employee_trackerdb",
});

// connect to the database
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database!");
  // start the application
  start();
});

// Function to start the application of CFONT 
cfonts.say('MJS \nSQL Employee Tracker', {
  font: 'block',              // define the font face
  align: 'center',              // define text alignment
  colors: ['blue'],           // define all colors
  background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
  letterSpacing: 1,           // define letter spacing
  lineHeight: 1,              // define the line height
  space: true,                // define if the output text should have empty lines on top and on the bottom
  maxLength: '0',             // define how many character can be on one line
  gradient: false,            // define your two gradient colors
  independentGradient: false, // define if you want to recalculate the gradient for each new line
  transitionGradient: false,  // define if this is a transition between colors directly
  env: 'node'                 // define the environment cfonts is being executed in
});

// Function to Start Thomas SQL Employee Tracker Application
function start() {
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Add a Manager",
        "Assign a manager to an employee",
        "Update an employee role",
        "View Employees by Manager",
        "View Employees by Department",
        "Delete Departments | Roles | Employees",
        "View the total utilized budget of a department",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View all departments":
          viewAllDepartments();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Add a Manager":
          addManager();
          break;
        case "Assign a manager to an employee":
          assignManagerToEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        case "View Employees by Manager":
          viewEmployeesByManager();
          break;
        case "View Employees by Department":
          viewEmployeesByDepartment();
          break;
        case "Delete Departments | Roles | Employees":
          deleteDepartmentsRolesEmployees();
          break;
        case "View the total utilized budget of a department":
          viewTotalUtilizedBudgetOfDepartment();
          break;
        case "Exit":
          connection.end();
          console.log("Goodbye!");
          break;
      }
    });
}

function viewAllDepartments() {
  const query = "SELECT * FROM department"; // Corrected table name
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}


function viewAllRoles() {
  const query = "SELECT role.title, role.id, department.name AS department_name, role.salary FROM role JOIN department ON role.department_id = department.id"; // Corrected table names
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}



// function to view all employees
function viewAllEmployees() {
  const query = `
  SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
  FROM employee e
  LEFT JOIN role r ON e.role_id = r.id
  LEFT JOIN department d ON r.department_id = d.id
  LEFT JOIN employee m ON e.manager_id = m.id;
  `;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}

// function to add a department
function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "name",
      message: "Enter the name of the new department:",
    })
    .then((answer) => {
      const query = `INSERT INTO department (name) VALUES ("${answer.name}")`; // Corrected table name
      connection.query(query, (err, res) => {
        if (err) throw err;
        console.log(`Added department ${answer.name} to the database!`);
        start();
      });
    });
}


function addRole() {
  const query = "SELECT * FROM department";
  connection.query(query, (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Enter the title of the new role:",
        },
        {
          type: "input",
          name: "salary",
          message: "Enter the salary of the new role:",
        },
        {
          type: "list",
          name: "department",
          message: "Select the department for the new role:",
          choices: res.map(
            (department) => {
              return {
                name: department.name,
                value: department.id
              };
            }
          ),
        },
      ])
      .then((answers) => {
        const query = "INSERT INTO role SET ?";
        connection.query(
          query,
          {
            title: answers.title,
            salary: answers.salary,
            department_id: answers.department,
          },
          (err, res) => {
            if (err) throw err;
            console.log(
              `Added role ${answers.title} with salary ${answers.salary} to the database!`
            );
            start();
          }
        );
      });
  });
}

// Function to add an employee
function addEmployee() {
  // Retrieve list of roles from the database
  connection.query("SELECT id, title FROM role", (error, roleResults) => {
    if (error) {
      console.error(error);
      return;
    }

    const roles = roleResults.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    // Retrieve list of employees from the database to use as managers
    connection.query(
      'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee',
      (error, results) => {
        if (error) {
          console.error(error);
          return;
        }

        const managers = results.map(({ id, name }) => ({
          name,
          value: id,
        }));

        // Prompt the user for employee information
        inquirer
          .prompt([
            {
              type: "input",
              name: "firstName",
              message: "Enter the employee's first name:",
            },
            {
              type: "input",
              name: "lastName",
              message: "Enter the employee's last name:",
            },
            {
              type: "list",
              name: "roleId",
              message: "Select the employee role:",
              choices: roles,
            },
            {
              type: "list",
              name: "managerId",
              message: "Select the employee manager:",
              choices: [
                { name: "None", value: null },
                ...managers,
              ],
            },
          ])
          .then((answers) => {
            // Insert the employee into the database
            const sql =
              "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
            const values = [
              answers.firstName,
              answers.lastName,
              answers.roleId,
              answers.managerId,
            ];
            connection.query(sql, values, (error) => {
              if (error) {
                console.error(error);
                return;
              }

              console.log("Employee added successfully");
              start();
            });
          })
          .catch((error) => {
            console.error(error);
          });
      }
    );
  });
}
// Function to add a new Manager
function addManager() {
  // Retrieve roles from the database
  const queryRoles = "SELECT id, title FROM role";
  connection.query(queryRoles, (err, roles) => {
    if (err) throw err;

    inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter the manager's first name:",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter the manager's last name:",
      },
      {
        type: "list",
        name: "roleId",
        message: "Select the manager's role:",
        choices: roles.map(role => ({ name: role.title, value: role.id })),
      }
    ]).then(answers => {
      // Insert the new manager into the employee table
      const insertQuery = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, NULL)";
      const values = [answers.firstName, answers.lastName, answers.roleId];

      connection.query(insertQuery, values, (err, res) => {
        if (err) throw err;
        console.log("New manager added successfully.");
        start();
      });
    });
  });
}

// Function to Assign a Manager to an Employee
function assignManagerToEmployee() {
  // First, get all employees
  const queryEmployees = "SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee";
  connection.query(queryEmployees, (err, employees) => {
    if (err) throw err;

    // Prompt to select an employee
    inquirer.prompt({
      type: "list",
      name: "employeeId",
      message: "Select the employee to assign a manager:",
      choices: employees.map(emp => ({ name: emp.name, value: emp.id }))
    }).then(answer => {
      const employeeId = answer.employeeId;

      // Get potential managers (excluding the selected employee)
      const potentialManagers = employees.filter(emp => emp.id !== employeeId);

      // Prompt to select a manager
      inquirer.prompt({
        type: "list",
        name: "managerId",
        message: "Select a manager for the employee:",
        choices: potentialManagers.map(mgr => ({ name: mgr.name, value: mgr.id })),
        default: null // Allow option for no manager
      }).then(answer => {
        // Update the employee's manager in the database
        const updateQuery = "UPDATE employee SET manager_id = ? WHERE id = ?";
        connection.query(updateQuery, [answer.managerId, employeeId], (err, res) => {
          if (err) throw err;
          console.log("Manager assigned successfully.");
          start();
        });
      });
    });
  });
}

// function to update an employee role
function updateEmployeeRole() {
  const queryEmployees =
    "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id";
  const queryRoles = "SELECT * FROM role";
  connection.query(queryEmployees, (err, resEmployees) => {
    if (err) throw err;
    connection.query(queryRoles, (err, resRoles) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Select the employee to update:",
            choices: resEmployees.map(
              (employee) =>
                `${employee.first_name} ${employee.last_name}`
            ),
          },
          {
            type: "list",
            name: "role",
            message: "Select the new role:",
            choices: resRoles.map((role) => role.title),
          },
        ])
        .then((answers) => {
          const employee = resEmployees.find(
            (employee) =>
              `${employee.first_name} ${employee.last_name}` ===
              answers.employee
          );
          const role = resRoles.find(
            (role) => role.title === answers.role
          );
          const query =
            "UPDATE employee SET role_id = ? WHERE id = ?";
          connection.query(
            query,
            [role.id, employee.id],
            (err, res) => {
              if (err) throw err;
              console.log(
                `Updated ${employee.first_name} ${employee.last_name}'s role to ${role.title} in the database!`
              );
              // restart the application
              start();
            }
          );
        });
    });
  });
}

// Function to View Employees by Manager
function viewEmployeesByManager() {
  const query = `
      SELECT 
          e.id, 
          e.first_name, 
          e.last_name, 
          r.title, 
          d.name AS department_name,  
          CONCAT(m.first_name, ' ', m.last_name) AS manager_name
      FROM 
          employee e
          INNER JOIN role r ON e.role_id = r.id
          INNER JOIN department d ON r.department_id = d.id 
          LEFT JOIN employee m ON e.manager_id = m.id
      ORDER BY 
          manager_name, 
          e.last_name, 
          e.first_name
  `;

  connection.query(query, (err, res) => {
    if (err) throw err;

    // Group employees by manager
    const employeesByManager = res.reduce((acc, cur) => {
      const managerName = cur.manager_name || 'No Manager';
      if (!acc[managerName]) {
        acc[managerName] = [];
      }
      acc[managerName].push(cur);
      return acc;
    }, {});

    // Display employees by manager
    console.table("Employees by manager:");
    for (const managerName in employeesByManager) {
      console.log(`\n${managerName}:`);
      const employees = employeesByManager[managerName];
      employees.forEach((employee) => {
        console.table(
          `  ${employee.first_name} ${employee.last_name} | ${employee.title} | ${employee.department_name}`
        );
      });
    }

    // Restart the application
    start();
  });
}
// Function to view Employees by Department
function viewEmployeesByDepartment() {
  const query = `
  SELECT 
      d.name AS department_name, 
      e.first_name, 
      e.last_name 
  FROM 
      employee e 
      INNER JOIN role r ON e.role_id = r.id 
      INNER JOIN department d ON r.department_id = d.id 
  ORDER BY 
      d.name ASC`;

  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log("\nEmployees by department:");
    console.table(res);
    // Restart the application
    start();
  });
}

// Function to DELETE Departments Roles Employees
function deleteDepartmentsRolesEmployees() {
  inquirer
    .prompt({
      type: "list",
      name: "data",
      message: "What would you like to delete?",
      choices: ["Employee", "Role", "Department"],
    })
    .then((answer) => {
      switch (answer.data) {
        case "Employee":
          deleteEmployee();
          break;
        case "Role":
          deleteRole();
          break;
        case "Department":
          deleteDepartment();
          break;
        default:
          console.log(`Invalid data: ${answer.data}`);
          start();
          break;
      }
    });
}
// Function to DELETE Employees
function deleteEmployee() {
  const query = "SELECT * FROM employee";
  connection.query(query, (err, res) => {
    if (err) throw err;
    const employeeList = res.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));
    employeeList.push({ name: "Go Back", value: "back" }); // add a "back" option
    inquirer
      .prompt({
        type: "list",
        name: "id",
        message: "Select the employee you want to delete:",
        choices: employeeList,
      })
      .then((answer) => {
        if (answer.id === "back") {
          // check if user selected "back"
          deleteDepartmentsRolesEmployees();
          return;
        }
        const query = "DELETE FROM employee WHERE id = ?";
        connection.query(query, [answer.id], (err, res) => {
          if (err) throw err;
          console.log(
            `Deleted employee with ID ${answer.id} from the database!`

          );
          // restart the application
          start();
        });
      });
  });
}
// Function to DELETE Employees
function deleteEmployee() {
  const query = "SELECT * FROM employee";
  connection.query(query, (err, res) => {
    if (err) throw err;
    const employeeList = res.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));
    employeeList.push({ name: "Go Back", value: "back" });

    inquirer.prompt({
      type: "list",
      name: "id",
      message: "Select the employee you want to delete:",
      choices: employeeList,
    }).then((answer) => {
      if (answer.id === "back") {
        start();
        return;
      }

      // Check if the employee is a manager
      const managerCheckQuery = "SELECT * FROM employee WHERE manager_id = ?";
      connection.query(managerCheckQuery, [answer.id], (err, managerRes) => {
        if (err) throw err;

        if (managerRes.length > 0) {
          console.log("Cannot delete the employee as they are set as a manager for other employees.");
          start();
        } else {
          const deleteQuery = "DELETE FROM employee WHERE id = ?";
          connection.query(deleteQuery, [answer.id], (err, deleteRes) => {
            if (err) throw err;
            console.log(`Deleted employee with ID ${answer.id} from the database.`);
            start();
          });
        }
      });
    });
  });
}

// Function to DELETE Department
function deleteDepartment() {
  const query = "SELECT * FROM department";
  connection.query(query, (err, departments) => {
    if (err) throw err;

    inquirer.prompt({
      type: "list",
      name: "departmentId",
      message: "Which department do you want to delete?",
      choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
    }).then(answer => {
      const deleteQuery = "DELETE FROM department WHERE id = ?";
      connection.query(deleteQuery, [answer.departmentId], (err, res) => {
        if (err) {
          if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            console.log("Cannot delete this department because it is referenced in the roles table. Please delete or update the associated roles first.");
            start();
          } else {
            throw err;
          }
        } else {
          console.log(`Deleted department with ID ${answer.departmentId} from the database!`);
          start();
        }
      });
    });
  });
}

// Function to DELETE Role
function deleteRole() {
  const query = "SELECT * FROM role";
  connection.query(query, (err, roles) => {
    if (err) throw err;

    inquirer.prompt({
      type: "list",
      name: "roleId",
      message: "Select the role you want to delete:",
      choices: roles.map(role => ({ name: role.title, value: role.id }))
    }).then(answer => {
      // Check if the role is being referenced in employee table
      const employeeCheckQuery = "SELECT * FROM employee WHERE role_id = ?";
      connection.query(employeeCheckQuery, [answer.roleId], (error, employees) => {
        if (error) throw error;

        if (employees.length > 0) {
          console.log("Cannot delete this role because it is assigned to employees. Please reassign or remove these employees first.");
          start();
        } else {
          const deleteQuery = "DELETE FROM role WHERE id = ?";
          connection.query(deleteQuery, [answer.roleId], (err, res) => {
            if (err) throw err;
            console.log(`Deleted role with ID ${answer.roleId} from the database!`);
            start();
          });
        }
      });
    });
  });
}


// Function to view Total Utilized Budget of Department
function viewTotalUtilizedBudgetOfDepartment() {
  const query = "SELECT * FROM department";
  connection.query(query, (err, res) => {
    if (err) throw err;
    const departmentChoices = res.map((department) => ({
      name: department.name,
      value: department.id,
    }));

    // Add an 'All Departments' option
    departmentChoices.push({ name: 'All Departments', value: 'all' });

    // prompt the user to select a department
    inquirer.prompt({
      type: "list",
      name: "departmentId",
      message: "Which department do you want to calculate the total salary for?",
      choices: departmentChoices,
    }).then((answer) => {
      let query;
      if (answer.departmentId === 'all') {
        // Query for all departments
        query = `
          SELECT 
              'All Departments' AS department,
              SUM(role.salary) AS total_salary
          FROM 
              department
              INNER JOIN role ON department.id = role.department_id
              INNER JOIN employee ON role.id = employee.role_id;
        `;
      } else {
        // Query for a specific department
        query = `
          SELECT 
              department.name AS department,
              SUM(role.salary) AS total_salary
          FROM 
              department
              INNER JOIN role ON department.id = role.department_id
              INNER JOIN employee ON role.id = employee.role_id
          WHERE 
              department.id = ?
          GROUP BY 
              department.id;
        `;
      }

      connection.query(query, [answer.departmentId], (err, res) => {
        if (err) throw err;
        if (res.length > 0) {
          const totalSalary = res[0].total_salary;
          console.log(`The total salary for ${res[0].department} is $${totalSalary}`);
        } else {
          console.log("No data found for the selected option.");
        }
        start();
      });
    });
  });
}


// close the connection when the application exits
process.on("exit", () => {
  connection.end();
});