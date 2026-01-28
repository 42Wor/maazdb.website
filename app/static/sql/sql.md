# MaazDB v11.9.0 — Official Technical Documentation

**Version:** 11.9.0
**Default Port:** 8888
**Protocol:** TCP / Binary Length-Prefixed

---

## 1. Connection Protocol
MaazDB uses a custom binary protocol over TCP. Clients must implement the following packet structure to communicate with the server.

### Packet Structure
Every packet sent to or received from the server follows this byte layout:
1.  **Type (1 Byte):**
    *   `0x01`: **Command** (Client -> Server)
    *   `0x02`: **Response Message** (Server -> Client) - Used for success messages (e.g., "Rows affected: 1").
    *   `0x03`: **Response Data** (Server -> Client) - Used for `SELECT` results.
    *   `0xFF`: **Error** (Server -> Client) - Used for syntax errors or constraint violations.
2.  **Length (4 Bytes):** Unsigned 32-bit Integer (**Big-Endian**). Represents the length of the payload.
3.  **Payload (N Bytes):** The UTF-8 string (SQL query or Result data).

---

## 2. Authentication & Security
All sessions must be authenticated immediately after connection.

### Login
Authenticates the current session.
**Syntax:**
```sql
LOGIN <username> PASSWORD '<password>';
```
**Example:**
```sql
LOGIN admin PASSWORD 'admin';
```

### Create User
Registers a new user in the system.
**Syntax:**
```sql
CREATE USER <username> PASSWORD '<password>';
```
**Example:**
```sql
CREATE USER john PASSWORD 'secret123';
```

---

## 3. Database Management
MaazDB supports multi-tenancy via Databases.

### Create Database
**Syntax:**
```sql
CREATE DATABASE <db_name>;
```
**Example:**
```sql
CREATE DATABASE shop_db;
```

### Switch Database
Selects the active database for subsequent queries.
**Syntax:**
```sql
USE <db_name>;
```
**Example:**
```sql
USE shop_db;
```

### Show Databases
Lists all databases currently existing in the system.
**Syntax:**
```sql
SHOW DATABASES;
```

### Drop Database
Permanently deletes a database and all containing tables.
**Syntax:**
```sql
DROP DATABASE <db_name>;
```
**Example:**
```sql
DROP DATABASE shop_db;
```

---

## 4. Schema Definition (DDL)

### Supported Data Types
| Type | Description |
| :--- | :--- |
| `SERIAL` | Auto-incrementing Integer. **Must be used with PRIMARY KEY.** |
| `INT` | Standard Integer. |
| `DOUBLE` | Floating point number. |
| `TEXT` | UTF-8 String. |
| `BOOL` | Boolean (`TRUE` / `FALSE`). |
| `TIMESTAMP` | Date string in format `'YYYY-MM-DD HH:MM:SS'`. |
| `UUID` | Universally Unique Identifier string. |

### Create Table
Defines a new table structure.
**Syntax:**
```sql
CREATE TABLE <table_name> (
    <col_name> <type> [PRIMARY KEY],
    <col_name> <type>,
    ...
);
```
**Example:**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT,
    age INT,
    salary DOUBLE,
    active BOOL,
    created TIMESTAMP,
    uuid UUID
);
```

### Foreign Keys
Enforces referential integrity. The target column in the parent table must exist.
**Syntax:**
```sql
CREATE TABLE <table_name> (
    ...
    FOREIGN KEY (<local_col>) REFERENCES <parent_table>(<parent_col>)
);
```
**Example:**
```sql
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT,
    amount DOUBLE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Table Maintenance
*   **Show Tables:** Lists tables in the current database.
    ```sql
    SHOW TABLES;
    ```
*   **Describe Table:** Shows column definitions.
    ```sql
    DESCRIBE <table_name>;
    ```
*   **Drop Table:** Deletes a table.
    ```sql
    DROP TABLE <table_name>;
    ```

---

## 5. Data Manipulation (DML)

