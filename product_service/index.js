const express = require('express');
const cors = require('cors');
const app = express();
const port = 80;

app.use(cors());
app.use(express.json());

const products = {
    "101": { id: "101", name: "Laptop", price: 999.99, stock: 10 },
    "102": { id: "102", name: "Mouse", price: 25.00, stock: 50 }
};

app.get('/products/:product_id', (req, res) => {
    const product = products[req.params.product_id];
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ detail: "Product not found" });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: "healthy" });
});

app.listen(port, () => {
    console.log(`Product Service running on port ${port}`);
});
