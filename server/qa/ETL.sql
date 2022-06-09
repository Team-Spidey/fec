-- psql zach -h 127.0.0.1 -d qa -f ETL.sql

DROP TABLE IF EXISTS questions;
CREATE TABLE questions (
  question_id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  question_body VARCHAR(500) NULL DEFAULT NULL,
  question_date VARCHAR(50) NULL DEFAULT NULL,
  asker_name VARCHAR(100) NULL DEFAULT NULL,
  email VARCHAR(100),
  reported INT NULL DEFAULT NULL,
  question_helpfulness INTEGER NULL DEFAULT NULL
);

DROP TABLE IF EXISTS answers;
CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL,
  body VARCHAR(500) NULL DEFAULT NULL,
  date VARCHAR(50) NULL DEFAULT NULL,
  answerer_name VARCHAR(50) NULL DEFAULT NULL,
  answerer_email VARCHAR(50),
  reported INTEGER,
  helpfulness INTEGER NULL DEFAULT NULL
);

DROP TABLE IF EXISTS photos;
CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  answer_id INTEGER NOT NULL,
  url VARCHAR(500) NULL DEFAULT NULL
);

\COPY questions FROM '/Users/zacaharykessler/Downloads/questions.csv' DELIMITER ',' CSV HEADER;

\COPY answers FROM '/Users/zacaharykessler/Downloads/answers.csv' DELIMITER ',' CSV HEADER;

\COPY photos FROM '/Users/zacaharykessler/Downloads/answers_photos.csv' DELIMITER ',' CSV HEADER;

ALTER SEQUENCE questions_question_id_seq RESTART WITH (SELECT MAX(question_id) FROM questions);