const express = require('express');
const axios = require('axios');
const app = express();
const port = 80;

app.use(express.json());

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://user-service:80";
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || "http://product-service:80";
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || "http://notification-service:80";

app.post('/orders/', async (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    try {
        // 1. Verify User
        await axios.get(`${USER_SERVICE_URL}/users/${user_id}`);
        
        // 2. Verify Product
        const prodResp = await axios.get(`${PRODUCT_SERVICE_URL}/products/${product_id}`);
        const product = prodResp.data;
        
        if (product.stock < quantity) {
            return res.status(400).json({ detail: `Insufficient stock. Only ${product.stock} available.` });
        }
        
        // 3. Calculate Total
        const totalPrice = product.price * quantity;
        
        // 4. Send Notification
        const notificationPayload = {
            message: `Order confirmed for user ${user_id}. Product: ${product.name}, Qty: ${quantity}, Total: $${totalPrice}`
        };
        try {
            await axios.post(`${NOTIFICATION_SERVICE_URL}/notify/`, notificationPayload);
        } catch (notifErr) {
            console.log("Warning: Notification Service Unavailable", notifErr.message);
        }
        
        res.json({
            status: "Order placed successfully",
            order_details: {
                user_id,
                product_name: product.name,
                quantity,
                total_price: totalPrice
            }
        });
        
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        return res.status(503).json({ detail: "Service Unavailable" });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: "healthy" });
});

app.listen(port, () => {
    console.log(`Order Service running on port ${port}`);
});
