import 'dotenv/config';

const { NODE_ENV, PORT } = process.env;

let apiBaseUrl: string;

if (NODE_ENV === 'DEV') {
  apiBaseUrl = `http://localhost:${PORT}`;
} else {
  apiBaseUrl = 'https://myfavs-api.onrender.com';
}

export default apiBaseUrl;
