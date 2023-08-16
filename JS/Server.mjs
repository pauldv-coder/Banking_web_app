const express = require('express');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const shortid = require('shortid');
const cors = require('cors');

async function initializeApp() {
    const app = express();
    const port = 3000;

    const adapter = new FileSync('db.json');
    const db = low(adapter);

   
    db.defaults({ users: [] }).write();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(cors()); 

    // Aquí sirves los archivos estáticos desde el directorio 'public'
    app.use(express.static('public'));

    app.get('/all-data', (req, res) => {
        const users = db.get('users').value();
        res.json(users);
    });

    app.post('/add-user', (req, res) => {
        try {
            const user = {
                id: shortid.generate(),
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email
            };
    
            db.get('users').push(user).write();
            res.json({ message: "User added successfully!", user });
        } catch (error) {
            console.error("Error adding user:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    });
    
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
}

initializeApp();
