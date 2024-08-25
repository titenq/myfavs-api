import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

import { genMsgError, Required, Type } from '../helpers/genMsgError';
import { _idSchema, errorSchema } from './sharedSchema';

const passwordSchema = () => {
  return z.string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .refine(password => /[A-Z]/.test(password), 'A senha deve conter pelo menos uma letra maiúscula')
    .refine(password => /[a-z]/.test(password), 'A senha deve conter pelo menos uma letra minúscula')
    .refine(password => /\d/.test(password), 'A senha deve conter pelo menos um número')
    .refine(password => /[@$!%*?&]/.test(password), 'A senha deve conter pelo menos um caractere especial');
};

const userBodySchema = z.object({
  name: z.string(genMsgError('name', Type.STRING, Required.TRUE)),
  email: z.string(genMsgError('email', Type.STRING, Required.TRUE))
    .email(genMsgError('email', Type.EMAIL, Required.NULL)),
  password: passwordSchema()
});

const userResponseSchema = z.object({
  _id: z.instanceof(Object).transform(id => id.toString()),
  name: z.string(genMsgError('name', Type.STRING, Required.TRUE)),
  email: z.string(genMsgError('email', Type.STRING, Required.TRUE)),
  createdAt: z.date(genMsgError('createdAt', Type.DATE, Required.TRUE))
});

const userCreateSchema = {
  summary: 'Criar usuário',
  tags: ['users'],
  body: userBodySchema
    .describe(`<pre><code><b>*name:</b> string
<b>*email:</b> string
<b>*password:</b> string
</code></pre>`),
  response: {
    201: userResponseSchema
      .describe(`<pre><code><b>*_id:</b> string
<b>*name:</b> string
<b>*email:</b> string
<b>*password:</b> string
<b>*createdAt:</b> Date
</code></pre>`),
    400: errorSchema,
    409: errorSchema
  }
};

const userGetByEmailSchema = {
  summary: 'Buscar usuário por e-mail',
  tags: ['users'],
  params: z.object({
    email: z.string(genMsgError('email', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*email:</b> string</code></pre>')
  }),
  response: {
    201: z.object({
      _id: z.string(genMsgError('_id', Type.STRING, Required.TRUE)),
      name: z.string(genMsgError('name', Type.STRING, Required.TRUE)),
      email: z.string(genMsgError('email', Type.STRING, Required.TRUE)),
      picture: z.string(genMsgError('picture', Type.STRING, Required.NULL)).nullish(),
      createdAt: z.date(genMsgError('createdAt', Type.DATE, Required.TRUE))
    })
      .describe(`<pre><code><b>*_id:</b> string
<b>*name:</b> string
<b>*email:</b> string
<b>picture:</b> string
<b>*createdAt:</b> Date
</code></pre>`),
    400: errorSchema
  }
};

export {
  userCreateSchema,
  userGetByEmailSchema
};
