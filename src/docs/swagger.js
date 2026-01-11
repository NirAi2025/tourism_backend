import swaggerJsdoc from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config();

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Tourism Backend API",
    version: "1.0.0",
    description: "API documentation for Tourism Backend",
  },
  servers: [
    {
      url: `${process.env.API_URL}:${process.env.PORT || 3000}/api`,
      description: "Local server",
    },
  ],

  // 🔐 JWT AUTH CONFIG
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
  swaggerDefinition,
  apis: [
    "./src/routes/**/*.js", 
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
