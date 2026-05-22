const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Дозволяємо всім
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.get('/posts', (req, res, next) => {
    res.status(200).json({
        posts: [
            { 
                title: 'Мій перший пост', 
                content: 'REST API — це дуже зручно!' 
            }
        ]
    });
});
app.post('/post', (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;

    console.log('Створено пост:', title, content);
    res.status(201).json({
        message: 'Пост успішно створено!',
        post: { id: new Date().toISOString(), title: title, content: content }
    });
});

app.listen(8080, () => {
    console.log('REST API працює на порту 8080');
});