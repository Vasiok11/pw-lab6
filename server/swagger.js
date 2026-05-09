import swaggerUi from 'swagger-ui-express';

// Dynamically generate Swagger documentation paths for our 4 entities
const generatePaths = () => {
  const paths = {
    '/api/token': {
      post: {
        summary: 'Generate JWT Authorization Token',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string', example: 'admin' },
                  role: { type: 'string', example: 'admin' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Successful token generation' } }
      }
    }
  };

  const entities = ['skills', 'projects', 'jobs', 'learning'];
  
  entities.forEach(entity => {
    paths[`/api/${entity}`] = {
      get: {
        summary: `Get all ${entity}`,
        tags: [entity],
        parameters: [
          { name: 'skip', in: 'query', schema: { type: 'integer', default: 0 }, description: 'Number of items to skip' },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 100 }, description: 'Number of items to return' }
        ],
        responses: { 200: { description: `A list of ${entity}` } }
      },
      post: {
        summary: `Create a new ${entity}`,
        tags: [entity],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object' } } }
        },
        responses: { 201: { description: 'Created successfully' }, 401: { description: 'Unauthorized' } }
      }
    };

    paths[`/api/${entity}/{id}`] = {
      get: {
        summary: `Get a specific ${entity} by ID`,
        tags: [entity],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Successful response' }, 404: { description: 'Not found' } }
      },
      put: {
        summary: `Update a specific ${entity}`,
        tags: [entity],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { 200: { description: 'Updated successfully' }, 401: { description: 'Unauthorized' } }
      },
      delete: {
        summary: `Delete a specific ${entity} (Requires Admin Role)`,
        tags: [entity],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted successfully' }, 403: { description: 'Forbidden (Requires Admin)' } }
      }
    };
  });

  return paths;
};

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Cyberpunk Career Tracker API',
    version: '1.0.0',
    description: 'REST API for managing Skills, Projects, Jobs, and Learning Resources. Includes JWT Authentication and RBAC.',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token to access protected and admin routes.'
      }
    }
  },
  paths: generatePaths()
};

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "API Explorer"
  }));
  console.log('[SYSTEM] Swagger documentation active at /api-docs');
};
