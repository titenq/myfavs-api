import { resolve } from 'node:path';

import fastify from 'fastify';
import fastifyHelmet from '@fastify/helmet';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

import indexRoute from './routes/indexRoute';
import apiBaseUrl from './helpers/apiBaseUrl';
import pingEndpoint from './helpers/pingEndpoint';
import errorHandler from './helpers/errorHandler';
import siteOrigin from './helpers/siteOrigin';
import { fastifySwaggerOptions, fastifySwaggerUiOptions } from './helpers/swaggerOptions';

const { PORT } = process.env;

const app = fastify();

app.register(fastifyHelmet);

app.register(fastifyCors, {
  origin: siteOrigin,
  credentials: true,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Access-Control-Allow-Origin'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
});

app.register(fastifyStatic, {
  root: resolve('..', '..', 'uploads'),
  prefix: '/uploads/'
});

app.register(fastifySwagger, fastifySwaggerOptions);
app.register(fastifySwaggerUi, fastifySwaggerUiOptions);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.setErrorHandler(errorHandler);

const startServer = async () => {
  await indexRoute(app);

  await app.listen({
    port: Number(PORT),
    host: '0.0.0.0'
  });

  pingEndpoint();
};

try {
  startServer();

  console.log(`Server started in ${apiBaseUrl}`);
  console.log(`API Doc: ${apiBaseUrl}/docs`);
} catch (error) {
  console.error(error);
}
