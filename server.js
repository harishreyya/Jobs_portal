const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DB_URI, {
    //  useNewUrlParser: true, useUnifiedTopology: true
     })


app.use('/api/auth', require('./routes/Auth'));
app.use('/api/jobs', require('./routes/Jobs'));


const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
