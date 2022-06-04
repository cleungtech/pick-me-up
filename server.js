import express from 'express';
import bodyParser from 'body-parser';
import api from './api/app.js';

const app = express();
app.enable('trust proxy');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;

app.use('/api', api);

app.all('*', (req, res) => {
  res.status(404).send('Not Found');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
  console.log('Press Ctrl+C to quit.');
})