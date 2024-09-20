import mongoose from '@/db';

const LinkSchema = new mongoose.Schema({
  url: {
    type: String,
    // required: true
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
}, { _id: false });

const FolderSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true
  },
  links: {
    type: [LinkSchema],
    default: []
  },
  subfolders: {
    type: [this],
    default: []
  }
}, { _id: false });

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
