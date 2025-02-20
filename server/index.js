/*
This is a comment! 
*/
// Load the http module to create an http server.
const http = require("http");
const PORT = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Midterm?\n");
});

server.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}/`)
);
