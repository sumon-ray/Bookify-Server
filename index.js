const express = require('express')
const app = express();
const port = process.env.PORT || 4000;


app.get("/", (req, res) => {
    res.send('run properly')
})


app.listen(port, () => {
    console.log('bookify server is runing properly')
})