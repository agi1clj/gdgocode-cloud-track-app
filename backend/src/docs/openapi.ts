import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerJSDoc from "swagger-jsdoc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiFiles = [
  path.join(__dirname, "./paths/*.ts"),
  path.join(__dirname, "./paths/*.js"),
  path.join(__dirname, "./schemas.ts"),
  path.join(__dirname, "./schemas.js")
];

export const openApiDocument = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "GDGoCode Cloud Track API",
      version: "1.0.0",
      description:
        "Public workshop API for the GDGoCode Cloud Track demo application."
    },
    servers: [
      {
        url: "/",
        description: "Current environment"
      }
    ]
  },
  apis: apiFiles
});
