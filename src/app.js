import express from 'express';
import passport from "passport";
import routes from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger.js';
import errorHandler from './middlewares/error.middleware.js';
import fileUpload from "express-fileupload";
import { fileURLToPath } from "url";
import "./config/passport.js";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    abortOnLimit: true,
    createParentPath: true,
  })
);
app.use(passport.initialize());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/public/uploads", express.static(path.join(__dirname, "public/uploads")));
// routes
app.use('/api', routes);

// global error handler
app.use(errorHandler);

export default app;
