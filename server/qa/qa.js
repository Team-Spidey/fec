require('dotenv').config();
const express = require('express');
const { Sequelize } = require('sequelize');

const app = express();
const sequelize = new Sequelize(process.env.pgurl);

app.use(express.json());

const test = async () => {
  try {
    const [question, meta] = await sequelize.query(`SELECT * FROM questions WHERE product_id=${1} AND reported=0`);
    const [answers, metadata] = await sequelize.query(`SELECT * FROM answers WHERE question_id=${question.question_id} AND reported=0`);
    const [data, asdf] = await sequelize.query('SELECT * FROM photos INNER JOIN answers ON photos.answer_id=answers.id WHERE question_id=1');
    data.forEach((photo) => {
      for (let i = 0; i < answers.length; i++) {
        if (answers[i].id === photo.answer_id) {
          if (answers[i].photos) {
            answers[i].photos.push(photo.url);
          } else {
            answers[i].photos = [photo.url];
          }
        }
      }
    });
    console.log(answers);
  } catch (err) {
    console.log('fail', err);
  }
};
test();

app.get('/qa/questions', async (req, res) => {
  const { product_id, page, count } = req.params;
  const [question, meta] = await sequelize.query(`SELECT * FROM questions WHERE product_id=${product_id} AND reported=0`);
  const [answers, metadata] = await sequelize.query(`SELECT * FROM answers WHERE question_id=${question.question_id} AND reported=0`);
  const [photos, asd] = await sequelize.query('SELECT * FROM photos INNER JOIN answers ON photos.answer_id=answers.id WHERE question_id=1');
  photos.forEach((photo) => {
    for (let i = 0; i < answers.length; i++) {
      if (answers[i].id === photo.answer_id) {
        if (answers[i].photos) {
          answers[i].photos.push(photo.url);
        } else {
          answers[i].photos = [photo.url];
        }
      }
    }
  });
  question.answers = {};
});
// TODO GET /qa/questions params(*product_id, page=1, count=5)
// {
//   "product_id": "5",
//   "results": [{
//         "question_id": 37,
//         "question_body": "Why is this product cheaper here than other sites?",
//         "question_date": "2018-10-18T00:00:00.000Z",
//         "asker_name": "williamsmith",
//         "question_helpfulness": 4,
//         "reported": false,
//         "answers": {
//           68: {
//             "id": 68,
//             "body": "We are selling it here without any markup from the middleman!",
//             "date": "2018-08-18T00:00:00.000Z",
//             "answerer_name": "Seller",
//             "helpfulness": 4,
//             "photos": []
//             // ...
//           }
//         }
//       },
//       {
//         "question_id": 38,
//         "question_body": "How long does it last?",
//         "question_date": "2019-06-28T00:00:00.000Z",
//         "asker_name": "funnygirl",
//         "question_helpfulness": 2,
//         "reported": false,
//         "answers": {
//           70: {
//             "id": 70,
//             "body": "Some of the seams started splitting the first time I wore it!",
//             "date": "2019-11-28T00:00:00.000Z",
//             "answerer_name": "sillyguy",
//             "helpfulness": 6,
//             "photos": [],
//           },
//           78: {
//             "id": 78,
//             "body": "9 lives",
//             "date": "2019-11-12T00:00:00.000Z",
//             "answerer_name": "iluvdogz",
//             "helpfulness": 31,
//             "photos": [],
//           }
//         }
//       },
//       // ...
//   ]
// }

// TODO GET /qa/questions/:question_id/answers params(*question_id) queryparams(page=1, count=5)

// TODO POST /qa/questions params(body, name, email, product_id)

// TODO POST/qa/questions/:question_id/answers param(question_id) body(body, name, email, photos)

// TODO PUT /qa/questions/:question_id/helpful param(question_id)

// TODO PUT /qa/questions/:question_id/report param(question_id)

// TODO PUT /qa/answers/:answer_id/helpful param(answer_id)

