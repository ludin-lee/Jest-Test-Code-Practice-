const CommentRepository = require('../../../src/repositories/comments.repository');

let mockCommentsModel = {
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
  findOne: jest.fn(),
};

let commentRepository = new CommentRepository(mockCommentsModel);

describe('Layered Architecture Pattern Comments Repository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Comments Repository findAllComments Method', async () => {
    mockCommentsModel.findAll = jest.fn(() => {
      return [
        {
          commentId: 1,
        },
      ];
    });
    const postId = 'findAllPostId';
    const comments = await commentRepository.findAllComments(postId);

    expect(commentRepository.commentsModel.findAll).toHaveBeenCalledTimes(1);
    expect(comments).toEqual([
      {
        commentId: 1,
      },
    ]);
  });

  test('Comments Repository createComment Method', async () => {
    mockCommentsModel.create = jest.fn(() => {
      return 'create Return String';
    });

    const createCommentParams = {
      content: 'createCommentContent',
      userId: 'createCommentUserId',
      postId: 'createCommentPostId',
    };

    const createCommentData = await commentRepository.createComment(
      createCommentParams.userId,
      createCommentParams.postId,
      createCommentParams.content,
    );

    expect(createCommentData).toBe('create Return String');
    expect(mockCommentsModel.create).toHaveBeenCalledTimes(1);
  });

  test('Comments Repository updateComment Method', async () => {
    mockCommentsModel.update = jest.fn(() => {
      return 'update Return String';
    });
    const updateCommentParams = {
      content: 'updateCommentContent',
      commentId: 'updateCommentCommentId',
    };

    const updateCommentData = await commentRepository.updateComment(
      updateCommentParams.commentId,
      updateCommentParams.content,
    );

    expect(updateCommentData).toBe('update Return String');
    expect(mockCommentsModel.update).toHaveBeenCalledTimes(1);
  });

  test('Comments Repository deleteComment Method', async () => {
    mockCommentsModel.destroy = jest.fn(() => {
      return 'delete Return String';
    });

    const deleteCommentParams = 'deleteCommentCommentId';

    const deleteCommentData = await commentRepository.deleteComment();

    expect(deleteCommentData).toBe('delete Return String');
    expect(mockCommentsModel.destroy).toHaveBeenCalledTimes(1);
  });
  test('Comments Repository findOneComment Method', async () => {
    mockCommentsModel.findOne = jest.fn(() => {
      return [{ commentId: 1 }];
    });
    const commentId = 'findOneCommentId';
    const comment = await commentRepository.findOneComment(commentId);

    expect(commentRepository.commentsModel.findOne).toHaveBeenCalledTimes(1);
    expect(comment).toEqual([{ commentId: 1 }]);
  });
});
