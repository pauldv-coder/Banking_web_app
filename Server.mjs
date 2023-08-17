import express from 'express';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import shortid from 'shortid';
import cors from 'cors';

async function initializeApp() {
    const app = express();
    const port = 3000;

    const adapter = new FileSync('db.json');
    const db = low(adapter);

    db.defaults({ users: [], messages: [] }).write();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors()); 
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

    app.post('/sendMessage', (req, res) => {
        try {
            const message = {
                id: shortid.generate(),
                nombre: req.body.nombre,
                email: req.body.email,
                mensaje: req.body.mensaje
            };

            db.get('messages').push(message).write();
            res.json({ success: true, message: "Message sent successfully!" });
        } catch (error) {
            console.error("Error sending message:", error);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    });
    
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
}

initializeApp();

