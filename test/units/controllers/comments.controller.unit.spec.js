// __tests__/unit/posts.controller.unit.spec.js

const CommentsController = require('../../../src/controllers/comments.controller');
const { ApiError } = require('../../../src/utils/apiError');

let mockCommentService = {
  findAllComments: jest.fn(),
  createComment: jest.fn(),
  updateComment: jest.fn(),
  deleteComment: jest.fn(),
  findOneComment: jest.fn(),
};
let mockRequest = {
  params: jest.fn(),
};
let mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
  locals: jest.fn(),
  send: jest.fn(),
};
let next = jest.fn();
let commentsController = new CommentsController();
commentsController.commentService = mockCommentService;

describe('Layered Architecture Pattern Posts Controller Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    //
    mockResponse.status = jest.fn(() => {
      return mockResponse;
    });
  });

  test('Comments Controller getComments Method by Success', async () => {
    const commentsReturnValue = [
      {
        id: 1,
        content: 'hihi',
        createdAt: '2022-11-13T09:14:04.000Z',
        updatedAt: '2022-11-13T09:14:04.000Z',
        User: {
          id: 1,
          nickname: 'master',
        },
      },
    ];

    mockCommentService.findAllComments = jest.fn(() => commentsReturnValue);

    await commentsController.getComments(mockRequest, mockResponse, next);

    expect(mockCommentService.findAllComments).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      comments: commentsReturnValue,
    });
  });
  test('Comments Controller createComments Method by Success', async () => {
    const createCommentRequest = {
      UserId: 1,
      postId: { postId: 1 },
      content: { content: 'hihi' },
    };

    mockRequest.body = createCommentRequest.content;
    mockRequest.params = createCommentRequest.postId;
    mockResponse.locals.userId = createCommentRequest.UserId;

    await commentsController.createComment(mockRequest, mockResponse, next);

    expect(mockCommentService.createComment).toHaveBeenCalledTimes(1);
    expect(mockCommentService.createComment).toHaveBeenCalledWith(
      createCommentRequest.UserId,
      createCommentRequest.postId.postId,
      createCommentRequest.content.content,
    );
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.send).toHaveBeenCalledWith({
      message: '댓글 등록완료.',
    });
  });
  test('Comments Controller createComments Method by content Error', async () => {
    const createCommentRequest = {
      UserId: 1,
      postId: { postId: 1 },
      content: { content: null },
    };

    mockRequest.body = createCommentRequest.content;
    mockRequest.params = createCommentRequest.postId;
    mockResponse.locals.userId = createCommentRequest.UserId;

    await commentsController.createComment(mockRequest, mockResponse, next);

    expect(mockCommentService.createComment).toHaveBeenCalledTimes(0);

    const err = new ApiError('댓글 내용을 입력해주세요.', 400);
    expect(next).toHaveBeenCalledWith(err);
  });
  test('Comments Controller updateComments Method by Success', async () => {
    const updateCommentRequest = {
      UserId: 1,
      commentId: { commentId: 1 },
      content: { content: 'hihi' },
    };

    const commentReturnValue = {
      id: 1,
      content: 'hihi',
      createdAt: '2022-11-13T09:14:04.000Z',
      updatedAt: '2022-11-13T09:14:04.000Z',
      User: {
        id: 1,
        nickname: 'master',
      },
    };

    mockCommentService.findOneComment = jest.fn(() => commentReturnValue);

    mockRequest.body = updateCommentRequest.content;
    mockRequest.params = updateCommentRequest.commentId;
    mockResponse.locals.userId = updateCommentRequest.UserId;

    await commentsController.updateComment(mockRequest, mockResponse, next);

    expect(mockCommentService.findOneComment).toHaveBeenCalledTimes(1);
    expect(mockCommentService.findOneComment).toHaveBeenCalledWith(
      mockRequest.params.commentId,
    );
    expect(mockCommentService.updateComment).toHaveBeenCalledTimes(1);
    expect(mockCommentService.updateComment).toHaveBeenCalledWith(
      updateCommentRequest.commentId.commentId,
      updateCommentRequest.content.content,
    );
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.send).toHaveBeenCalledWith({
      message: '댓글 수정에 성공하였습니다.',
    });
  });
  test('Comments Controller updateComments Method by content Error ', async () => {
    const updateCommentRequest = {
      UserId: 1,
      commentId: { commentId: 1 },
      content: { content: null },
    };
    const commentReturnValue = {
      id: 1,
      content: 'hihi',
      createdAt: '2022-11-13T09:14:04.000Z',
      updatedAt: '2022-11-13T09:14:04.000Z',
      User: {
        id: 1,
        nickname: 'master',
      },
    };
    mockCommentService.findOneComment = jest.fn(() => commentReturnValue);
    mockRequest.body = updateCommentRequest.content;
    mockRequest.params = updateCommentRequest.commentId;
    mockResponse.locals.userId = updateCommentRequest.UserId;

    await commentsController.updateComment(mockRequest, mockResponse, next);
    expect(mockCommentService.updateComment).toHaveBeenCalledTimes(0);
    const err = new ApiError('댓글 내용을 입력해주세요.', 400);
    expect(next).toHaveBeenCalledWith(err);
  });
  test('Comments Controller updateComments Method by userAuth Error', async () => {
    const updateCommentRequest = {
      UserId: 2,
      commentId: { commentId: 1 },
      content: { content: 'hi' },
    };
    const commentReturnValue = {
      id: 1,
      content: 'hihi',
      createdAt: '2022-11-13T09:14:04.000Z',
      updatedAt: '2022-11-13T09:14:04.000Z',
      User: {
        id: 1,
        nickname: 'master',
      },
    };
    mockCommentService.findOneComment = jest.fn(() => commentReturnValue);
    mockRequest.body = updateCommentRequest.content;
    mockRequest.params = updateCommentRequest.commentId;
    mockResponse.locals.userId = updateCommentRequest.UserId;

    await commentsController.updateComment(mockRequest, mockResponse, next);
    expect(mockCommentService.updateComment).toHaveBeenCalledTimes(0);
    const err = new ApiError('본인의 댓글이 아닙니다.', 400);
    expect(next).toHaveBeenCalledWith(err);
  });
  test('Comments Controller updateComments Method by findOne Error', async () => {
    const updateCommentRequest = {
      UserId: 2,
      commentId: { commentId: 1 },
      content: { content: 'hi' },
    };
    const commentReturnValue = null;
    mockCommentService.findOneComment = jest.fn(() => commentReturnValue);
    mockRequest.body = updateCommentRequest.content;
    mockRequest.params = updateCommentRequest.commentId;
    mockResponse.locals.userId = updateCommentRequest.UserId;

    await commentsController.updateComment(mockRequest, mockResponse, next);
    expect(mockCommentService.updateComment).toHaveBeenCalledTimes(0);
    const err = new ApiError('댓글이 존재하지 않습니다.', 400);
    expect(next).toHaveBeenCalledWith(err);
  });
  test('Comments Controller deleteComments Method by Success', async () => {
    const deleteCommentRequest = {
      UserId: 1,
      commentId: { commentId: 1 },
    };

    const commentReturnValue = {
      id: 1,
      content: 'hihi',
      createdAt: '2022-11-13T09:14:04.000Z',
      updatedAt: '2022-11-13T09:14:04.000Z',
      User: {
        id: 1,
        nickname: 'master',
      },
    };

    mockCommentService.findOneComment = jest.fn(() => commentReturnValue);

    mockRequest.params = deleteCommentRequest.commentId;
    mockResponse.locals.userId = deleteCommentRequest.UserId;

    await commentsController.deleteComment(mockRequest, mockResponse, next);

    expect(mockCommentService.findOneComment).toHaveBeenCalledTimes(1);
    expect(mockCommentService.findOneComment).toHaveBeenCalledWith(
      mockRequest.params.commentId,
    );
    expect(mockCommentService.deleteComment).toHaveBeenCalledTimes(1);
    expect(mockCommentService.deleteComment).toHaveBeenCalledWith(
      deleteCommentRequest.commentId.commentId,
    );
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.send).toHaveBeenCalledWith({
      message: '댓글 삭제에 성공하였습니다.',
    });
  });
  test('Comments Controller deleteComments Method by userAuth Error', async () => {
    const deleteCommentRequest = {
      UserId: 2,
      commentId: { commentId: 1 },
    };
    const commentReturnValue = {
      id: 1,
      content: 'hihi',
      createdAt: '2022-11-13T09:14:04.000Z',
      updatedAt: '2022-11-13T09:14:04.000Z',
      User: {
        id: 1,
        nickname: 'master',
      },
    };
    mockCommentService.findOneComment = jest.fn(() => commentReturnValue);
    mockRequest.params = deleteCommentRequest.commentId;
    mockResponse.locals.userId = deleteCommentRequest.UserId;

    await commentsController.deleteComment(mockRequest, mockResponse, next);
    expect(mockCommentService.deleteComment).toHaveBeenCalledTimes(0);
    const err = new ApiError('본인의 댓글이 아닙니다.', 400);
    expect(next).toHaveBeenCalledWith(err);
  });
  test('Comments Controller deleteComments Method by findOne Error', async () => {
    const deleteCommentRequest = {
      UserId: 2,
      commentId: { commentId: 1 },
    };
    const commentReturnValue = null;
    mockCommentService.findOneComment = jest.fn(() => commentReturnValue);

    mockRequest.params = deleteCommentRequest.commentId;
    mockResponse.locals.userId = deleteCommentRequest.UserId;

    await commentsController.deleteComment(mockRequest, mockResponse, next);
    expect(mockCommentService.deleteComment).toHaveBeenCalledTimes(0);
    const err = new ApiError('댓글이 존재하지 않습니다.', 400);
    expect(next).toHaveBeenCalledWith(err);
  });
});
