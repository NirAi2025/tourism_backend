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
import cors from "cors";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// allow main site and admin panel
const allowedOrigins = [
  'https://www.tourguidetrack.in',  // main site
  'https://tourguidetrack.in',      // main site without www
  'https://admin.tourguidetrack.in' // admin panel
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));



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
