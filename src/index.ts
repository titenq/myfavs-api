import { resolve } from 'node:path';

import 'dotenv/config';
import fastify from 'fastify';
import fastifyHelmet from '@fastify/helmet';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';

import indexRoute from './routes/indexRoute';
import apiBaseUrl from './helpers/apiBaseUrl';
import errorHandler from './helpers/errorHandler';
import siteOrigin from './helpers/siteOrigin';
import { fastifySwaggerOptions, fastifySwaggerUiOptions } from './helpers/swaggerOptions';
import configRateLimit from './helpers/configRateLimit';

const { PORT, COOKIE_SECRET, JWT_SECRET } = process.env;

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.setErrorHandler(errorHandler);

app.register(fastifyHelmet, {
  crossOriginResourcePolicy: {
    policy: 'cross-origin'
  },
  crossOriginEmbedderPolicy: false
});

app.register(fastifyCors, {
  origin: [siteOrigin],
  credentials: true,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Cookie',
    'Access-Control-Allow-Origin',
    'X-Recaptcha-Token'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
});

app.register(cookie, {
  secret: COOKIE_SECRET!,
  hook: 'onRequest',
  parseOptions: {
    secure: process.env.NODE_ENV === 'PROD',
    httpOnly: true,
    sameSite: 'none',
    path: '/'
  }
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
  await configRateLimit(app);
  await indexRoute(app);

  await app.listen({
    port: Number(PORT) || 3300,
    host: '0.0.0.0'
  });
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
