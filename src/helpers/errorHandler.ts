import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

const errorHandler = (error: any, request: FastifyRequest, reply: FastifyReply) => {
  if (error instanceof ZodError) {
    reply.status(400).send({
      error: true,
      message: error.issues.map((issue: { message: string }) => issue.message).join(' | '),
      statusCode: 400
    });

    return;
  }

  const statusCode = error?.statusCode || 500;

  reply.status(statusCode).send(error);
};

export default errorHandler;
