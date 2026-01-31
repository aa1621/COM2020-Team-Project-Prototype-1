import express from 'express';
import cors from 'cors';

import actionTypesRoutes from './routes/actionTypes.route.js';
import actionLogsRoutes from './routes/actionLogs.route.js';
import submissionsRoutes from './routes/submissions.route.js';
import challengesRoutes from './routes/challenges.route.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({status: "ok"});
});

app.use('/action-types', actionTypesRoutes);
app.use('/action-logs', actionLogsRoutes);
app.use('/', submissionsRoutes);
app.use('/', challengesRoutes);

app.get('/errortest', (req, res) => {
    throw new Error("Testing error");
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({error: "Route not found" });
});

// Main error handler
app.use((err, req, res, next) => {
    console.error("Error:", err);

    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error"
    });
});

export default app;