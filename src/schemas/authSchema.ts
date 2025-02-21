import { z } from 'zod';

import { genMsgError, Required, Type } from '../helpers/genMsgError';
import { errorSchema } from '../schemas/sharedSchema';

const passwordSchema = () => {
  return z.string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .refine(password => /[A-Z]/.test(password), 'A senha deve conter pelo menos uma letra maiúscula')
    .refine(password => /[a-z]/.test(password), 'A senha deve conter pelo menos uma letra minúscula')
    .refine(password => /\d/.test(password), 'A senha deve conter pelo menos um número')
    .refine(password => /[@$!%*?&]/.test(password), 'A senha deve conter pelo menos um caractere especial');
};

const userResponseSchema = z.object({
  _id: z.instanceof(Object).transform(id => id.toString()),
  name: z.string(genMsgError('name', Type.STRING, Required.TRUE)),
  email: z.string(genMsgError('email', Type.STRING, Required.TRUE)),
  createdAt: z.date(genMsgError('createdAt', Type.DATE, Required.NULL))
});

const authRegisterSchema = {
  summary: 'Registrar usuário',
  tags: ['auth'],
  headers: z.object({
    'x-recaptcha-token': z.string(genMsgError('x-recaptcha-token', Type.STRING, Required.TRUE))
      .describe(`<pre><code><b>*x-recaptcha-token:</b> string</code></pre>`),
  }),
  body: z.object({
    name: z.string(genMsgError('name', Type.STRING, Required.TRUE))
      .min(3, genMsgError('name', Type.MIN, Required.NULL, '3'))
      .max(10, genMsgError('name', Type.MAX, Required.NULL, '10'))
      .refine(name => /^[a-z0-9_-]+$/.test(name), 'O nome de usuário deve conter apenas letras minúsculas, números, hífens (-) ou underscores (_)'),
    email: z.string(genMsgError('email', Type.STRING, Required.TRUE))
      .email(genMsgError('email', Type.EMAIL, Required.NULL)),
    password: passwordSchema()
  })
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
    409: errorSchema,
    500: errorSchema
  }
};

const authLoginSchema = {
  summary: 'Login',
  tags: ['auth'],
  headers: z.object({
    'x-recaptcha-token': z.string(genMsgError('x-recaptcha-token', Type.STRING, Required.TRUE))
      .describe(`<pre><code><b>*x-recaptcha-token:</b> string</code></pre>`),
  }),
  body: z.object({
    email: z.string(genMsgError('email', Type.STRING, Required.TRUE)),
    password: passwordSchema()
  })
    .describe(`<pre><code><b>*email:</b> string
<b>*password:</b> string
</code></pre>`),
  response: {
    200: z.object({
      _id: z.instanceof(Object).transform(id => id.toString()),
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
    400: errorSchema,
    401: errorSchema,
    404: errorSchema
  }
};

const authVerifyEmailSchema = {
  summary: 'Verificar e-mail',
  tags: ['auth'],
  body: z.object({
    token: z.string(genMsgError('token', Type.STRING, Required.TRUE))
  })
    .describe(`<pre><code><b>*token:</b> string
</code></pre>`),
  response: {
    200: z.object({
      _id: z.instanceof(Object).transform(id => id.toString()),
      name: z.string(genMsgError('name', Type.STRING, Required.TRUE)),
      email: z.string(genMsgError('email', Type.STRING, Required.TRUE)),
      createdAt: z.date(genMsgError('createdAt', Type.DATE, Required.NULL))
    })
      .describe(`<pre><code><b>*_id:</b> string
<b>*name:</b> string
<b>*email:</b> string
<b>*createdAt:</b> Date
</code></pre>`),
    400: errorSchema,
    401: errorSchema
  }
};

const authResendLinkSchema = {
  summary: 'Reenviar link',
  tags: ['auth'],
  body: z.object({
    email: z.string(genMsgError('email', Type.STRING, Required.TRUE))
  })
    .describe(`<pre><code><b>*email:</b> string
</code></pre>`),
  response: {
    200: z.object({
      message: z.string(genMsgError('message', Type.STRING, Required.TRUE))
    })
      .describe(`<pre><code><b>*message:</b> string
</code></pre>`),
    400: errorSchema,
    404: errorSchema
  }
};

const authForgotPasswordSchema = {
  summary: 'Esqueci a senha',
  tags: ['auth'],
  headers: z.object({
    'x-recaptcha-token': z.string(genMsgError('x-recaptcha-token', Type.STRING, Required.TRUE))
      .describe(`<pre><code><b>*x-recaptcha-token:</b> string</code></pre>`),
  }),
  body: z.object({
    email: z.string(genMsgError('email', Type.STRING, Required.TRUE)),
  })
    .describe(`<pre><code><b>*email:</b> string</code></pre>`),
  response: {
    200: z.object({
      message: z.string(genMsgError('message', Type.STRING, Required.TRUE))
    })
      .describe(`<pre><code><b>*message:</b> string
</code></pre>`),
    400: errorSchema,
    404: errorSchema
  }
};

const authResetPasswordSchema = {
  summary: 'Resetar senha',
  tags: ['auth'],
  body: z.object({
    token: z.string(genMsgError('token', Type.STRING, Required.TRUE)),
    password: z.string(genMsgError('password', Type.STRING, Required.TRUE))
  })
    .describe(`<pre><code><b>*token:</b> string
<b>*password:</b> string
</code></pre>`),
  response: {
    200: z.object({
      message: z.string(genMsgError('message', Type.STRING, Required.TRUE))
    })
      .describe(`<pre><code><b>*message:</b> string
</code></pre>`),
    400: errorSchema,
    401: errorSchema,
    404: errorSchema
  }
};

export {
  authRegisterSchema,
  authLoginSchema,
  authVerifyEmailSchema,
  authResendLinkSchema,
  authForgotPasswordSchema,
  authResetPasswordSchema
};
