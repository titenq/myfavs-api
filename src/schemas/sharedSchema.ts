import { isValidObjectId } from 'mongoose';
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

const _idSchema = z.string(genMsgError('_id', Type.STRING, Required.TRUE))
  .refine(id => isValidObjectId(id), {
  message: '_id inválido',
});

const userIdSchema = z.object({
  userId: z.string(genMsgError('userId', Type.STRING, Required.TRUE))
    .describe('<pre><code><b>*userId:</b> string</code></pre>')
});

const quizIdSchema = z.object({
  quizId: z.string(genMsgError('quizId', Type.STRING, Required.TRUE))
    .describe('<pre><code><b>*quizId:</b> string</code></pre>')
});

const queryPageSchema = z.object({
  page: z.string(genMsgError('page', Type.STRING, Required.TRUE))
    .describe('<pre><code><b>*page:</b> string</code></pre>')
});

const passwordSchema = () => {
  return z.string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .refine(password => /[A-Z]/.test(password), 'A senha deve conter pelo menos uma letra maiúscula')
    .refine(password => /[a-z]/.test(password), 'A senha deve conter pelo menos uma letra minúscula')
    .refine(password => /\d/.test(password), 'A senha deve conter pelo menos um número')
    .refine(password => /[@$!%*?&]/.test(password), 'A senha deve conter pelo menos um caractere especial');
};

export {
  errorSchema,
  _idSchema,
  userIdSchema,
  quizIdSchema,
  queryPageSchema,
  passwordSchema
};
