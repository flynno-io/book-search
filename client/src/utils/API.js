// make a search to google books api
// https://www.googleapis.com/books/v1/volumes?q=harry+potter&key=yourAPIKey

export const searchGoogleBooks = (query) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};
