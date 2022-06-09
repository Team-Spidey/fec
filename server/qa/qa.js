require('dotenv').config();
const express = require('express');
const { Sequelize } = require('sequelize');

const app = express();
const sequelize = new Sequelize(process.env.pgurl);

app.use(express.json());

const test = async () => {
  try {
    await sequelize.query(`INSERT INTO questions (product_id, question_body, question_date, asker_name, email, reported, question_helpfulness) VALUES (1, '${'test'}', 0, '${'name'}', '${'email'}', 0, 0)`);
    const [data, meta] = await sequelize.query(`SELECT * FROM questions WHERE product_id=${1} AND reported=0`);
    console.log(data);
  } catch (err) {
    console.log('fail', err);
  }
};
test();

app.get('/qa/questions', async (req, res) => {
  // TODO format data and date better
  try {
    const { product_id, page, count } = req.params;
    const [questions, meta] = await sequelize.query(`SELECT * FROM questions WHERE product_id=${product_id} AND reported=0`);
    const getAnswer = async (j) => {
      const [answers, metadata] = await sequelize.query(`SELECT * FROM answers WHERE question_id=${questions[j].question_id} AND reported=0`);
      const [data, asdf] = await sequelize.query('SELECT * FROM photos INNER JOIN answers ON photos.answer_id=answers.id WHERE question_id=1');
      data.forEach((photo) => {
        for (let i = 0; i < answers.length; i += 1) {
          if (answers[i].id === photo.answer_id) {
            if (answers[i].photos) {
              answers[i].photos.push(photo.url);
            } else {
              answers[i].photos = [photo.url];
            }
          }
        }
      });
      questions[j].answers = {};
      answers.forEach((answer) => {
        questions[j].answers[answer.id] = answer;
      });
    };
    const arr = [...Array(questions.length)].map((_, index) => getAnswer(index));
    await Promise.all(arr);
    const result = { product_id, results: questions };
    res.status(200).send(result);
  } catch (err) {
    res.status(404).send(err);
  }
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
app.get('/qa/questions', async (req, res) => {
  try {
    let result;
    let { question_id, page, count } = req.params;
    const [answers, metadata] = await sequelize.query(`SELECT * FROM answers WHERE question_id=${question_id} AND reported=0`);
    const [photos, asdf] = await sequelize.query('SELECT * FROM photos INNER JOIN answers ON photos.answer_id=answers.id WHERE question_id=1');
    photos.forEach((photo) => {
      for (let i = 0; i < answers.length; i += 1) {
        if (answers[i].id === photo.answer_id) {
          if (answers[i].photos) {
            answers[i].photos.push(photo.url);
          } else {
            answers[i].photos = [photo.url];
          }
        }
      }
    });
    if (!count) {
      count = 5;
    }
    if (!page) {
      result = answers.slice(0, count - 1);
    } else {
      result = answers.slice((page - 1) * count, (count * page) - 1);
    }
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

// TODO POST /qa/questions params(body, name, email, product_id)
app.post('/qa/questions', async (req, res) => {
  const {
    body, name, email, product_id,
  } = req.body;
  await sequelize.query(`INSERT INTO questions (product_id, question_body, question_date, asker_name, email, reported, question_helpfulness) VALUES (${product_id}, '${body}', 0, '${name}', '${email}', 0, 0)`);
});

// TODO POST/qa/questions/:question_id/answers param(question_id) body(body, name, email, photos)

// TODO PUT /qa/questions/:question_id/helpful param(question_id)

// TODO PUT /qa/questions/:question_id/report param(question_id)

// TODO PUT /qa/answers/:answer_id/helpful param(answer_id)

// TODO PUT /qa/answers/:answer_id/report param(answer_id)

// ALTER TABLE `answers` ADD FOREIGN KEY (question) REFERENCES `Questions` (`question_id`);
// ALTER TABLE `answers` ADD FOREIGN KEY (photos) REFERENCES `answers_photos` (`id`);
