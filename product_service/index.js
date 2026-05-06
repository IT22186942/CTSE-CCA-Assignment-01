const express = require('express');
const cors = require('cors');
const app = express();
const port = 80;

app.use(cors());
app.use(express.json());

const products = {
    "101": { id: "101", name: "Laptop", price: 999.99, stock: 10 },
    "102": { id: "102", name: "Mouse", price: 25.00, stock: 50 },
    "103": { id: "103", name: "Mechanical Keyboard", price: 120.00, stock: 15 },
    "104": { id: "104", name: "Gaming Monitor", price: 350.00, stock: 8 },
    "105": { id: "105", name: "Noise Cancelling Headphones", price: 199.99, stock: 20 },
    "106": { id: "106", name: "USB-C Hub", price: 45.00, stock: 100 }
};

app.get('/products/:product_id', (req, res) => {
    const product = products[req.params.product_id];
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ detail: "Product not found" });
    }
});

app.post('/products/:product_id/reduce-stock', (req, res) => {
    const product = products[req.params.product_id];
    const { quantity } = req.body;
    
    if (!product) {
        return res.status(404).json({ detail: "Product not found" });
    }
    
    if (product.stock < quantity) {
        return res.status(400).json({ detail: `Insufficient stock. Only ${product.stock} available.` });
    }
    
    product.stock -= quantity;
    res.json({ status: "Stock reduced successfully", remaining_stock: product.stock });
});

app.get('/health', (req, res) => {
    res.json({ status: "healthy" });
});

app.listen(port, () => {
    console.log(`Product Service running on port ${port}`);
});
