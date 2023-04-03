// __tests__/integration/posts.integration.spec.js

const supertest = require('supertest');
const app = require('../../src/app');
const PostsController = require('../../src/controllers/posts.controller');
const { Comments } = require('../../src/models/index');
const { Posts } = require('../../src/models/index');
const { ApiError } = require('../../src/utils/apiError');

beforeAll(async () => {
  if (process.env.NODE_ENV === 'test') {
    await Comments.destroy({ where: {} });
    await Posts.destroy({ where: {} });
  } else throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
});

describe('Layered Architecture Pattern, Posts Domain Integration Test', () => {
  test('POST /posts/:postId/comments API (createComment) 성공', async () => {
    const superUserInfo = {
      email: 'test@naver.com',
      nickname: 'tester',
      password: '1234',
      confirm: '1234',
    };
    const superUserlogin = {
      email: 'test@naver.com',
      password: '1234',
    };
    await supertest(app).post('/auth/register').send(superUserInfo); //회원가입
    const login = await supertest(app).post('/auth/login').send(superUserlogin); //로그인

    const accessToken = 'Bearer ' + JSON.parse(login.text).accessToken;

    await supertest(app)
      .post('/posts')
      .send({
        //글 만들기
        title: '제목',
        content: '테스트내용',
      })
      .set('authorization', accessToken);

    const postInfo = await supertest(app).get(`/posts`).send(); //글 조회

    const createCommentRequestBody = {
      content: 'content_success',
    };

    const response = await supertest(app)
      .post(`/posts/${postInfo.body.posts[0].id}/comments`)
      .send(createCommentRequestBody)
      .set('authorization', accessToken);

    expect(response.status).toEqual(201);
    expect(response.body).toMatchObject({ message: '댓글 등록완료.' });
  });
  test('POST /posts/:postId/comments API (createComment) 댓글 내용 없음 에러', async () => {
    const superUserInfo = {
      email: 'test@naver.com',
      nickname: 'tester',
      password: '1234',
      confirm: '1234',
    };
    const superUserlogin = {
      email: 'test@naver.com',
      password: '1234',
    };
    await supertest(app).post('/auth/register').send(superUserInfo); //회원가입
    const login = await supertest(app).post('/auth/login').send(superUserlogin); //로그인

    const accessToken = 'Bearer ' + JSON.parse(login.text).accessToken;

    await supertest(app)
      .post('/posts')
      .send({
        //글 만들기
        title: '제목',
        content: '테스트내용',
      })
      .set('authorization', accessToken);

    const postInfo = await supertest(app).get(`/posts`).send(); //글 조회

    const createCommentRequestBody = {
      content: null,
    };

    const response = await supertest(app)
      .post(`/posts/${postInfo.body.posts[0].id}/comments`)
      .send(createCommentRequestBody)
      .set('authorization', accessToken);

    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      errorMessage: '댓글 내용을 입력해주세요.',
    });
  });

  test('GET /posts/:postId/comments API (ReadComment) 성공', async () => {
    const superUserInfo = {
      email: 'test@naver.com',
      nickname: 'tester',
      password: '1234',
      confirm: '1234',
    };
    const superUserlogin = {
      email: 'test@naver.com',
      password: '1234',
    };
    await supertest(app).post('/auth/register').send(superUserInfo); //회원가입
    const login = await supertest(app).post('/auth/login').send(superUserlogin); //로그인

    const accessToken = 'Bearer ' + JSON.parse(login.text).accessToken;
    await supertest(app)
      .post('/posts')
      .send({
        //글 만들기
        title: '제목',
        content: '테스트내용',
      })
      .set('authorization', accessToken);

    const postInfo = await supertest(app).get(`/posts`).send(); //글 조회

    const createCommentRequestBody = {
      content: 'content_success',
    };

    const response = await supertest(app) // 댓글 가져오기
      .get(`/posts/${postInfo.body.posts[0].id}/comments`)
      .send()
      .set('authorization', accessToken);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ comments: [] });
  });

  test('GET /posts/:postId/comments API (ReadComment) 게시글없음 에러', async () => {
    const superUserInfo = {
      email: 'test@naver.com',
      nickname: 'tester',
      password: '1234',
      confirm: '1234',
    };
    const superUserlogin = {
      email: 'test@naver.com',
      password: '1234',
    };
    await supertest(app).post('/auth/register').send(superUserInfo); //회원가입
    const login = await supertest(app).post('/auth/login').send(superUserlogin); //로그인

    const accessToken = 'Bearer ' + JSON.parse(login.text).accessToken;
    await supertest(app)
      .post('/posts')
      .send({
        //글 만들기
        title: '제목',
        content: '테스트내용',
      })
      .set('authorization', accessToken);

    const postInfo = await supertest(app).get(`/posts`).send(); //글 조회

    const response = await supertest(app)
      .get(`/posts/null/comments`)
      .send()
      .set('authorization', accessToken);

    expect(response.status).toEqual(404);
    expect(response.body).toMatchObject({ errorMessage: '없는 글입니다.' });
  });

  // test('PUT /comments/:commentId API (updateComment) 성공', async () => {
  //   const superUserInfo = {
  //     email: 'test@naver.com',
  //     nickname: 'tester',
  //     password: '1234',
  //     confirm: '1234',
  //   };
  //   const superUserlogin = {
  //     email: 'test@naver.com',
  //     password: '1234',
  //   };
  //   await supertest(app).post('/auth/register').send(superUserInfo); //회원가입
  //   const login = await supertest(app).post('/auth/login').send(superUserlogin); //로그인

  //   const accessToken = 'Bearer ' + JSON.parse(login.text).accessToken; //로그인
  //   await supertest(app).post('/posts').send({
  //     //글 만들기
  //     title: '제목',
  //     content: '테스트내용',
  //   });
  //   const postInfo = await supertest(app).get(`/posts`).send(); //글 조회

  //   console.log(postInfo.body.posts[0].id); //최신글 id = postId

  //   const commentWrite = await supertest(app)
  //     .post('/posts/100/comments')
  //     .send({
  //       //댓글 쓰기
  //       content: 'content_ㅋㅋㅋㅋㅋㅋ',
  //     })
  //     .set('authorization', accessToken);

  //   // const commentInfo = await supertest(app) //댓글 조회
  //   //   .get(`/posts/${postInfo.body.posts[0].id}/comments`)
  //   //   .send()
  //   //   .set('authorization', accessToken);
  //   // // console.log(commentInfo.body);
  //   // expect(commentInfo.body).toMatchObject({
  //   //   comments: [],
  //   // });
  //   // const response = await supertest(app) //댓글 업데이트
  //   //   .put(`/comments/${commentInfo.body.comments[0].id}`)
  //   //   .send({ content: 'content_update_success' })
  //   //   .set('authorization', accessToken);

  //   // expect(response.status).toEqual(201);
  //   // expect(response.body).toMatchObject({
  //   //   message: '댓글 수정에 성공하였습니다.',
  //   // });
  // });
  // test('PUT /comments/:commentId API (updateComment) 게시글 없음 에러', async () => {
  //   const superUserInfo = {
  //     email: 'test@naver.com',
  //     nickname: 'tester',
  //     password: '1234',
  //     confirm: '1234',
  //   };
  //   const superUserlogin = {
  //     email: 'test@naver.com',
  //     password: '1234',
  //   };
  //   await supertest(app).post('auth/register').send(superUserInfo); //회원가입
  //   await supertest(app).post('auth/login').send(superUserlogin); //로그인
  //   await supertest(app).post('posts').send({
  //     //글 만들기
  //     title: '제목',
  //     content: '테스트내용',
  //   });
  //   const postInfo = await supertest(app).get('posts').query().send(); //글 조회
  //   await supertest(app).post(`posts/${postInfo.body.id}/comments`).send({
  //     //댓글 쓰기
  //     content: 'content_success',
  //   });

  //   const commentInfo = await supertest(app)
  //     .get(`posts/${postInfo.body.id}/comments`)
  //     .send();

  //   const response = await supertest(app) //댓글 업데이트
  //     .put(`comments/${commentInfo.comments[0].id}`)
  //     .send({ content: 'content_update_success' });

  //   const err = new ApiError('게시글이 존재하지 않습니다.', 400);
  //   expect(response.status).toEqual(400);
  //   expect(response.body).toMatchObject(err);
  // });
  // test('PUT /comments/:commentId API (updateComment) 댓글 내용 없음 에러', async () => {
  //   const superUserInfo = {
  //     email: 'test@naver.com',
  //     nickname: 'tester',
  //     password: '1234',
  //     confirm: '1234',
  //   };
  //   const superUserlogin = {
  //     email: 'test@naver.com',
  //     password: '1234',
  //   };
  //   await supertest(app).post('auth/register').send(superUserInfo); //회원가입
  //   await supertest(app).post('auth/login').send(superUserlogin); //로그인
  //   await supertest(app).post('posts').send({
  //     //글 만들기
  //     title: '제목',
  //     content: '테스트내용',
  //   });
  //   const postInfo = await supertest(app).get('posts').query().send(); //글 조회
  //   await supertest(app).post(`posts/${postInfo.body.id}/comments`).send({
  //     //댓글 쓰기
  //     content: 'content_success',
  //   });

  //   const commentInfo = await supertest(app)
  //     .get(`posts/${postInfo.body.id}/comments`)
  //     .send();

  //   const response = await supertest(app) //댓글 업데이트
  //     .put(`comments/${commentInfo.comments[0].id}`)
  //     .send({ content: 'content_update_success' });

  //   const err = new ApiError('댓글 내용을 입력해주세요.', 400);
  //   expect(response.status).toEqual(400);
  //   expect(response.body).toMatchObject(err);
  // });
  // test('PUT /comments/:commentId API (updateComment) 해당 댓글 없음 에러', async () => {
  //   const superUserInfo = {
  //     email: 'test@naver.com',
  //     nickname: 'tester',
  //     password: '1234',
  //     confirm: '1234',
  //   };
  //   const superUserlogin = {
  //     email: 'test@naver.com',
  //     password: '1234',
  //   };
  //   await supertest(app).post('auth/register').send(superUserInfo); //회원가입
  //   await supertest(app).post('auth/login').send(superUserlogin); //로그인
  //   await supertest(app).post('posts').send({
  //     //글 만들기
  //     title: '제목',
  //     content: '테스트내용',
  //   });
  //   const postInfo = await supertest(app).get('posts').query().send(); //글 조회
  //   await supertest(app).post(`posts/${postInfo.body.id}/comments`).send({
  //     //댓글 쓰기
  //     content: 'content_success',
  //   });

  //   const commentInfo = await supertest(app)
  //     .get(`posts/${postInfo.body.id}/comments`)
  //     .send();

  //   const response = await supertest(app) //댓글 업데이트
  //     .put(`comments/${commentInfo.comments[0].id}`)
  //     .send({ content: 'content_update_success' });

  //   const err = new ApiError('댓글이 존재하지 않습니다.', 400);
  //   expect(response.status).toEqual(400);
  //   expect(response.body).toMatchObject(err);
  // });
  // test('PUT /comments/:commentId API (updateComment) 댓글 소유자 인증 에러', async () => {
  //   const superUserInfo = {
  //     email: 'test@naver.com',
  //     nickname: 'tester',
  //     password: '1234',
  //     confirm: '1234',
  //   };
  //   const superUserlogin = {
  //     email: 'test@naver.com',
  //     password: '1234',
  //   };
  //   await supertest(app).post('auth/register').send(superUserInfo); //회원가입
  //   await supertest(app).post('auth/login').send(superUserlogin); //로그인
  //   await supertest(app).post('posts').send({
  //     //글 만들기
  //     title: '제목',
  //     content: '테스트내용',
  //   });
  //   const postInfo = await supertest(app).get('posts').query().send(); //글 조회
  //   await supertest(app).post(`posts/${postInfo.body.id}/comments`).send({
  //     //댓글 쓰기
  //     content: 'content_success',
  //   });

  //   let accesstoken = 'Bearer 2222'; //다른 아이디

  //   const commentInfo = await supertest(app)
  //     .get(`posts/${postInfo.body.id}/comments`)
  //     .send();

  //   const response = await supertest(app) //댓글 업데이트
  //     .put(`comments/${commentInfo.comments[0].id}`)
  //     .send({ content: 'content_update_success' })
  //     .set('authorization', accesstoken);

  //   const err = new ApiError('본인의 댓글이 아닙니다.', 400);
  //   expect(response.status).toEqual(400);
  //   expect(response.body).toMatchObject(err);
  // });
  // test('DELETE /comments/:commentId API (deleteComment) 성공', async () => {
  //   const superUserInfo = {
  //     email: 'test@naver.com',
  //     nickname: 'tester',
  //     password: '1234',
  //     confirm: '1234',
  //   };
  //   const superUserlogin = {
  //     email: 'test@naver.com',
  //     password: '1234',
  //   };
  //   await supertest(app).post('auth/register').send(superUserInfo); //회원가입
  //   await supertest(app).post('auth/login').send(superUserlogin); //로그인
  //   await supertest(app).post('posts').send({
  //     //글 만들기
  //     title: '제목',
  //     content: '테스트내용',
  //   });
  //   const postInfo = await supertest(app).get('posts').query().send(); //글 조회
  //   await supertest(app).post(`posts/${postInfo.body.id}/comments`).send({
  //     //댓글 쓰기
  //     content: 'content_success',
  //   });

  //   const commentInfo = await supertest(app).get(
  //     `posts/${postInfo.body.id}/comments`,
  //   );

  //   const response = await supertest(app) //댓글 삭제
  //     .delete(`comments/${commentInfo.comments[0].id}`);

  //   expect(response.status).toEqual(201);
  //   expect(response.body).toMatchObject({
  //     message: '댓글 삭제에 성공하였습니다.',
  //   });
  // });
  // test('DELETE /comments/:commentId API (deleteComment) 해당 댓글 없음 에러', async () => {
  //   const superUserInfo = {
  //     email: 'test@naver.com',
  //     nickname: 'tester',
  //     password: '1234',
  //     confirm: '1234',
  //   };
  //   const superUserlogin = {
  //     email: 'test@naver.com',
  //     password: '1234',
  //   };
  //   await supertest(app).post('auth/register').send(superUserInfo); //회원가입
  //   await supertest(app).post('auth/login').send(superUserlogin); //로그인
  //   await supertest(app).post('posts').send({
  //     //글 만들기
  //     title: '제목',
  //     content: '테스트내용',
  //   });
  //   const postInfo = await supertest(app).get('posts').query().send(); //글 조회
  //   await supertest(app).post(`posts/${postInfo.body.id}/comments`).send({
  //     //댓글 쓰기
  //     content: 'content_success',
  //   });

  //   const commentInfo = await supertest(app).get(
  //     `posts/${postInfo.body.id}/comments`,
  //   );

  //   const response = await supertest(app) //댓글 삭제
  //     .delete(`comments/없는 commentId`);

  //   const err = new ApiError('댓글이 존재하지 않습니다.', 400);
  //   expect(response.status).toEqual(400);
  //   expect(response.body).toMatchObject(err);
  // });
  // test('DELETE /comments/:commentId API (deleteComment) 댓글 소유자 인증 에러', async () => {
  //   const superUserInfo = {
  //     email: 'test@naver.com',
  //     nickname: 'tester',
  //     password: '1234',
  //     confirm: '1234',
  //   };
  //   const superUserlogin = {
  //     email: 'test@naver.com',
  //     password: '1234',
  //   };
  //   await supertest(app).post('auth/register').send(superUserInfo); //회원가입
  //   await supertest(app).post('auth/login').send(superUserlogin); //로그인
  //   await supertest(app).post('posts').send({
  //     //글 만들기
  //     title: '제목',
  //     content: '테스트내용',
  //   });
  //   const postInfo = await supertest(app).get('posts').query().send(); //글 조회
  //   await supertest(app).post(`posts/${postInfo.body.id}/comments`).send({
  //     //댓글 쓰기
  //     content: 'content_success',
  //   });

  //   const commentInfo = await supertest(app).get(
  //     `posts/${postInfo.body.id}/comments`,
  //   );
  //   let accesstoken = 'Bearer 2222';
  //   const response = await supertest(app) //댓글 삭제
  //     .delete(`comments/${commentInfo.comments[0].id}`)
  //     .set('authorization', accesstoken);

  //   const err = new ApiError('본인의 댓글이 아닙니다.', 400);
  //   expect(response.status).toEqual(400);
  //   expect(response.body).toMatchObject(err);
  // });
});

afterAll(async () => {
  if (process.env.NODE_ENV === 'test') await Comments.destroy({ where: {} });
  else throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
});
