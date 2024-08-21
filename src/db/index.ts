import mongoose from 'mongoose';

const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;

const connectionString = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', true);

mongoose.connect(connectionString, { autoIndex: true });

mongoose.Promise = global.Promise;

export default mongoose;
