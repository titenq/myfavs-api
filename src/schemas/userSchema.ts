import { z } from 'zod';

import { genMsgError, Required, Type } from '@/helpers/genMsgError';
import { _idSchema, errorSchema } from '@/schemas/sharedSchema';

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

export {
  userGetByEmailSchema
};
