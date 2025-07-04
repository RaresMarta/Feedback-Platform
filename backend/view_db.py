import sqlite3

# Connect to the database
conn = sqlite3.connect('database.db')
conn.row_factory = sqlite3.Row 
cursor = conn.cursor() 

# Show tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print("Tables in the database:")
for table in tables:
    print(f"- {table[0]}")

# For each table, show content
for table in tables:
    table_name = table[0]
    print(f"\nContents of {table_name}:")
    cursor.execute(f"SELECT * FROM {table_name}")
    rows = cursor.fetchall()
    
    if rows:
        # Print column names
        print(" | ".join([description[0] for description in cursor.description]))
        print("-" * 50)
        
        # Print rows
        for row in rows:
            print(" | ".join([str(item) for item in row]))
    else:
        print("No data")

conn.close()