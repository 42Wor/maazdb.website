LOGIN admin PASSWORD 'admin';
CREATE DATABASE full_test_db;
USE full_test_db;
CREATE TABLE employees (
id SERIAL PRIMARY KEY,
name TEXT,
role TEXT,
salary DOUBLE,
is_active BOOL,
joined_at TIMESTAMP
);
INSERT INTO employees (name, role, salary, is_active, joined_at)
VALUES ('Alice', 'Engineer', 85000.00, TRUE, '2023-01-15 09:00:00');
INSERT INTO employees (name, role, salary, is_active, joined_at)
VALUES ('Bob', 'Manager', 95000.50, TRUE, '2022-05-20 10:30:00');
INSERT INTO employees (name, role, salary, is_active, joined_at)
VALUES ('Charlie', 'Intern', 30000.00, FALSE, '2024-01-10 08:15:00');
SELECT * FROM employees;
SELECT name, salary FROM employees WHERE salary > 50000;
UPDATE employees SET salary = 90000.00 WHERE name = 'Alice';
SELECT name, salary FROM employees WHERE name = 'Alice';
DELETE FROM employees WHERE name = 'Charlie';
SELECT COUNT(*) FROM employees;
CREATE TABLE projects (
pid SERIAL PRIMARY KEY,
title TEXT,
lead_id INT,
FOREIGN KEY (lead_id) REFERENCES employees(id)
);
INSERT INTO projects (title, lead_id) VALUES ('Project X', 1);
SELECT * FROM projects;
BACKUP 'full_backup_test';
DROP TABLE projects;
DROP TABLE employees;
RESTORE 'full_backup_test';
SELECT COUNT(*) FROM employees;
USE system;
DROP DATABASE full_test_db;
LOGIN admin PASSWORD 'admin';
CREATE DATABASE file_test_db;
USE file_test_db;
CREATE TABLE products (
id SERIAL PRIMARY KEY,
name TEXT,
price DOUBLE
);
INSERT INTO products (name, price) VALUES ('Laptop', 999.99);
INSERT INTO products (name, price) VALUES ('Mouse', 25.50);
INSERT INTO products (name, price) VALUES ('Keyboard', 45.00);
SELECT * FROM products;
UPDATE products SET price = 899.99 WHERE name = 'Laptop';
DELETE FROM products WHERE name = 'Mouse';
BACKUP 'file_test_backup';
SELECT COUNT(*) FROM products;
USE system;
DROP DATABASE file_test_db;

1. Data Types
MarsDB supports the following data types for column definitions and values:
Type	SQL Keyword	Description
Integer	INT	32-bit signed integer.
Serial	SERIAL	Auto-incrementing integer.
Float/Double	FLOAT, DOUBLE	Floating-point numbers.
Boolean	BOOL, BOOLEAN	TRUE or FALSE.
Text	TEXT, STRING	UTF-8 string literals.
Timestamp	TIMESTAMP	Date and time (Formats: YYYY-MM-DD HH:MM:SS or YYYY-MM-DD).
UUID	UUID	128-bit Universally Unique Identifier.
2. Data Definition Language (DDL)
Create Database
Creates a new database container.
code
SQL
CREATE DATABASE database_name;
Create Table
Defines a new table schema. Supports Primary Keys and Foreign Keys.
code
SQL
CREATE TABLE table_name (
    column_name DATA_TYPE PRIMARY KEY,
    column_name DATA_TYPE,
    FOREIGN KEY (local_col) REFERENCES foreign_table(foreign_col)
);
Note: Constraints can be defined inline or at the end of the column list.
Drop Object
Removes a database, table, or user.
code
SQL
DROP DATABASE name;
DROP TABLE name;
DROP USER username;
Use Database
Sets the current active database.
code
SQL
USE database_name;
Show & Describe
Inspect the system schema.
code
SQL
SHOW DATABASES;
SHOW TABLES;
DESCRIBE table_name; -- or DESC table_name;
3. Data Manipulation Language (DML)
Insert
Adds new rows to a table.
code
SQL
INSERT INTO table_name (col1, col2) VALUES (val1, val2);
-- Or without column names (expects all columns)
INSERT INTO table_name VALUES (val1, val2, val3);
Update
Modifies existing data.
code
SQL
UPDATE table_name 
SET column_name = value 
WHERE condition;
Current Limitation: The parser currently supports only one condition in the WHERE clause for UPDATE statements.
Delete
Removes rows from a table.
code
SQL
DELETE FROM table_name WHERE condition;
4. Data Query Language (DQL)
Select
The primary command for retrieving data.
code
SQL
SELECT column1, column2, COUNT(*)
FROM table_name
WHERE condition AND/OR condition
ORDER BY column_name [ASC | DESC]
LIMIT number OFFSET number;
Features:
Wildcards: SELECT * FROM table;
Expressions: SELECT 1 + 1; (Returns a virtual table _expr).
Aggregates: Supports COUNT(*).
Logic: Supports complex filtering with AND, OR, and parentheses ().
5. Operators and Expressions
Comparison Operators
Used in WHERE clauses:
=: Equal
!= or <>: Not equal
<: Less than
<=: Less than or equal
>: Greater than
>=: Greater than or equal
IS NULL / IS NOT NULL: Null checks
Logical Operators
AND
OR
NOT
Arithmetic
+, -, *, / (Basic support for constant expressions like 1 + 1).
6. Authentication and System
User Management
code
SQL
-- Create a user
CREATE USER username WITH PASSWORD 'my_password';
-- or
CREATE USER username PASSWORD password_ident;

-- Authenticate
LOGIN username PASSWORD 'my_password';
Backup and Restore
Administrative commands for data persistence.
code
SQL
BACKUP "snapshot_v1";
RESTORE "snapshot_v1";
Note: If no filename is provided, the system uses default internal logic.
7. Literal Syntax
Strings: Enclosed in single (') or double (") quotes.
Numbers: Digits (e.g., 42, 3.14).
Booleans: TRUE, FALSE.
Null: NULL.
Comments:
Single line: -- comment or // comment
Multi-line: /* comment */