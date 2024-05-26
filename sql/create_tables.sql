CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    teacher_id INT REFERENCES teachers(id),
    title VARCHAR(100),
    description TEXT,
    due_date DATE,
    max_score INT
);

CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    assignment_id INT REFERENCES assignments(id),
    student_id INT REFERENCES students(id),
    submission_text TEXT,
    score INT,
    graded BOOLEAN DEFAULT FALSE
);
