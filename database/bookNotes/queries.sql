CREATE TABLE book_note (
    id SERIAL PRIMARY KEY,
    book_name VARCHAR(100) NOT NULL,
    note VARCHAR(10000),
    note_auth_name VARCHAR(10000),
    note_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




INSERT INTO book_note (book_name, note, note_auth_name)
VALUES ('Robinzon Kruzo', 'Stupidest book i have ever know', 'Ismat Samadov');


INSERT INTO book_note (book_name, note, note_auth_name)
VALUES ('Think and Grow', 'coolest book', 'Ismat Samadov');