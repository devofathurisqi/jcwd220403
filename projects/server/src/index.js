require('dotenv/config');
const express = require('express');
const cors = require('cors');
const bearerToken = require('express-bearer-token');
const { join } = require('path');
const database = require('./models');
const fileUpload = require('express-fileupload');
const verifyJWT = require('./middlewares/verifyJWT');
const {
  authRouters,
  userRouters,
  refresh,
  logout,
  tenantRouters,
  RegisterAsTenant,
  pagesRouters,
  roomsRouters,
  tenantTransactionRouter,
  transactionRouters,
  privateTransactionRouters,
  propertyRouters,
} = require('./routers');
const middlewareDetect = require('./middlewares/deviceDetector');
const cookieParser = require('cookie-parser');
const PORT = process.env.SERVER_PORT || 8000;
const app = express();
const allowOrigins = ['http://localhost:3000', "https://rapidapi.com/"];
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (allowOrigins.includes(origin)) return callback(null, true);

    callback(new Error('Not allowed by CORS'));
  },
};
app.use(
  cors(corsOptions)
  // cors()
  // {
  //   origin: [
  //     process.env.WHITELISTED_DOMAIN &&
  //       process.env.WHITELISTED_DOMAIN.split(','),
  //   ],
  // }
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bearerToken());
app.use(cookieParser());

//#region API ROUTES

// ===========================
// NOTE : Add your routes here

//routes that don't need token START
app.use(refresh);
app.use(logout);

app.use(propertyRouters);
app.use(transactionRouters);
app.use(tenantRouters);
app.use(pagesRouters);
app.use(roomsRouters);
// app.use(tenantTransactionRouter);

//routes that don't need token END

//device detection START
app.use(middlewareDetect);
app.use(authRouters);
app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 1024 * 1024, // 1 MB
    },
    abortOnLimit: true,
  })
);

//routes that need token START
app.use(verifyJWT);
app.use(userRouters);
app.use(RegisterAsTenant);
app.use(privateTransactionRouters);
//routes that need token END
//device detection END
app.use(tenantRouters);
app.use(tenantTransactionRouter)

app.get('/api', (req, res) => {
  res.send(`Hello, this is my API`);
});

app.get('/api/greetings', (req, res, next) => {
  res.status(200).json({
    message: 'Hello, Student !',
  });
});

// ===========================

// not found
app.use((req, res, next) => {
  if (req.path.includes('/api/')) {
    res.status(404).send('Not found !');
  } else {
    next();
  }
});

// error
app.use((err, req, res, next) => {
  if (req.path.includes('/api/')) {
    console.error('Error : ', err.stack);
    res.status(500).send('Error !');
  } else {
    next();
  }
});

//#endregion

//#region CLIENT
const clientPath = './Public';
app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, clientPath));
});

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});

// database.sequelize.sync({ alter: true });
