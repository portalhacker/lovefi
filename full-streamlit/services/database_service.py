import sqlite3

connection = sqlite3.connect(database="lovefi.db")
print(connection.total_changes)
cursor = connection.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    country TEXT NOT NULL,
    state TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
""")

cursor.execute("""
INSERT INTO users (email, password, first_name, last_name, country, state) VALUES (?, ?, ?, ?, ?, ?)
""", ("test@test.com", "test", "test", "test", "test", "test"))

rows = cursor.execute("SELECT * FROM users").fetchall()
print(rows)


# connection.commit()
# connection.close()