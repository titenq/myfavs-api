const { NODE_ENV, PORT } = process.env;

let apiBaseUrl: string;

if (NODE_ENV === 'DEV') {
  apiBaseUrl = `http://localhost:${PORT}`;
} else {
  apiBaseUrl = 'https://backend.com';
}

export default apiBaseUrl;