### Insert
Adds new rows. **Note:** Do not include `SERIAL` columns in the column list; they are generated automatically.
**Syntax:**
```sql
INSERT INTO <table_name> (<col1>, <col2>) VALUES (<val1>, <val2>);
```
**Example:**
```sql
INSERT INTO users (name, age, active) VALUES ('Alice', 30, TRUE);
```

### Update
Modifies existing data based on a condition.
**Syntax:**
```sql
UPDATE <table_name> SET <col> = <val> WHERE <condition>;
```
**Example:**
```sql
UPDATE users SET salary = 55000.00 WHERE name = 'Alice';
```

### Delete
Removes rows based on a condition.
**Syntax:**
```sql
DELETE FROM <table_name> WHERE <condition>;
```
**Example:**
```sql
DELETE FROM users WHERE name = 'Charlie';
```

---

## 6. Querying (SELECT)

### Basic Select
**Syntax:**
```sql
SELECT * FROM <table_name>;
SELECT <col1>, <col2> FROM <table_name>;
```

### Filtering (WHERE)
Supports comparison operators (`=`, `>`, `<`), logical operators (`AND`, `OR`), and Null checks.
**Examples:**
```sql
-- Equality
SELECT * FROM users WHERE name = 'Alice';

-- Range
SELECT * FROM users WHERE age > 25;

-- Logical AND
SELECT * FROM users WHERE age > 25 AND active = TRUE;

-- Logical OR with Grouping
SELECT * FROM users WHERE (age > 20 AND active = TRUE) OR salary > 50000;

-- Null Checks
SELECT * FROM users WHERE uuid IS NULL;
SELECT * FROM users WHERE uuid IS NOT NULL;
```

### Smart Select (Optimization)
If a query filters by the **Primary Key** (e.g., `WHERE id = 1`), MaazDB uses an $O(1)$ lookup instead of scanning the table.
```sql
SELECT * FROM users WHERE id = 1;
```

### Sorting & Pagination
**Syntax:**
```sql
SELECT ... ORDER BY <col> [ASC|DESC] LIMIT <num> OFFSET <num>;
```
**Example:**
```sql
SELECT name, age FROM users ORDER BY age DESC LIMIT 2 OFFSET 1;
```

### Expressions & Aggregates
**Examples:**
```sql
-- Count total rows
SELECT COUNT(*) FROM users;

-- Evaluate expressions
SELECT 1 + 1, 'Hello', TRUE;
```

---

## 7. Disaster Recovery (Backup & Restore)

MaazDB includes a snapshot engine to save and recover the entire state of the database.

### Create Backup
Creates a named snapshot of the *current* database state.
**Syntax:**
```sql
BACKUP '<snapshot_name>';
```
**Example:**
```sql
BACKUP 'snapshot_v1';
```

### Show Backups
Lists all available snapshots stored in the system with their metadata.
**Syntax:**
```sql
SHOW BACKUPS;
```

### Restore Database
Reverts the database to the exact state of the specified snapshot.
**Warning:** This overwrites current data.
**Syntax:**
```sql
RESTORE '<snapshot_name>';
```
**Example:**
```sql
RESTORE 'snapshot_v1';
```

## 8. Literal Syntax

MaazDB supports standard SQL literal formats for values and comments.

### Strings
Strings can be enclosed in either single (`'`) or double (`"`) quotes.
```sql
'Hello World'
"MaazDB"
```

### Numbers
Standard numeric digits for Integers and Floating points.
```sql
42
3.14
-100
```

### Booleans
Boolean literals are case-insensitive.
```sql
TRUE
FALSE
```

### Null
Represents missing or undefined data.
```sql
NULL
```

### Comments
MaazDB supports three styles of comments:

**Single Line:**
```sql
-- This is a comment
SELECT * FROM users; // This is also a comment
```

**Multi-line:**
```sql
/* 
   This is a multi-line
   comment block 
*/
SELECT * FROM users;
```

---
