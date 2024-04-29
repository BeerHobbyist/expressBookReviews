const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Invalid input" });
  }
  if (!isValid(username)) {
    return res.status(400).json({ message: "User already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User created. You can now log in!" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  const booksPromise = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("No books available");
    }
  });
  // Assuming that fetching books from the database takes some time otherwise it makes no sense to use promises
  booksPromise
    .then((books) => {
      res.json(books);
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const booksPromise = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });
  // Assuming that fetching books from the database takes some time otherwise it makes no sense to use promises
  booksPromise
    .then((book) => {
      res.json(book);
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const authorBooksPromise = new Promise((resolve, reject) => {
    let author_books = [];
    for (let book in books) {
      if (books[book].author === author) {
        author_books.push(books[book]);
      }
    }
    if (author_books.length) {
      resolve(author_books);
    } else {
      reject("Author not found");
    }
  });
  authorBooksPromise
    .then((author_books) => {
      res.json(author_books);
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;
  const titleBooksPromise = new Promise((resolve, reject) => {
    let title_books = [];
    for (let book in books) {
      if (books[book].title === title) {
        title_books.push(books[book]);
      }
    }
    if (title_books.length) {
      resolve(title_books);
    } else {
      reject("Title not found");
    }
  });
  titleBooksPromise
    .then((title_books) => {
      res.json(title_books);
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
