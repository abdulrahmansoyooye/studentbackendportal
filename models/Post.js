import mongoose from "mongoose";
const PostShema = new mongoose.Schema(
  {
    userId: {
      type: String,
      reuired: true,
    },
    firstName: {
      type: String,
      reuired: true,
    },
    lastName: {
      type: String,
      reuired: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    comment: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostShema);
export default Post;
