import { z } from 'zod';

import { genMsgError, Required, Type } from 'src/helpers/genMsgError';
import { errorSchema } from 'src/schemas/sharedSchema';

const usersLinksSchema = z.object({
  name: z.string(genMsgError('name', Type.STRING, Required.TRUE)),
  qtdLinks: z.number(genMsgError('qtdLinks', Type.NONNEGATIVE, Required.TRUE))
})
  .describe(`<pre><code><b>*name:</b> string
<b>*qtdLinks:</b> number
</code></pre>`);

const userGetByIdSchema = {
  summary: 'Buscar usuário por id',
  tags: ['users'],
  params: z.object({
    userId: z.string(genMsgError('userId', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*userId:</b> string</code></pre>')
  }),
  response: {
    201: z.object({
      _id: z.string(genMsgError('_id', Type.STRING, Required.TRUE)),
      name: z.string(genMsgError('name', Type.STRING, Required.TRUE)),
      email: z.string(genMsgError('email', Type.STRING, Required.TRUE)),
      picture: z.string(genMsgError('picture', Type.STRING, Required.FALSE)).nullish(),
      createdAt: z.date(genMsgError('createdAt', Type.DATE, Required.NULL))
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
      picture: z.string(genMsgError('picture', Type.STRING, Required.FALSE)).nullish(),
      createdAt: z.date(genMsgError('createdAt', Type.DATE, Required.NULL))
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

const userGetSchema = {
  summary: 'Buscar usuários',
  tags: ['users'],
  response: {
    200: z.array(usersLinksSchema),
    400: errorSchema,
    404: errorSchema
  }
};

export {
  userGetByIdSchema,
  userGetByEmailSchema,
  userGetSchema
};