// TODO PUT /qa/answers/:answer_id/report param(answer_id)

// CREATE TABLE questions (
//   question_id INTEGER NOT NULL,
//   product_id INTEGER NOT NULL,
//   question_body VARCHAR(500) NULL DEFAULT NULL,
//   question_date VARCHAR(50) NULL DEFAULT NULL,
//   asker_name VARCHAR(100) NULL DEFAULT NULL,
//   email VARCHAR(100),
//   reported INT NULL DEFAULT NULL,
//   question_helpfulness INTEGER NULL DEFAULT NULL,
//   PRIMARY KEY (question_id)
// );

// CREATE TABLE answers (
//   id INTEGER NOT NULL,
//   question_id INTEGER NOT NULL,
//   body VARCHAR(500) NULL DEFAULT NULL,
//   date VARCHAR(50) NULL DEFAULT NULL,
//   answerer_name VARCHAR(50) NULL DEFAULT NULL,
//   answerer_email VARCHAR(50),
//   reported INTEGER,
//   helpfulness INTEGER NULL DEFAULT NULL,
//   PRIMARY KEY (id)
// );

// CREATE TABLE photos (
//   id INTEGER NOT NULL,
//   answer_id INTEGER NOT NULL,
//   url VARCHAR(500) NULL DEFAULT NULL,
//   PRIMARY KEY (id)
// );

// \COPY questions FROM '/Users/zacaharykessler/Downloads/questions.csv' DELIMITER ',' CSV HEADER;

// \COPY answers FROM '/Users/zacaharykessler/Downloads/answers.csv' DELIMITER ',' CSV HEADER;

// \COPY photos FROM '/Users/zacaharykessler/Downloads/answers_photos.csv' DELIMITER ',' CSV HEADER;

// -- ---
// -- Table 'Questions'
// --
// -- ---

// DROP TABLE IF EXISTS `Questions`;

// CREATE TABLE `Questions` (
//   `product_id` INTEGER NOT NULL,
//   `question_id` INTEGER NOT NULL AUTO_INCREMENT,
//   `question_body` VARCHAR(500) NULL DEFAULT NULL,
//   `question_date` DATE NULL DEFAULT NULL,
//   `asker_name` VARCHAR(100) NULL DEFAULT NULL,
//   `question_helpfulness` INTEGER NULL DEFAULT NULL,
//   `reported` INT NULL DEFAULT NULL,
//   PRIMARY KEY (`question_id`)
// );

// -- ---
// -- Table 'answers'
// --
// -- ---

// DROP TABLE IF EXISTS `answers`;

// CREATE TABLE `answers` (
//   `id` INTEGER NOT NULL AUTO_INCREMENT,
//   `question` INTEGER NOT NULL,
//   `body` VARCHAR(500) NULL DEFAULT NULL,
//   `date` DATE NULL DEFAULT NULL,
//   `answerer_name` VARCHAR(50) NULL DEFAULT NULL,
//   `helpfulness` INTEGER NULL DEFAULT NULL,
//   `photos` VARCHAR(500) NULL DEFAULT NULL,
//   PRIMARY KEY (`id`)
// );

// -- ---
// -- Table 'answers_photos'
// --
// -- ---

// DROP TABLE IF EXISTS `answers_photos`;

// CREATE TABLE `answers_photos` (
//   `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
//   `Url` VARCHAR(50) NULL DEFAULT NULL,
//   PRIMARY KEY (`id`)
// );

// -- ---
// -- Foreign Keys
// -- ---

// ALTER TABLE `answers` ADD FOREIGN KEY (question) REFERENCES `Questions` (`question_id`);
// ALTER TABLE `answers` ADD FOREIGN KEY (photos) REFERENCES `answers_photos` (`id`);

// -- ---
// -- Table Properties
// -- ---

// -- ALTER TABLE `Questions` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
// -- ALTER TABLE `answers` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
// -- ALTER TABLE `answers_photos` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
