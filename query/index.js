const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

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

    if (type === 'PostCreated') { 
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
    }

    if (type === 'CommentCreated') { 
        const { id, content, postId } = data;
        console.log(`id => ${id}, content=> ${content}, postId=>${postId}`);
        const post = posts[postId];
        console.log(`post => ${JSON.stringify( post, null, ' ')}`);
        post.comments.push({ id, content });
    }
    
    res.send({});
});

app.listen(4002, () => {
    console.log('listining on 4002');
});