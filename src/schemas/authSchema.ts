import { z } from 'zod';
import { genMsgError, requiredList, typeList } from '../helpers/genMsgError.js';
import { apiKeySchema, errorSchema } from './sharedSchema.js';

const userSchema = z.object({
  name: z.string(genMsgError('name', typeList.STRING, requiredList.TRUE)),
  email: z.string(genMsgError('email', typeList.STRING, requiredList.TRUE)),
  picture: z.string(genMsgError('picture', typeList.STRING, requiredList.FALSE)).nullish()
});

const userResponseSchema = z.object({
  _id: z.string(genMsgError('_id', typeList.STRING, requiredList.TRUE)),
  userSchema,
  createdAt: z.date(genMsgError('createdAt', typeList.DATE, requiredList.TRUE))
});

const authRegisterSchema = {
  summary: 'Criar usuário',
  tags: ['Usuários'],
  body: userSchema
    .describe(`<pre><code><b>*name:</b> string
<b>*email:</b> string
<b>picture:</b> string
</code></pre>`),
  headers: apiKeySchema,
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
  tags: ['Usuários'],
  params: z.object({
    email: z.string(genMsgError('email', typeList.STRING, requiredList.TRUE))
      .describe('<pre><code><b>*email:</b> string</code></pre>')
  }),
  response: {
    201: z.object({
      _id: z.string(genMsgError('_id', typeList.STRING, requiredList.TRUE)),
      name: z.string(genMsgError('name', typeList.STRING, requiredList.TRUE)),
      email: z.string(genMsgError('email', typeList.STRING, requiredList.TRUE)),
      picture: z.string(genMsgError('picture', typeList.STRING, requiredList.NULL)).nullish(),
      createdAt: z.date(genMsgError('createdAt', typeList.DATE, requiredList.TRUE))
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
