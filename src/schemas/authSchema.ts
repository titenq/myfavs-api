import { z } from 'zod';

import { genMsgError, Required, Type } from '../helpers/genMsgError';
import { errorSchema } from './sharedSchema';

const userSchema = z.object({
  name: z.string(genMsgError('name', Type.STRING, Required.TRUE)),
  email: z.string(genMsgError('email', Type.STRING, Required.TRUE)),
  picture: z.string(genMsgError('picture', Type.STRING, Required.FALSE)).nullish()
});

const userResponseSchema = z.object({
  _id: z.string(genMsgError('_id', Type.STRING, Required.TRUE)),
  userSchema,
  createdAt: z.date(genMsgError('createdAt', Type.DATE, Required.TRUE))
});

const authRegisterSchema = {
  summary: 'Criar usuário',
  tags: ['auth'],
  body: userSchema
    .describe(`<pre><code><b>*name:</b> string
<b>*email:</b> string
<b>picture:</b> string
</code></pre>`),
  response: {
    201: userResponseSchema
      .describe(`<pre><code><b>*_id:</b> string
<b>*name:</b> string
<b>*email:</b> string
<b>picture:</b> string
<b>*createdAt:</b> Date
</code></pre>`),
    400: errorSchema
  }
};

const authLoginSchema = {
  summary: 'Buscar usuário por e-mail',
  tags: ['auth'],
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
  authRegisterSchema,
  authLoginSchema
};
