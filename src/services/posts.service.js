const PostsRepository = require('../repositories/posts.repository.js');
const { Posts, Users, Comments } = require('../models/index.js');
class PostsService {
  postsRepository = new PostsRepository(Posts, Users, Comments);

  createPost = async (UserId, title, content, image) => {
    const createPostData = await this.postsRepository.createPost(
      UserId,
      title,
      content,
      image,
    );

    return true;
  };

  findAllPosts = async () => {
    const allPosts = await this.postsRepository.findAllPosts();

    if (!allPosts) {
      return null;
    } else {
      allPosts.sort((a, b) => {
        return b.id - a.id;
      });

      return allPosts.map((post) => {
        return {
          id: post.id,
          title: post.title,
          likesNum: post.dataValues.likePostId.length,
          commentsNum: post.dataValues.Comments.length,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          User: post.dataValues.User,
        };
      });
    }
  };

  findPostById = async (postId) => {
    const findPost = await this.postsRepository.findPostById(postId);

    if (!findPost) {
      return null;
    } else {
      return {
        id: findPost.id,
        title: findPost.title,
        content: findPost.content,
        image: findPost.image,
        likesNum: findPost.dataValues.likePostId.length,
        commentsNum: findPost.dataValues.Comments.length,
        createdAt: findPost.createdAt,
        updatedAt: findPost.updatedAt,
        User: findPost.dataValues.User,
      };
    }
  };

  updatePost = async (postId, title, content) => {
    await this.postsRepository.updatePost(postId, title, content);

    return true;
  };

  deletePost = async (postId) => {
    await this.postsRepository.deletePost(postId);

    return true;
  };
}

module.exports = PostsService;
