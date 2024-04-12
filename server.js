import express from 'express';
import xss from 'xss';

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Handle GET request to fetch users
app.get('/users', async (req, res) => {
  setTimeout(async () => {
    const limit = +req.query.limit || 10;

    const response = await fetch(`https://jsonplaceholder.typicode.com/users?_limit=${limit}`);
    const users = await response.json();

    res.send(`
    <h1 class="text-2xl font-bold my-4">Users</h1>
    <ul>
      ${users.map(user => `<li>${(user.name)}</li>`).join('')}
    </ul>
  `);
  }, 2000);
});

// Handle POST request for temp conversion
app.post('/convert', (req, res) => {
  setTimeout(() => {
    const fahrenheit = parseFloat(req.body.fahrenheit);
    const celsius = (fahrenheit - 32) * 5 / 9;

    res.send(`
    <p>${fahrenheit} degrees Fahrenheit is equal to ${celsius} degrees Celsius</p>
  `);
  }, 2000);
});

// Handle GET request for polling
let counter = 0;
app.get('/poll', (req, res) => {
  counter++;
  const data = {value: counter};
  res.json(data);
});

// Handle GET request for weather
let currentTemperature = 20;
app.get('/get-temperature', (req, res) => {
  currentTemperature += Math.random() * 2 - 1;
  res.send(currentTemperature.toFixed(1) + '°C');
});

// Handle POST request for contacts search
const contacts = [{email: 'johndoe@example.com', name: 'John Doe'},
  {name: 'Ann Doe', email: 'anndoe@example.com'},
  {name: 'Jane Doe', email: 'janedoe@example.com'},
  {name: 'alice Doe', email: 'alicedoe@example.com'},
  {name: 'Maria Doe', email: 'mariadoe@example.com'},
  {name: 'igor Doe', email: 'igordoe@example.com'},
  {name: 'peter Doe', email: 'peterdoe@example.com'}];
app.post('/search', (req, res) => {
  const searchTerm = req.body.search.toLowerCase();

  if (!searchTerm) {
    return res.send('No search term provided');
  }

  const searchResults = contacts.filter(contact => {
    const name = contact.name.toLowerCase();
    const email = contact.email.toLowerCase();

    return (name.includes(searchTerm) || email.includes(searchTerm));
  });

  setTimeout(() => {
    const searchResultsHtml = searchResults.map(contact => `
      <tr>
      <td><div class="my-4 p-2"><a href="#">${contact.name}</a></div></td>
      <td><div class="my-4 p-2"><a href="#">${contact.email}</a></div></td>
      </tr>
    `).join('');

    res.send(searchResultsHtml);
  }, 1000);
});

// Handle POST request for contacts search from jsonplaceholder
app.post('/search/api',async (req, res) => {
  const searchTerm = req.body.search.toLowerCase();

  if (!searchTerm) {
    return res.send('No search term provided');
  }

  const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
  const contacts = await response.json();

  const searchResults = contacts.filter(contact => {
    const name = contact.name.toLowerCase();
    const email = contact.email.toLowerCase();

    return (name.includes(searchTerm) || email.includes(searchTerm));
  });

  setTimeout(() => {
    const searchResultsHtml = searchResults.map(contact => `
      <tr>
      <td><div class="my-4 p-2"><a href="#">${contact.name}</a></div></td>
      <td><div class="my-4 p-2"><a href="#">${contact.email}</a></div></td>
      </tr>
    `).join('');

    res.send(searchResultsHtml);
  }, 1000);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
