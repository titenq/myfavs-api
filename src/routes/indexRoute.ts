import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import { FastifyInstance } from 'fastify';

const indexRoute = async (fastify: FastifyInstance) => {
  const files = readdirSync('.')
    .filter(file =>
      (file !== 'indexRoute.ts' && file.endsWith('.ts')) ||
      (file !== 'indexRoute.mjs' && file.endsWith('.mjs'))
    );

  for (const file of files) {
    const routeModule = await import(resolve('.', file));

    fastify.register(routeModule);
  }
};

export default indexRoute;
