"""
Check saved summaries in database
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import Database

db = Database()
db.connect()

# Query latest articles with their summaries
cursor = db.cursor
cursor.execute("""
    SELECT id, title, summary, source, published_date
    FROM news.articles
    ORDER BY id DESC
    LIMIT 5
""")

rows = cursor.fetchall()

print("\n" + "=" * 80)
print("LATEST 5 ARTICLES WITH SUMMARIES")
print("=" * 80)

for row in rows:
    print(f"\nID: {row['id']}")
    print(f"Source: {row['source']}")
    print(f"Date: {row['published_date']}")
    try:
        print(f"Title: {row['title'][:70]}...")
    except:
        print(f"Title: [Azerbaijani characters]")

    if row['summary']:
        try:
            print(f"Summary: {row['summary']}")
        except:
            print(f"Summary: [Azerbaijani text - {len(row['summary'])} chars]")
    else:
        print(f"Summary: NULL (Gemini model issue)")
    print("-" * 80)

# Count articles with summaries
cursor.execute("SELECT COUNT(*) as total, COUNT(summary) as with_summary FROM news.articles")
stats = cursor.fetchone()
print(f"\nTotal articles: {stats['total']}")
print(f"With summaries: {stats['with_summary']}")
print(f"Without summaries: {stats['total'] - stats['with_summary']}")

db.close()
