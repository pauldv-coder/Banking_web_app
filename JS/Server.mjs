const express = require('express');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const shortid = require('shortid');

async function initializeApp() {
    const app = express();
    const port = 3000;

    const adapter = new FileSync('db.json');
    const db = low(adapter);

    // Establece los valores predeterminados de la base de datos
    db.defaults({ users: [] }).write();

    // Habilitar el uso de JSON
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Ruta para obtener todos los usuarios
    app.get('/all-data', (req, res) => {
        const users = db.get('users').value();
        res.json(users);
    });

    // Ruta para agregar un usuario
    app.post('/add-user', (req, res) => {
        const user = {
            id: shortid.generate(),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        };

        db.get('users').push(user).write();
        res.json({ message: "User added successfully!", user });
    });

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
}

// Llama a la función para arrancar tu aplicación
initializeApp();
