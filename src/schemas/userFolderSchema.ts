import { z } from 'zod';

import { genMsgError, Required, Type } from '@/helpers/genMsgError';
import { _idSchema, errorSchema } from '@/schemas/sharedSchema';
import { IFolder } from '@/interfaces/userFolderInterface';

const linksSchema = z.object({
  url: z.string(genMsgError('url', Type.STRING, Required.TRUE)),
  picture: z.string(genMsgError('picture', Type.STRING, Required.FALSE))
    .nullish(),
  description: z.string(genMsgError('description', Type.STRING, Required.FALSE))
    .max(64, genMsgError('description', Type.MAX, Required.NULL, '64'))
    .nullish(),
  isPrivate: z.boolean(genMsgError('isPrivate', Type.BOOLEAN, Required.TRUE))
});

const folderSchema: z.ZodType<IFolder> = z.lazy(() => z.object({
  _id: _idSchema,
  name: z.string(genMsgError('name', Type.STRING, Required.TRUE))
    .min(1, genMsgError('name', Type.MIN, Required.NULL, '1'))
    .max(16, genMsgError('name', Type.MAX, Required.NULL, '16')),
  links: z.array(linksSchema)
    .nullish(),
  subfolders: z.array(folderSchema)
    .nullish()
}));

const userFoldersGetByUserIdSchema = {
  summary: 'Buscar pastas do usuário',
  tags: ['userFolder'],
  params: z.object({
    userId: z.string(genMsgError('userId', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*userId:</b> string</code></pre>')
  }),
  response: {
    201: z.object({
      _id: _idSchema,
      userId: z.string(genMsgError('name', Type.STRING, Required.TRUE)),
      folders: z.array(folderSchema),
      createdAt: z.date(genMsgError('createdAt', Type.DATE, Required.NULL))
    })
      .describe(`<pre><code><b>*_id:</b> string
<b>*userId:</b> string
<b>folders:</b> [
  <b>*name:</b> string (min: 1, max: 16)
  <b>links:</b> [
    <b>*url:</b> string
    <b>picture:</b> string
    <b>description:</b> string (max: 64)
    <b>*isPrivate:</b> boolean (default: false)
  ]
  <b>subfolders:</b> [
    Folder
  ]
]
<b>*createdAt:</b> Date
</code></pre>`),
    400: errorSchema,
    404: errorSchema
  }
};

const createFolderSchema = {
  summary: 'Criar pasta',
  tags: ['userFolder'],
  params: z.object({
    userId: z.string(genMsgError('userId', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*userId:</b> string</code></pre>')
  }),
  body: z.object({
    folderName: z.string(genMsgError('folderName', Type.STRING, Required.TRUE))
      .min(1, genMsgError('folderName', Type.MIN, Required.NULL, '1'))
      .max(16, genMsgError('folderName', Type.MAX, Required.NULL, '16'))
      .describe('<pre><code><b>*folderName:</b> string (min: 1, max: 16)</code></pre>')
  }),
  response: {
    204: z.null(),
    400: errorSchema,
    404: errorSchema
  }
};

const createLinkSchema = {
  summary: 'Criar link',
  tags: ['userFolder'],
  params: z.object({
    userId: z.string(genMsgError('userId', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*userId:</b> string</code></pre>'),
    folderId: z.string(genMsgError('folderId', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*folderId:</b> string</code></pre>')
  }),
  body: z.object({
    url: z.string(genMsgError('url', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*url:</b> string</code></pre>'),
    description: z.string(genMsgError('description', Type.STRING, Required.FALSE))
      .max(64, genMsgError('description', Type.MAX, Required.NULL, '64'))
      .describe('<pre><code><b>description:</b> string (max: 64)</code></pre>')
      .nullish(),
    isPrivate: z.boolean(genMsgError('isPrivate', Type.BOOLEAN, Required.TRUE))
      .describe('<pre><code><b>*isPrivate:</b> boolean (default: false)</code></pre>')
  }),
  response: {
    204: z.null(),
    400: errorSchema,
    403: errorSchema,
    404: errorSchema
  }
};

const createSubfolderSchema = {
  summary: 'Criar subpasta',
  tags: ['userFolder'],
  params: z.object({
    userId: z.string(genMsgError('userId', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*userId:</b> string</code></pre>'),
    folderId: z.string(genMsgError('folderId', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*folderId:</b> string</code></pre>')
  }),
  body: z.object({
    subfolderName: z.string(genMsgError('subfolderName', Type.STRING, Required.TRUE))
      .min(1, genMsgError('subfolderName', Type.MIN, Required.NULL, '1'))
      .max(16, genMsgError('subfolderName', Type.MAX, Required.NULL, '16'))
      .describe('<pre><code><b>*subfolderName:</b> string (min: 1, max: 16)</code></pre>')
  }),
  response: {
    204: z.null(),
    400: errorSchema,
    403: errorSchema,
    404: errorSchema
  }
};

const createLinkSubfolderSchema = {
  summary: 'Criar link',
  tags: ['userFolder'],
  params: z.object({
    userId: z.string(genMsgError('userId', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*userId:</b> string</code></pre>'),
    folderId: z.string(genMsgError('folderId', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*folderId:</b> string</code></pre>'),
    subfolderName: z.string(genMsgError('subfolderName', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*subfolderName:</b> string</code></pre>')
  }),
  body: z.object({
    url: z.string(genMsgError('url', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*url:</b> string</code></pre>'),
    description: z.string(genMsgError('description', Type.STRING, Required.FALSE))
      .max(64, genMsgError('description', Type.MAX, Required.NULL, '64'))
      .describe('<pre><code><b>description:</b> string (max: 64)</code></pre>')
      .nullish(),
    isPrivate: z.boolean(genMsgError('isPrivate', Type.BOOLEAN, Required.TRUE))
      .describe('<pre><code><b>*isPrivate:</b> boolean (default: false)</code></pre>')
  }),
  response: {
    200: z.object({
      picture: z.string(genMsgError('picture', Type.STRING, Required.TRUE))
        .describe('<pre><code><b>*picture:</b> string</code></pre>')
    }),
    400: errorSchema,
    403: errorSchema,
    404: errorSchema
  }
};

const deleteLinkSchema = {
  summary: 'Deletar link',
  tags: ['userFolder'],
  params: z.object({
    userId: z.string(genMsgError('userId', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*userId:</b> string</code></pre>')
  }),
  body: z.object({
    folderId: z.string(genMsgError('folderId', Type.STRING, Required.TRUE))
      .nullable()
      .describe('<pre><code><b>folderId:</b> string | null</code></pre>'),
    subfolderName: z.string(genMsgError('subfolderName', Type.STRING, Required.TRUE))
      .nullable()
      .describe('<pre><code><b>subfolderName:</b> string | null</code></pre>'),
    linkId: z.string(genMsgError('linkId', Type.STRING, Required.TRUE))
      .nullable()
      .describe('<pre><code><b>linkId:</b> string | null</code></pre>'),
    linkUrl: z.string(genMsgError('linkUrl', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>linkUrl:</b> string</code></pre>'),
    linkPicture: z.string(genMsgError('linkPicture', Type.STRING, Required.TRUE))
      .nullable()
      .describe('<pre><code><b>linkPicture:</b> string | null</code></pre>')
  }),  response: {
    200: z.object({
      picture: z.string(genMsgError('picture', Type.STRING, Required.TRUE))
        .describe('<pre><code><b>*picture:</b> string</code></pre>')
    }),
    400: errorSchema,
    403: errorSchema,
    404: errorSchema
  }
};

const editFolderSchema = {
  summary: 'Editar nome da pasta',
  tags: ['userFolder'],
  params: z.object({
    userId: z.string(genMsgError('userId', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*userId:</b> string</code></pre>')
  }),
  body: z.object({
    editFolderId: z.string(genMsgError('editFolderId', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*editFolderId:</b> string</code></pre>'),
    editFolderName: z.string(genMsgError('editFolderName', Type.STRING, Required.TRUE))
      .min(1, genMsgError('editFolderName', Type.MIN, Required.NULL, '1'))
      .max(16, genMsgError('editFolderName', Type.MAX, Required.NULL, '16'))
      .describe('<pre><code><b>*editFolderName:</b> string (min: 1, max: 16)</code></pre>')
  }),
  response: {
    204: z.null(),
    400: errorSchema,
    403: errorSchema,
    404: errorSchema
  }
};

const deleteFolderSchema = {
  summary: 'Deletar pasta',
  tags: ['userFolder'],
  params: z.object({
    userId: z.string(genMsgError('userId', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*userId:</b> string</code></pre>')
  }),
  body: z.object({
    deleteFolderId: z.string(genMsgError('deleteFolderId', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*deleteFolderId:</b> string</code></pre>')
  }),
  response: {
    204: z.null(),
    400: errorSchema,
    403: errorSchema,
    404: errorSchema
  }
};

const editSubfolderSchema = {
  summary: 'Editar nome da subpasta',
  tags: ['userFolder'],
  params: z.object({
    userId: z.string(genMsgError('userId', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*userId:</b> string</code></pre>'),
    editOldSubfolderName: z.string(genMsgError('editOldSubfolderName', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*editOldSubfolderName:</b> string</code></pre>'),
  }),
  body: z.object({
    editFolderId: z.string(genMsgError('editFolderId', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*editFolderId:</b> string</code></pre>'),
    editSubfolderName: z.string(genMsgError('editSubfolderName', Type.STRING, Required.TRUE))
      .min(1, genMsgError('editSubfolderName', Type.MIN, Required.NULL, '1'))
      .max(16, genMsgError('editSubfolderName', Type.MAX, Required.NULL, '16'))
      .describe('<pre><code><b>*editSubfolderName:</b> string (min: 1, max: 16)</code></pre>')
  }),
  response: {
    204: z.null(),
    400: errorSchema,
    403: errorSchema,
    404: errorSchema
  }
};

const deleteSubfolderSchema = {
  summary: 'Deletar subpasta',
  tags: ['userFolder'],
  params: z.object({
    userId: z.string(genMsgError('userId', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*userId:</b> string</code></pre>')
  }),
  body: z.object({
    deleteFolderId: z.string(genMsgError('deleteFolderId', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*deleteFolderId:</b> string</code></pre>'),
    deleteSubfolderName: z.string(genMsgError('deleteSubfolderName', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*deleteSubfolderName:</b> string</code></pre>')
  }),
  response: {
    204: z.null(),
    400: errorSchema,
    403: errorSchema,
    404: errorSchema
  }
};

const userPublicFoldersGetByUsernameSchema = {
  summary: 'Buscar pastas com links públicos de um usuário',
  tags: ['userFolder'],
  params: z.object({
    username: z.string(genMsgError('username', Type.STRING, Required.TRUE))
      .describe('<pre><code><b>*username:</b> string</code></pre>')
  }),
  response: {
    201: z.object({
      _id: _idSchema,
      userId: z.string(genMsgError('name', Type.STRING, Required.TRUE)),
      folders: z.array(folderSchema),
      createdAt: z.date(genMsgError('createdAt', Type.DATE, Required.NULL))
    })
      .describe(`<pre><code><b>*_id:</b> string
<b>*userId:</b> string
<b>folders:</b> [
  <b>*name:</b> string (min: 1, max: 16)
  <b>links:</b> [
    <b>*url:</b> string
    <b>picture:</b> string
    <b>description:</b> string (max: 64)
    <b>*isPrivate:</b> boolean (default: false)
  ]
  <b>subfolders:</b> [
    Folder
  ]
]
<b>*createdAt:</b> Date
</code></pre>`),
    400: errorSchema,
    404: errorSchema
  }
};

export {
  userFoldersGetByUserIdSchema,
  createFolderSchema,
  createLinkSchema,
  createSubfolderSchema,
  createLinkSubfolderSchema,
  deleteLinkSchema,
  editFolderSchema,
  deleteFolderSchema,
  editSubfolderSchema,
  deleteSubfolderSchema,
  userPublicFoldersGetByUsernameSchema
};
