//require('dotenv').config({ path: './config.env' });
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

//connectDB();
const errorHandler = require('./middleware/error');

const app = express();
const PORT = 5000;

app.use(cors(
  {
    origin: "*",
    methods: ["POST", "GET"],
    credentials: true
  }
));
// app.options('*', cors());
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   next();
// });
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello');
});
app.use('/api/auth', require('./routes/auth'));
app.use('/api/private', require('./routes/private'));

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Logged Error ${err}`);
  server.close(() => process.exit(1));
});
