const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const routes = require('./routes/v1');
const http = require("http");
const https = require("https");
const fs = require("fs");
const socketUtils = require("./utils/socket");


// app
const app = express();

// swagger

const swaggerUi = require ('swagger-ui-express');
const swaggerJsDoc= require('swagger-jsdoc');
const swaggerOption = require('./swagger');

const jsDoc = swaggerJsDoc(swaggerOption);

app.use('/swagger',swaggerUi.serve , swaggerUi.setup(jsDoc))

// middlewares

app.use(morgan('dev'));
app.use(express.static('public'));
// let corsOptions;

app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());

const port = process.env.PORT || 5050;

// app.listen(port, () => {
// 	console.log(`server is running on port ${port}`);
// });

let server = null;
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "uat") {
	server = http.createServer(app);
} else {
	var options = {
		key: fs.readFileSync(process.env.SSL_KEY || ""),
		cert: fs.readFileSync(process.env.SSL_CERT || ""),
		ca: fs.readFileSync(process.env.SSL_CHAIN || ""),
	};

	server = https.createServer(options, app);
}

const io = socketUtils.sio(server);
app.use(function (req, res, next) {
    req.socket_request =io 
    next();
});
const socketRoute = require('./routes/v1/socket/feedRoute')(io);
app.use('/api', socketRoute);
app.use('/api', routes);

server.listen(process.env.PORT, () => {
	console.log(`App running on port ${process.env.PORT}...`);
});
