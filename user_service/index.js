const express = require('express');
const cors = require('cors');
const app = express();
const port = 80;

app.use(cors());
app.use(express.json());

const users = {
    "1": { id: "1", name: "John Doe", email: "john@example.com" },
    "2": { id: "2", name: "Jane Smith", email: "jane@example.com" }
};

app.get('/users/:user_id', (req, res) => {
    const user = users[req.params.user_id];
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ detail: "User not found" });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: "healthy" });
});

app.listen(port, () => {
    console.log(`User Service running on port ${port}`);
});
