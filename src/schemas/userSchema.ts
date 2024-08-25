import { z } from 'zod';

import { genMsgError, Required, Type } from '../helpers/genMsgError';
import { errorSchema } from './sharedSchema';

const passwordSchema = z.string().refine(password => {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&]/.test(password);
  const hasMinLength = password.length >= 8;

  return hasUppercase && hasLowercase && hasNumber && hasSpecialChar && hasMinLength;
}, {
  message: 'A senha deve ter pelo menos 8 caracteres, 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial'
});

/* const userSchema = z.object({
  name: z.string(genMsgError('name', Type.STRING, Required.TRUE)),
  email: z.string(genMsgError('email', Type.STRING, Required.TRUE)),
  password: z.string(genMsgError('password', Type.STRING, Required.TRUE))
}); */

const userSchema = z.object({
  name: z.string(genMsgError('name', Type.STRING, Required.TRUE)),
  email: z.string(genMsgError('email', Type.STRING, Required.TRUE))
    .email(genMsgError('email', Type.EMAIL, Required.NULL))
});

const userResponseSchema = z.object({
  _id: z.string(genMsgError('_id', Type.STRING, Required.TRUE)),
  name: z.string(genMsgError('name', Type.STRING, Required.TRUE)),
  email: z.string(genMsgError('email', Type.STRING, Required.TRUE)),
  createdAt: z.date(genMsgError('createdAt', Type.DATE, Required.TRUE))
});

const userCreateSchema = {
  summary: 'Criar usuário',
  tags: ['users'],
  body: userSchema
    .describe(`<pre><code><b>*name:</b> string
<b>*email:</b> string
</code></pre>`),
  response: {
    201: userResponseSchema
      .describe(`<pre><code><b>*_id:</b> string
<b>*name:</b> string
<b>*email:</b> string
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
