import express from 'express';
import passport from "passport";
import routes from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger.js';
import errorHandler from './middlewares/error.middleware.js';
import fileUpload from "express-fileupload";
import "./config/passport.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(passport.initialize());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// routes
app.use('/api', routes);

// global error handler
app.use(errorHandler);

export default app;
