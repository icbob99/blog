const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
// app.use(bodyParser.json(0));

// app.use(bodyParser.urlencoded());
// app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = {
        id, title
    };

    await axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data: {
            id, title
        }
    })

    res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
    console.log('Event received:', req.body.type);

    res.send({});
});

app.listen(4000, () => {
    console.log('v20');
    console.log('listining on 4000');
});