require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const analysisRoutes = require('./src/api/routes/analysisRoutes');

app.use(express.json());
app.use('/api/v1', analysisRoutes);

app.get('/health', (req, res) => { 
   res.status(200).json({ status: "API is running fine!" });
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
