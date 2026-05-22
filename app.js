//ЗАВДАННЯ 1
// const http = require('http');

// const server = http.createServer((req, res) => {
//     const url = req.url;
//     const method = req.method;
//     if (url === '/') {
//         res.setHeader('Content-Type', 'text/html; charset=utf-8');
//         res.write('<html>');
//         res.write('<head><title>Assignment 1</title></head>');
//         res.write('<body>');
//         res.write('<h1>Ласкаво просимо!</h1>');
//         // Форма відправляє POST запит на /create-user
//         res.write('<form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Відправити</button></form>');
//         res.write('</body>');
//         res.write('</html>');
//         return res.end();
//     }
//     if (url === '/users') {
//         res.setHeader('Content-Type', 'text/html; charset=utf-8');
//         res.write('<html>');
//         res.write('<body><ul><li>User 1</li><li>User 2</li><li>User 3</li></ul></body>');
//         res.write('</html>');
//         return res.end();
//     }
//   // Обробка POST запиту
//     if (url === '/create-user' && method === 'POST') {
//         const body = [];
//         req.on('data', (chunk) => {
//             body.push(chunk);
//         });

//         return req.on('end', () => {
//             const parsedBody = Buffer.concat(body).toString();
//             const rawMessage = parsedBody.split('=')[1];
//             const message = decodeURIComponent(rawMessage.replace(/\+/g, ' '));
            
//             console.log('Username із форми:', message);
            
//             res.statusCode = 302;
//             res.setHeader('Location', '/');
//             return res.end();
//         });
//     }

//     res.write('<html><body><h1>404 Not Found</h1></body></html>');
//     res.end();
// });

// server.listen(3000);

// ЗАВДАННЯ 2
// const express = require('express');

// const app = express();

// // 1. Перший Middleware (просто пише в консоль)
// app.use((req, res, next) => {
//     console.log('Перший Middleware пройшов!');
//     next(); // Кажемо Express іти до наступної функції
// });

// // 2. Другий Middleware
// app.use((req, res, next) => {
//     console.log('Другий Middleware пройшов!');
//     next();
// });

// // 3. Маршрут для користувачів
// // Ставимо його ВИЩЕ за "/", бо Express шукає співпадіння зверху вниз
// app.use('/users', (req, res, next) => {
//     console.log('Ми на сторінці /users');
//     res.send('<h1>Сторінка зі списком користувачів</h1><ul><li>User 1</li><li>User 2</li></ul>');
// });

// // 4. Головна сторінка
// app.use('/', (req, res, next) => {
//     console.log('Ми на головній сторінці /');
//     res.send('<h1>Вітання від Express.js!</h1><p>Це було набагато простіше, ніж перше завдання, чи не так?</p>');
// });

// app.listen(3000, () => {
//     console.log('Express сервер працює на http://localhost:3000');
// });

//ЗАВДАННЯ 3

// const path = require('path');
// const express = require('express');

// const routes = require('./routes/index');

// const app = express();

// app.use(express.static(path.join(__dirname, 'public')));

// app.use(routes);

// app.use((req, res, next) => {
//     res.status(404).send('<h1>Сторінку не знайдено (404)</h1>');
// });

// app.listen(3000, () => {
//     console.log('Сервер Navigation запущено на http://localhost:3000');
// });

//ЗAВДАННЯ 4 +5 

// const express = require('express');
// const bodyParser = require('body-parser');
// const session = require('express-session'); // 1. Всі імпорти зверху

// const app = express();
// const users = [];

// app.set('view engine', 'ejs');
// app.set('views', 'views');

// // 2. НАЛАШТУВАННЯ (Мідлвари)
// app.use(bodyParser.urlencoded({ extended: false }));

// app.use(
//   session({
//     secret: 'my secret key',
//     resave: false,
//     saveUninitialized: false
//   })
// );

// // 3. МАРШРУТИ (Routes)

// // Головна сторінка 
// app.get('/', (req, res, next) => {
//     res.render('index', { 
//         pageTitle: 'Home',
//         // Тепер isAuthenticated буде працювати, бо сесія налаштована вище
//         isAuthenticated: req.session.isLoggedIn 
//     });
// });

// app.get('/users', (req, res, next) => {
//     res.render('users', { 
//         pageTitle: 'Список користувачів', 
//         users: users,
//         isAuthenticated: req.session.isLoggedIn 
//     });
// });

// app.post('/add-user', (req, res, next) => {
//     users.push({ name: req.body.username });
//     res.redirect('/users');
// });

// // Логіка входу
// app.post('/login', (req, res, next) => {
//     req.session.isLoggedIn = true;
//     req.session.save(err => {
//         res.redirect('/');
//     });
// });

// // Логіка виходу
// app.post('/logout', (req, res, next) => {
//     req.session.destroy(err => {
//         res.redirect('/');
//     });
// });

// app.listen(3000, () => {
//     console.log('Сервер запущено на http://localhost:3000');
// });

//завдання 6
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { body, validationResult } = require('express-validator'); 

const app = express();
const users = [];

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: 'my secret key',
    resave: false,
    saveUninitialized: false
  })
);

// МАРШРУТИ

// Оновлений GET 
app.get('/', (req, res, next) => {
    res.render('index', { 
        pageTitle: 'Home',
        isAuthenticated: req.session.isLoggedIn,
        // НОВЕ ДЛЯ ЗАВДАННЯ 6:
        errorMessage: null,
        oldInput: { name: '' }
    });
});

// Оновлений POST 
app.post(
    '/add-user', 
    [
       
        body('username')
            .isLength({ min: 3 })
            .withMessage('Ім’я занадто коротке (мінімум 3 символи)!')
            .trim()
    ], 
    (req, res, next) => {
        const name = req.body.username;
        const errors = validationResult(req); 

       
        if (!errors.isEmpty()) {
            return res.status(422).render('index', {
                pageTitle: 'Home',
                isAuthenticated: req.session.isLoggedIn,
                // НОВЕ ДЛЯ ЗАВДАННЯ 6:
                errorMessage: errors.array()[0].msg, 
                oldInput: { name: name } 
            });
        }

        users.push({ name: name });
        res.redirect('/users');
    }
);

app.get('/users', (req, res, next) => {
    res.render('users', { 
        pageTitle: 'Список користувачів', 
        users: users,
        isAuthenticated: req.session.isLoggedIn 
    });
});

app.post('/login', (req, res, next) => {
    req.session.isLoggedIn = true;
    req.session.save(err => {
        res.redirect('/');
    });
});

app.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
});

app.listen(3000, () => {
    console.log('Сервер Валідації працює: http://localhost:3000');
});