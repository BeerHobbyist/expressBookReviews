const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  const user = users.find((user) => user.username === username);
  if (user) {
    return false;
  }
  return true;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  if (user) {
    return true;
  }
  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Invalid input" });
  }
  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ password }, "access", {
      expiresIn: 60 * 60,
    });
    req.session.authorization = {
      accessToken: accessToken,
      username: username,
    };
    return res.status(200).json({ message: "Login successful" });
  } else {
    return res.status(400).json({ message: "Invalid credentials" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.query;
  if (!review) {
    return res.status(400).json({ message: "No review provided" });
  }

  const username =
    req.session.authorization && req.session.authorization.username;
  if (!username) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  const book = books[isbn];
  if (book) {
    if (book.reviews[username]) {
      book.reviews[username] = review;
      return res.json({ message: "Review updated successfully." });
    } else {
      book.reviews[username] = review;
      return res.json({ message: "Review added successfully." });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username =
    req.session.authorization && req.session.authorization.username;
  if (!username) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  const book = books[isbn];
  if (book) {
    if (book.reviews[username]) {
      delete book.reviews[username];
      return res.json({ message: "Review deleted successfully." });
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
