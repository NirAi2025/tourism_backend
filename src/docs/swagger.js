import swaggerJsdoc from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = process.env.API_URL || "http://localhost:3000";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Tourism Backend API",
    version: "1.0.0",
    description: "API documentation for Tourism Backend",
  },
  servers: [
    {
      url: `${BASE_URL}/api`,
      description: "API Server",
    },
  ],

  // JWT AUTH CONFIG
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },

  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: ["./src/routes/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
