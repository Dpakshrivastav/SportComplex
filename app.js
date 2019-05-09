const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

app.use('/static', express.static(__dirname+'/public'));
console.log(__dirname);
router.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.use('/', router);
app.listen(process.env.port || 3000);
console.log("runnning on port 3000");