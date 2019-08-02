const path = require('path');
const express = require('express');
const publicPath = path.join(__dirname,'../public'); 

//console.log(__dirname + '../public');
//console.log(publicPath);
const port = process.env.PORT || 3000;
let app = express();

app.use(express.static(publicPath));

// app.get('/',(req,res,next)=>{
//     next();
// });

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
}); 