import { resolve } from 'node:path';

import fastify from 'fastify';
import fastifyHelmet from '@fastify/helmet';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';

import indexRoute from '@/routes/indexRoute';
import apiBaseUrl from '@/helpers/apiBaseUrl';
import pingEndpoint from '@/helpers/pingEndpoint';
import errorHandler from '@/helpers/errorHandler';
import siteOrigin from '@/helpers/siteOrigin';
import { fastifySwaggerOptions, fastifySwaggerUiOptions } from '@/helpers/swaggerOptions';

const { PORT, COOKIE_SECRET, JWT_SECRET } = process.env;

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.setErrorHandler(errorHandler);

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

app.register(cookie, {
  secret: COOKIE_SECRET!
});

app.register(jwt, {
  secret: JWT_SECRET!
});

app.register(fastifyStatic, {
  root: resolve(process.cwd(), 'uploads'),
  prefix: '/uploads/'
});

app.register(fastifySwagger, fastifySwaggerOptions);
app.register(fastifySwaggerUi, fastifySwaggerUiOptions);

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

const listeners = ['SIGINT', 'SIGTERM'];

listeners.forEach(signal => {
  process.on(signal, async () => {
    await app.close();

    process.exit(0);
  });
});
