class PostsRepository {
  constructor(PostsModel, UsersModel, CommentsModel) {
    this.postsModel = PostsModel;
    this.usersModel = UsersModel;
    this.commentsModel = CommentsModel;
  }

  createPost = async (UserId, title, content, image) => {
    await this.postsModel.create({
      UserId,
      title,
      content,
      image,
    });
    return true;
  };

  findAllPosts = async () => {
    const posts = await this.postsModel.findAll({
      attributes: ['id', 'title', 'createdAt', 'updatedAt'],
      include: [
        {
          model: this.usersModel,
          as: 'User', // Users로부터 hasMany - belongsTo로 가져와서 단수로 써줘야함
          attributes: ['id', 'nickname'],
        },
        { model: this.usersModel, as: 'likePostId', attributes: ['id'] },
        { model: this.commentsModel, as: 'Comments', attributes: ['PostId'] }, // Comments가 belongsTo여서 Comments로 써야함
      ],
    });
    return posts;
  };

  findPostById = async (postId) => {
    const post = await this.postsModel.findOne({
      where: { id: postId },
      attributes: ['id', 'title', 'content', 'image', 'createdAt', 'updatedAt'],
      include: [
        {
          model: this.usersModel,
          as: 'User', // Users로부터 hasMany - belongsTo로 가져와서 단수로 써줘야함
          attributes: ['id', 'nickname'],
        },
        { model: this.usersModel, as: 'likePostId', attributes: ['id'] },
        { model: this.commentsModel, as: 'Comments', attributes: ['PostId'] }, // Comments가 belongsTo여서 Comments로 써야함
      ],
    });

    return post;
  };

  updatePost = async (postId, title, content) => {
    await this.postsModel.update({ title, content }, { where: { id: postId } });

    return true;
  };

  deletePost = async (postId) => {
    await this.postsModel.destroy({ where: { id: postId } });

    return true;
  };
}

module.exports = PostsRepository;
