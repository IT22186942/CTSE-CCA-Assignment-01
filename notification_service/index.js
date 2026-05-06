const express = require('express');
const cors = require('cors');
const app = express();
const port = 80;

app.use(cors());
app.use(express.json());

app.post('/notify/', (req, res) => {
    const message = req.body.message;
    console.log(`--- NOTIFICATION SENT ---: ${message}`);
    res.json({ status: "Notification sent successfully", message_preview: message });
});

app.get('/health', (req, res) => {
    res.json({ status: "healthy" });
});

app.listen(port, () => {
    console.log(`Notification Service running on port ${port}`);
});
