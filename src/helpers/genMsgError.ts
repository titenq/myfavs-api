const typeList = {
  STRING: 'deve ser um texto',
  NUMBER: 'deve ser um número',
  BOOLEAN: 'deve ser um booleano',
  DATE: 'com formato inválido',
  UUID: 'com UUID inválido',
  INT: 'deve ser um número inteiro',
  POSITIVE: 'deve ser um número inteiro positivo',
  NONNEGATIVE: 'não pode ser um número negativo',
  MIN: 'deve ter o número mínimo de caracteres igual a',
  MAX: 'deve ter o número máximo de caracteres igual a',
  LENGTH: 'deve ter o número de elementos igual a',
  EMAIL: 'com formato inválido',
  URL: 'com formato inválido'
};

const requiredList = {
  TRUE: true,
  FALSE: false,
  NULL: null
};

const getRequiredError = (field, type) => {
  return {
    required_error: `${field} é obrigatório`,
    invalid_type_error: `${field} ${type}`
  };
};

const getInvalidTypeError = (field, type) => {
  return {
    invalid_type_error: `${field} ${type}`
  };
};

const getMessage = (field, type, value) => {
  if (value) {
    return {
      message: `${field} ${type} ${value}`
    };
  }

  return {
    message: `${field} ${type}`
  };
};

const genMsgError = (field, type, required, value) => {
  if (required === requiredList.TRUE) {
    return getRequiredError(field, type);
  }

  if (required === requiredList.FALSE) {
    return getInvalidTypeError(field, type);
  }

  if (value) {
    return getMessage(field, type, value);
  }

  return getMessage(field, type);
};

export {
  typeList,
  requiredList,
  genMsgError
};
