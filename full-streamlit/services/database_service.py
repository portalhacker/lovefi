from sqlite3 import connect as sqlite_connect
from datetime import datetime

class DatabaseService:
    def __init__(self):
        self.connection = sqlite_connect(database="lovefi.db")
        self.cursor = self.connection.cursor()

    def create_tables(self):
        self.cursor.execute("""
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
    
    def insert_user(self, user):
        self.cursor.execute("""
            INSERT INTO users (email, password, first_name, last_name, country, state) VALUES (?, ?, ?, ?, ?, ?)
        """, (user["email"], user["password"], user["first_name"], user["last_name"], user["country"], user["state"]))

    def get_all_users(self):
        rows = self.cursor.execute("SELECT * FROM users").fetchall()
        return rows

