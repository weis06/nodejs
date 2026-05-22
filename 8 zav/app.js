const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Імітація асинхронної операції (як запит до бази даних)
const getPostsFromDB = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([{ title: 'Async Post', content: 'Це отримано асинхронно!' }]);
        }, 1000);
    });
};

// === ЗАВДАННЯ 8: ПЕРЕПИСУЄМО НА ASYNC/AWAIT ===

// 1. GET маршрут
app.get('/posts', async (req, res, next) => {
    try {
        // Ми використовуємо await, щоб почекати виконання промісу
        const posts = await getPostsFromDB(); 
        
        res.status(200).json({
            message: 'Дані успішно отримані!',
            posts: posts
        });
    } catch (err) {
       
        res.status(500).json({ message: 'Помилка завантаження даних' });
    }
});

// 2. POST маршрут
app.post('/post', async (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;

    try {
        // Тут ми б писали: await post.save();
        console.log('Зберігаємо дані...');
        
        res.status(201).json({
            message: 'Пост створено асинхронно!',
            post: { id: new Date().toISOString(), title: title, content: content }
        });
    } catch (err) {
        res.status(500).json({ message: 'Не вдалося створити пост' });
    }
});

app.listen(8080, () => {
    console.log('Async Server працює на порту 8080');
});