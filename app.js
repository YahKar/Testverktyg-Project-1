const server = require('./server');
const port = 1500;

server.listen(port, function() {
   console.log(`Server is running at http://localhost:${port}`);
});