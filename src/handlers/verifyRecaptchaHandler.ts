import 'dotenv/config';
import { FastifyRequest, FastifyReply } from 'fastify';
import axios from 'axios';

import errorHandler from 'src/helpers/errorHandler';
import createErrorMessage from 'src/helpers/createErrorMessage';

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

const verifyRecaptcha = async (request: FastifyRequest, reply: FastifyReply) => {
  const recaptchaToken = request.headers['x-recaptcha-token'] as string;

  if (!recaptchaToken) {
    const errorMessage = createErrorMessage('reCAPTCHA não fornecido', 403);

    errorHandler(errorMessage, request, reply);

    return reply.send();
  }

  const captchaResponse = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
  );

  if (!captchaResponse.data.success) {
    const errorMessage = createErrorMessage('reCAPTCHA inválido');

    errorHandler(errorMessage, request, reply);

    return reply.send();
  }

  return recaptchaToken;
};

export default verifyRecaptcha;
