# MaazDB v11.6 - Official User Guide

**MaazDB v11.6** is an ultra-high-performance, columnar, disk-based relational database engine written in Rust. It utilizes **LSM Trees (Log-Structured Merge-Trees)** for fast writes, **Columnar Storage** for analytical reads, and **XOR Encryption** for data security.

## 1. Installation & Configuration

### Configuration File (`maazdb.toml`)
MaazDB v11.6 requires a configuration file to set the port and data directory.
*   **Linux:** `/etc/maazdb/maazdb.toml`
*   **Windows:** Installation Directory (e.g., `C:\Program Files\MaazDB\maazdb.toml`)

```toml
[server]
host = "0.0.0.0"
port = 8888

[storage]
data_dir = "data"  # Linux: /var/lib/maazdb
```

---

## 2. Authentication & System Commands

You cannot run queries without logging in.

### LOGIN
**Must be the first command.**
*   **Default Credentials:** `admin` / `admin`

```sql
LOGIN admin admin;
```

### User Management
```sql
-- Create a new user
CREATE USER maazwaheed WITH PASSWORD 'secure123';

-- Delete a user
DROP USER maazwaheed;
```

### Database Management
MaazDB supports multi-tenancy. You must create and select a database before storing data.

```sql
-- Create a new database environment
CREATE DATABASE company_db;

-- Switch to this database (REQUIRED before creating tables)
USE company_db;

-- Delete a database and all its files permanently
DROP DATABASE company_db;
```

### Backup
Creates a hot backup of the *currently selected* database.

```sql
-- Creates a folder named 'company_db_backup_snapshot1'
BACKUP snapshot1;
```

---

## 3. Data Types

MaazDB v11.6 enforces **Strict Typing**.

| Type | Description | Internal Storage |
| :--- | :--- | :--- |
| `SERIAL` | Auto-incrementing Integer (Primary Key). | 32-bit Integer |
| `INT` | Standard Integer. | 32-bit Integer |
| `FLOAT` | Single precision floating point. | 32-bit Float |
| `DOUBLE` | Double precision floating point. | 64-bit Float |
| `BOOL` | Boolean (`true` / `false`). | 1 Byte |
| `TEXT` | Variable length string. | UTF-8 Bytes |
| `TIMESTAMP`| Date and Time. | ISO 8601 String |
| `UUID` | Unique Identifier. | 128-bit UUID String |

---

## 4. Data Definition Language (DDL)

### CREATE TABLE
Defines schema. MaazDB creates separate binary files for each column (`.bin`).

**Syntax:**
```sql
CREATE TABLE <name> ( <col> <type> [PRIMARY], ... );
```

**Example:**
```sql
CREATE TABLE employees (
    id SERIAL PRIMARY,
    name TEXT,
    salary DOUBLE,
    joined_at TIMESTAMP
);
```

### DROP TABLE
Deletes the table schema and physically removes the underlying `.bin` files.

```sql
DROP TABLE employees;
```

---

## 5. Data Manipulation Language (DML)

### INSERT
Supports explicit values or auto-generation.

**A. Explicit Insert:**
```sql
INSERT INTO employees (name, salary, joined_at) 
VALUES ('Maaz', 5000.50, '2025-01-01 12:00:00');
```

**B. Auto-Defaults:**
If you omit columns like `SERIAL`, `TIMESTAMP`, or `UUID`, MaazDB automatically generates them.
```sql
-- 'id' generates automatically
-- 'joined_at' generates current server time
INSERT INTO employees (name, salary) VALUES ('Alice', 7000.0);
```

### SELECT
Retrieves data. Uses **Secondary Indices** automatically if a `WHERE` clause matches an indexed column.

**Syntax:**
```sql
SELECT <table_name>
[WHERE <col> <op> <val> [AND ...]]
[ORDER BY <col> [ASC|DESC]]
[LIMIT <n>];
```

**Supported Operators:** `=`, `!=`, `>`, `<`, `IS NULL`, `IS NOT NULL`.

**Examples:**
```sql
-- Simple Select
SELECT employees;

-- Filter with AND
SELECT employees WHERE salary > 5000 AND name != 'Bob';

-- Null Checks
SELECT employees WHERE joined_at IS NOT NULL;

-- Sorting and Limits
SELECT employees ORDER BY salary DESC LIMIT 5;
```

### UPDATE
Modifies data. This triggers a rewrite of the specific column file.

```sql
UPDATE employees SET salary = 8000.0 WHERE name = 'Maaz';
```

### DELETE
Removes rows and rebuilds the Primary Index.

```sql
DELETE FROM employees WHERE id = 5;
```

---

## 6. CLI Commands (Client Side)

The `maazdb-cli` supports special client-side commands.

### SOURCE
Executes a SQL script file line-by-line. Useful for restoring backups or initializing schemas.

```sql
-- Windows
SOURCE 'C:\scripts\setup.sql';

-- Linux
SOURCE '/home/user/setup.sql';
```

### EXIT
Closes the connection.
```sql
exit
```

---

## 7. Architecture Overview (v11.6 Technicals)

1.  **WAL (Write Ahead Log):** All `INSERT` operations are immediately appended to `wal.log` before processing. If the server crashes, it replays this log on restart to ensure **Zero Data Loss**.
2.  **MemTable (LSM Tree):** Recent data sits in RAM for ultra-fast access.
3.  **Auto-Flush:** When RAM usage hits **5MB**, data is flushed to disk.
4.  **Columnar Storage:** Data is stored in `col_name.bin` files. This makes analytical queries (e.g., `SELECT ... WHERE salary > X`) extremely fast because the engine only reads the specific columns needed, not the whole row.
5.  **XOR Encryption:** All binary files on disk are XOR-encrypted for basic security.

---

## 8. Example Session

```sql
-- 1. Login
LOGIN admin admin;

-- 2. Setup
CREATE DATABASE store;
USE store;

-- 3. Schema
CREATE TABLE products (
    pid SERIAL PRIMARY,
    title TEXT,
    price DOUBLE,
    stock INT
);

-- 4. Data Entry
INSERT INTO products (title, price, stock) VALUES ('Laptop', 999.99, 10);
INSERT INTO products (title, price, stock) VALUES ('Mouse', 25.50, 100);

-- 5. Query
SELECT products WHERE price > 50.0 ORDER BY stock DESC;
```