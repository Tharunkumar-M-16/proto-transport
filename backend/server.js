const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

const connectDB = require('./src/config/db');
const busRoutes = require('./src/routes/busRoutes');
const locationRoutes = require('./src/routes/locationRoutes');
const smsWebhookRoutes = require('./src/routes/smsWebhookRoutes');
const initSocket = require('./src/sockets/locationSocket');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.set('io', io); // so controllers can access io via req.app.get('io')
initSocket(io);

app.use('/api/buses', busRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/sms-webhook', smsWebhookRoutes);

app.get('/', (req, res) => res.send('Bus tracker backend running'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));