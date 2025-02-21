import { IGenericError } from 'src/interfaces/errorInterface';

const createErrorMessage = (
  message: string,
  statusCode: number = 400
): IGenericError => ({
  error: true,
  message,
  statusCode
});

export default createErrorMessage;
