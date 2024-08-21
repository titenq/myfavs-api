import { ZodError } from 'zod';

const errorHandler = (error, request, reply) => {
  if (error instanceof ZodError || error?.details?.issues) {
    reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      issues: error instanceof ZodError ? error.issues : error.details.issues,
    });

    return;
  }

  const statusCode = error?.statusCode || 500;

  reply.status(statusCode).send(error);
};

export default errorHandler;
