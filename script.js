let books = [];
let bookStat = {'Pages':0, 'Books': 0}

function Book(title, author, image, year, pages, isbn) {
  this.title = title;
  this.author = author;
  this.image = image;
  this.year = year;
  this.pages = pages;
  this.isbn = isbn;
}

document.getElementById('search-button').addEventListener('click', loadData);

function loadData() {
    // load data from google book api searching with 'search-field' text
    const searchInput = document.getElementById("search-field").value;
    
    fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${searchInput}`)
      .then((response) => response.json())
      .then((data) => {
        // gather required data
        if(data.items == null) {
          alert("No book found!");
          return;
        }
        pages = data.items[0].volumeInfo.pageCount == 0 ? 'unknown' : data.items[0].volumeInfo.pageCount;
        let book = new Book(
          data.items[0].volumeInfo.title,
          data.items[0].volumeInfo.authors[0],
          data.items[0].volumeInfo.imageLinks.thumbnail,
          data.items[0].volumeInfo.publishedDate.substring(0, 4),
          `${pages} p.`,
          data.items[0].volumeInfo.industryIdentifiers[0].identifier
        );
        //check if book is already in array
        if (
          books.some(
            (book) =>
              book.isbn ===
              data.items[0].volumeInfo.industryIdentifiers[0].identifier
          )
        ) {
          alert("This book is already in the list!");
          return;
        }
        // add the book to the books array
        books.push(book);

        // if books is not empty, remove the 'no books' dialog #no-books
        if (books.length > 0) {
          document.getElementById("no-books").style.display = "none";
        }

        // create card
        createCard(book);

        document.getElementById('search-field').value = '';
      });
}

function toggleReadBook() {
  // get the books page #
    let pages = this.parentElement.querySelector(".pages").textContent;
    if(pages == 'unknown p.') {
      pages = 0;
    }

console.log(pages);

  // check if the book has attribute read="False" or 'True'
  let curr_read = this.getAttribute('read') === "True";
    if (curr_read) {
      this.setAttribute('read', "False");
      // update overall counters #pg-output and #bk-output
      bookStat.Pages -= parseInt(pages);
      bookStat.Books -= 1;
    } else {
      this.setAttribute('read', "True");
      // update overall counters #pg-output and #bk-output
      bookStat.Pages += parseInt(pages);
      bookStat.Books += 1;
    }

  // update visual
  document.getElementById("pg-output").textContent = bookStat.Pages;
  document.getElementById("bk-output").textContent = bookStat.Books;
}

function createCard(book) {
  // Create the elements
  let card = document.createElement("div");
  let img = document.createElement("img");
  let cardInfo = document.createElement("div");
  let title = document.createElement("span");
  let cardDetails = document.createElement("div");
  let author = document.createElement("span");
  let year = document.createElement("span");
  let cardBottom = document.createElement("div");
  let readIndicator = document.createElement("div");
  let cardBottomRight = document.createElement("div");
  let pages = document.createElement("span");
  let isbn = document.createElement("span");

  // Add the appropriate classes and attributes
  card.classList.add("card");
  img.src = book.image;
  cardInfo.classList.add("card-info");
  cardDetails.classList.add("card-details");
  title.classList.add("title");
  author.classList.add("author");
  year.classList.add("year");
  cardBottom.classList.add("card-bottom");
  readIndicator.id = "read-indicator";
  readIndicator.setAttribute('read', "False");
  cardBottomRight.classList.add("card-bottom-right");
  pages.classList.add("pages");
  isbn.classList.add("isbn");

  // Add the content
  title.textContent = book.title;
  author.textContent = book.author;
  year.textContent = book.year;
  pages.textContent = `${book.pages}`;
  isbn.textContent = book.isbn;

  // Assemble the card
  cardDetails.append(author, year);
  cardBottomRight.append(pages, isbn);
  cardBottom.append(readIndicator, cardBottomRight);
  cardInfo.append(title, cardDetails, cardBottom);
  card.append(img, cardInfo);

  // Add the card to the page
  document.getElementById("cards").append(card);

  // add event listener to the read-indicator
    readIndicator.addEventListener('click', toggleReadBook);
}