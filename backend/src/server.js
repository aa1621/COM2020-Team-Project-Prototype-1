import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const PORT = 8000;

const test = {
    type: "testing",
    name: "test1" 
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json(test);
});

app.get('/errortest', (req, res) => {
    throw new Error("Testing error");
});

app.use((req, res) => {
    res.status(404).json({error: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error("Error:", err);

    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error"
    });
});

app.listen(PORT, ()=> console.log(`server connected on port ${PORT}`));
