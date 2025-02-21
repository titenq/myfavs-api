import mongoose from 'src/db';

const LinkSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  picture: {
    type: String
  },
  description: {
    type: String
  },
  isPrivate: {
    type: Boolean,
    default: false
  }
});

const FolderSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  links: {
    type: [LinkSchema],
    default: []
  },
  subfolders: {
    type: [this],
    default: []
  }
});

const UserFolderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  folders: {
    type: [FolderSchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'userFolders' });

const UserFolderModel = mongoose.model('UserFolder', UserFolderSchema);

export default UserFolderModel;
