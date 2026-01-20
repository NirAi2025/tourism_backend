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

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },

    // 🔹 Reusable Schemas
    schemas: {
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            example: "user@example.com",
          },
          password: {
            type: "string",
            example: "Password@123",
          },
        },
      },

      RegisterRequest: {
        type: "object",
        required: ["firstName", "email", "password"],
        properties: {
          firstName: {
            type: "string",
            example: "Rahul",
          },
          lastName: {
            type: "string",
            example: "Sharma",
          },
          email: {
            type: "string",
            example: "rahul@gmail.com",
          },
          country_code: {
            type: "string",
            example: "91",
          },
          phone: {
            type: "string",
            example: "0000000000",
          },
          password: {
            type: "string",
            example: "Password@123",
          },
        },
      },
    },
  },

  // 🔐 Global JWT (will apply to all routes)
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  definition: swaggerDefinition,

  // Auto-read swagger comments from routes
  apis: ["./src/routes/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
