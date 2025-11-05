import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API PROGIII - Gestión de Salones de Fiestas',
            version: '1.0.0',
            description: 'API REST para el Trabajo Final Integrador de Programación III. Sistema de gestión de reservas para salones de fiestas.'
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Ingresa el token JWT (sin "Bearer ") para autorizarte.'
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['src/swagger/*.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
export default swaggerDocs;