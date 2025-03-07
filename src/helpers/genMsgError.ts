export enum Type {
  STRING = 'deve ser um texto',
  NUMBER = 'deve ser um número',
  BOOLEAN = 'deve ser um booleano',
  DATE = 'com formato inválido',
  UUID = 'com UUID inválido',
  INT = 'deve ser um número inteiro',
  POSITIVE = 'deve ser um número inteiro positivo',
  NONNEGATIVE = 'não pode ser um número negativo',
  MIN = 'deve ter o número mínimo de caracteres igual a',
  MAX = 'deve ter o número máximo de caracteres igual a',
  LENGTH = 'deve ter o número de elementos igual a',
  EMAIL = 'com formato inválido',
  URL = 'com formato inválido'
}

export enum Required {
  TRUE,
  FALSE,
  NULL
}

type ValidRequired<T extends Type> = T extends Type.MIN | Type.MAX | Type.LENGTH | Type.EMAIL | Type.DATE ? Required.NULL : T extends Type.STRING | Type.NUMBER | Type.BOOLEAN | Type.UUID | Type.INT | Type.POSITIVE | Type.NONNEGATIVE | Type.URL ? Required.TRUE | Required.FALSE : never;

interface errorMessage {
  required_error?: string;
  invalid_type_error?: string;
  message?: string;
}

const getRequiredError = (field: string, type: Type) => {
  return {
    required_error: `${field} é obrigatório`,
    invalid_type_error: `${field} ${type}`
  };
};

const getInvalidTypeError = (field: string, type: Type) => {
  return {
    invalid_type_error: `${field} ${type}`
  };
};

const getMessage = (field: string, type: Type, value?: string) => {
  if (value) {
    return {
      message: `${field} ${type} ${value}`
    };
  }

  return {
    message: `${field} ${type}`
  };
};

export const genMsgError = <T extends Type>(field: string, type: T, required: ValidRequired<T>, value?: string): errorMessage => {
  if (required === Required.TRUE) {
    return getRequiredError(field, type);
  }

  if (required === Required.FALSE) {
    return getInvalidTypeError(field, type);
  }

  if (value) {
    return getMessage(field, type, value);
  }

  return getMessage(field, type);
};
