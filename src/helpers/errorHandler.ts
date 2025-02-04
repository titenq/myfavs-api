import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

import { IGenericError } from '@/interfaces/errorInterface';

const errorHandler = (error: Error | ZodError | IGenericError, request: FastifyRequest, reply: FastifyReply) => {
  if (error instanceof ZodError) {
    reply.status(400).send({
      error: true,
      message: error.issues.map((issue: { message: string }) => issue.message).join(' | '),
      statusCode: 400
    });

    return;
  }

  if ('statusCode' in error) {
    reply.status(error.statusCode).send(error);

    return;
  }

  reply.status(500).send({
    error: true,
    message: error.message || 'Internal Server Error',
    statusCode: 500
  })
};

export default errorHandler;
