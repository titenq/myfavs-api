import { FastifyRequest, FastifyReply } from 'fastify';

import { IPingResponse } from 'src/interfaces/pingInterface';

export const pingController = (request: FastifyRequest, reply: FastifyReply) => {
  const response: IPingResponse = { ping: 'pong' };

  reply.status(200).send(response);
};
