import 'dotenv/config';

const { NODE_ENV, ORIGIN } = process.env;

let siteOrigin: string;

if (NODE_ENV === 'DEV') {
  siteOrigin = 'http://localhost:5173';
} else {
  siteOrigin = ORIGIN || '';
}

export default siteOrigin;
