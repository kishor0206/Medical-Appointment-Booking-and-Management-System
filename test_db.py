import psycopg2

try:
    conn = psycopg2.connect(
        host="localhost",
        port="5432",
        database="medical_ai",
        user="postgres",
        password="kishor0206"
    )

    print("✅ Connected to PostgreSQL")

    cur = conn.cursor()

    cur.execute("SELECT * FROM patients")

    rows = cur.fetchall()

    print("\nPatients:")
    for row in rows:
        print(row)

    cur.close()
    conn.close()

except Exception as e:
    print("❌ Error:", e)