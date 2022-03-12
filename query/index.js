const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/posts', (req, res) => {
    res.send(posts);
});

const posts = {};

app.post('/events', (req, res) => {
    const { type, data } = req.body;
    console.log('Event received:', req.body.type);

    handleEvent(type, data);

    res.send({});
});

app.listen(4002, async () => {
    console.log('listining on 4002');

    try {
        const res = await axios.get("http://localhost:4005/events");

        for (let event of res.data) {
            console.log("Processing event:", event.type);

            handleEvent(event.type, event.data);
        }
    } catch (error) {
        console.log(error.message);
    }
});


const handleEvent = (type, data) => {
    
    if (type === 'PostCreated') {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
        console.log(`post => ${JSON.stringify(posts, null, ' ')}`);
    }

    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;

        console.log(`id => ${id}, content=> ${content}, postId=>${postId}`);

        const post = posts[postId];
        post.comments.push({ id, content, status });
        console.log(`post => ${JSON.stringify(post, null, ' ')}`);
    }

    if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data;

        console.log(`id => ${id}, content=> ${content}, postId=>${postId}, status=>${status}`);

        const post = posts[postId];
        const comment = post.comments.find(comment => {
            return comment.id === id;
        });

        comment.status = status;
        comment.content = content;
        console.log(`post => ${JSON.stringify(post, null, ' ')}`);
    }
}