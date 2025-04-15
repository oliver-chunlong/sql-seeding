const db = require("../connection");
const format = require("pg-format");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS topics, users, articles, comments CASCADE`)
    .then(() => {
      return db.query(
        `CREATE TABLE topics(slug VARCHAR(50) PRIMARY KEY, description VARCHAR(250), img_url VARCHAR(1000))`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE users(username VARCHAR(30) PRIMARY KEY, name VARCHAR(50), avatar_url VARCHAR(1000))`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE articles(article_id SERIAL PRIMARY KEY, title VARCHAR(250), topic VARCHAR(50) REFERENCES topics(slug), author VARCHAR(50) REFERENCES users(username), body TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, votes INT DEFAULT 0, article_img_url VARCHAR(1000))`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE comments(comment_id SERIAL PRIMARY KEY, article_id INT REFERENCES articles(article_id), body TEXT, votes INT DEFAULT 0, author VARCHAR(50) REFERENCES users(username), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`
      );
    })
    .then(() => {
      const formattedTopics = topicData.map((topic) => {
        return [topic.description, topic.slug, topic.img_url];
      });
      const insertTopicsQuery = format(
        `INSERT INTO topics(slug, description, img_url) VALUES %L`,
        formattedTopics
      );
      return db.query(insertTopicsQuery);
    })
    .then(() => {
      const formattedUsers = userData.map((user) => {
        return [user.username, user.name, user.avatar_url];
      });
      const insertUsersQuery = format(
        `INSERT INTO users(username, name, avatar_url) VALUES %L`,
        formattedUsers
      );
      return db.query(insertUsersQuery);
    })
    .then(() => {
      const formattedArticles = articleData.map((article) => {
        return [
          article.article_id,
          article.title,
          article.topic,
          article.author,
          article.body,
          article.created_at,
          article.votes,
          article.article_img_url,
        ];
      });
      const insertArticlesQuery = format(
        `INSERT INTO articles(article_id, title, topic, author, body, created_at, votes, article_img_url) VALUES %L`,
        formattedArticles
      );
      return db.query(insertArticlesQuery);
    });
};

module.exports = seed;
