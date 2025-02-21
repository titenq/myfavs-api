import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

import { genMsgError, Required, Type } from '@/helpers/genMsgError';

const errorSchema = z.object({
  error: z.boolean(genMsgError('error', Type.BOOLEAN, Required.TRUE)),
  message: z.string(genMsgError('message', Type.STRING, Required.TRUE)),
  statusCode: z.number(genMsgError('statusCode', Type.NUMBER, Required.TRUE))
})
  .describe(`<pre><code><b>*error:</b> boolean
<b>*message:</b> string
<b>*statusCode:</b> number
</code></pre>`);

const _idSchema = z.string(genMsgError('_id', Type.STRING, Required.TRUE))
  .refine(id => isValidObjectId(id), {
    message: '_id inválido',
  });

const userIdSchema = z.object({
  userId: z.string(genMsgError('userId', Type.STRING, Required.TRUE))
    .describe('<pre><code><b>*userId:</b> string</code></pre>')
});

export {
  errorSchema,
  _idSchema,
  userIdSchema
};
