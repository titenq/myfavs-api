import { FastifyRequest, FastifyReply } from 'fastify';

import { IGenericError } from '@/interfaces/errorInterface';
import errorHandler from '@/helpers/errorHandler';
import { IJwtParams, IJwtVerify } from '@/interfaces/jwtInterface';

const verifyToken = async (request: FastifyRequest, reply: FastifyReply) => {
  const { userId } = request.params as IJwtParams;
  const token = request.cookies.token;

  if (!token) {
    const errorMessage: IGenericError = {
      error: true,
      message: 'não autorizado',
      statusCode: 403
    };

    errorHandler(errorMessage, request, reply);

    return reply.send();
  }

  const decodedToken: IJwtVerify = request.server.jwt.verify<IJwtVerify>(token);

  if (decodedToken._id !== userId) {
    const errorMessage: IGenericError = {
      error: true,
      message: 'não autorizado',
      statusCode: 403
    };

    errorHandler(errorMessage, request, reply);

    return reply.send();
  }
};

export default verifyToken;
