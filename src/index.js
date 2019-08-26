require("./db/mongoose");
const express = require("express");
const http = require("http");
const morgan = require("morgan");
const PORT = process.env.PORT || 8000;
const routes = require("./router");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(morgan("combined"));
app.use(routes);

server.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}...`);
});
