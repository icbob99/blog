const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
// app.use(cors());

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events',async (req, res) => {
    const { type, data } = req.body;
    console.log('Event received:', req.body.type);

    if (type === 'CommentCreated') {
        const { content   } = data;
        const status = content.includes('orange') ? 'rejected' : 'approved';

        await axios.post('http://localhost:4005/events',
            {
                type: 'CommentModerated',
                data: {
                    id: data.id,
                    postId: data.postId,
                    status,
                    content
                }
            }).catch((err) => {
            console.log(err.message);
        });
    }

    res.send({});
});

app.listen(4003, () => {
    console.log('listining on 4003');
});