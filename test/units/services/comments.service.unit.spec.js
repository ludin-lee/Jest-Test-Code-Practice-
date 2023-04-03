// __tests__/unit/posts.service.unit.spec.js

const CommentService = require('../../../src/services/comments.service');

let mockCommentsRepository = {
  findAllComments: jest.fn(),
  createComment: jest.fn(),
  updateComment: jest.fn(),
  deleteComment: jest.fn(),
  findOneComment: jest.fn(),
};

let commentService = new CommentService();

commentService.commentRepository = mockCommentsRepository;

describe('Layered Architecture Pattern Comments Service Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Comments Service findAllComment Method', async () => {
    const findAllCommentReturnValue = [
      {
        id: 1,
        content: '댓글 테스트',
        createdAt: '2022-11-13T09:14:04.000Z',
        updatedAt: '2022-12-13T09:14:04.000Z',
        User: {
          id: 1,
          nickname: 'testnickname 1',
        },
      },
      {
        id: 2,
        content: '댓글 테스트',
        createdAt: '2022-12-13T09:14:04.000Z',
        updatedAt: '2022-12-13T09:14:04.000Z',
        User: {
          id: 2,
          nickname: 'testnickname 2',
        },
      },
    ];

    mockCommentsRepository.findAllComments = jest.fn(() => {
      return findAllCommentReturnValue;
    });

    const allComment = await commentService.findAllComments();

    expect(allComment).toEqual(
      findAllCommentReturnValue.sort((a, b) => {
        return b.createdAt - a.createdAt;
      }),
    );

    expect(mockCommentsRepository.findAllComments).toHaveBeenCalledTimes(1);
    expect(allComment).toEqual(findAllCommentReturnValue);
  });

  test('Comments Service createComment Method By Success', async () => {
    mockCommentsRepository.createComment = jest.fn(() => {
      return [{ commnetId: 1 }, { postId: 1 }, { content: 'hihi' }];
    });

    const createCommentData = await commentService.createComment(1, 1, 'hihi');

    expect(mockCommentsRepository.createComment).toHaveBeenCalledTimes(1);
    expect(createCommentData).toEqual([
      { commnetId: 1 },
      { postId: 1 },
      { content: 'hihi' },
    ]);
    expect(mockCommentsRepository.createComment).toHaveBeenCalledWith(
      1,
      1,
      'hihi',
    );
  });
  test('Comments Service updateComment Method By Success', async () => {
    mockCommentsRepository.updateComment = jest.fn(() => {
      return [{ commentId: 1 }];
    });

    const updateCommentData = await commentService.updateComment();

    expect(mockCommentsRepository.updateComment).toHaveBeenCalledTimes(1);
    expect(updateCommentData).toEqual([
      {
        commentId: 1,
      },
    ]);
  });

  test('Comments Service deleteComment Method By Success', async () => {
    mockCommentsRepository.deleteComment = jest.fn(() => {
      return [{ commentId: 1 }];
    });

    const deleteCommentData = await commentService.deleteComment();

    expect(mockCommentsRepository.deleteComment).toHaveBeenCalledTimes(1);
    expect(deleteCommentData).toEqual([
      {
        commentId: 1,
      },
    ]);
  });
  test('Comments Service findOneComment Method', async () => {
    const findOneCommentReturnValue = [
      {
        id: 1,
        content: '댓글 테스트',
        createdAt: '2022-11-13T09:14:04.000Z',
        updatedAt: '2022-12-13T09:14:04.000Z',
        User: {
          id: 1,
          nickname: 'testnickname 1',
        },
      },
    ];

    mockCommentsRepository.findOneComment = jest.fn(() => {
      return findOneCommentReturnValue;
    });

    const Comment = await commentService.findOneComment(1);

    expect(mockCommentsRepository.findOneComment).toHaveBeenCalledTimes(1);
    expect(mockCommentsRepository.findOneComment).toHaveBeenCalledWith(1);
    expect(Comment).toEqual(findOneCommentReturnValue);
  });
});
