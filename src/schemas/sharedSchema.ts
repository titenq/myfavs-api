import { z } from 'zod';

import { genMsgError, requiredList, typeList } from '../helpers/genMsgError.js';

const errorSchema = z.object({
  error: z.boolean(genMsgError('error', typeList.BOOLEAN, requiredList.TRUE)),
  message: z.string(genMsgError('message', typeList.STRING, requiredList.TRUE)),
  statusCode: z.number(genMsgError('statusCode', typeList.NUMBER, requiredList.TRUE))
})
  .describe(`<pre><code><b>*error:</b> boolean
<b>*message:</b> string
<b>*statusCode:</b> number
</code></pre>`);

const apiKeySchema = z.object({
  api_key: z.string(genMsgError('api_key', typeList.STRING, requiredList.TRUE))
    .describe('<pre><code><b>*api_key:</b> string</code></pre>')
});

const userIdSchema = z.object({
  userId: z.string(genMsgError('userId', typeList.STRING, requiredList.TRUE))
    .describe('<pre><code><b>*userId:</b> string</code></pre>')
});

const quizIdSchema = z.object({
  quizId: z.string(genMsgError('quizId', typeList.STRING, requiredList.TRUE))
    .describe('<pre><code><b>*quizId:</b> string</code></pre>')
});

const queryPageSchma = z.object({
  page: z.string(genMsgError('page', typeList.STRING, requiredList.TRUE))
    .describe('<pre><code><b>*page:</b> string</code></pre>')
});

export {
  errorSchema,
  apiKeySchema,
  userIdSchema,
  quizIdSchema,
  queryPageSchma
};
