import { z } from 'zod';

import { genMsgError, Required, Type } from '../helpers/genMsgError';

const errorSchema = z.object({
  error: z.boolean(genMsgError('error', Type.BOOLEAN, Required.TRUE)),
  message: z.string(genMsgError('message', Type.STRING, Required.TRUE)),
  statusCode: z.number(genMsgError('statusCode', Type.NUMBER, Required.TRUE))
})
  .describe(`<pre><code><b>*error:</b> boolean
<b>*message:</b> string
<b>*statusCode:</b> number
</code></pre>`);

const userIdSchema = z.object({
  userId: z.string(genMsgError('userId', Type.STRING, Required.TRUE))
    .describe('<pre><code><b>*userId:</b> string</code></pre>')
});

const quizIdSchema = z.object({
  quizId: z.string(genMsgError('quizId', Type.STRING, Required.TRUE))
    .describe('<pre><code><b>*quizId:</b> string</code></pre>')
});

const queryPageSchma = z.object({
  page: z.string(genMsgError('page', Type.STRING, Required.TRUE))
    .describe('<pre><code><b>*page:</b> string</code></pre>')
});

export {
  errorSchema,
  userIdSchema,
  quizIdSchema,
  queryPageSchma
};
