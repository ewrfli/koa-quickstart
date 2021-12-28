// src/routes.ts
import Router from '@koa/router';

import AuthController from './controllers/auth';
import UserController from './controllers/user';

const router = new Router();

// auth 相关的路由 
router.post('/auth/login', AuthController.login);
router.post('/auth/register', AuthController.register);

// users 相关的路由
router.get('/users', UserController.listUsers); //查询所有的用户
router.get('/users/:id', UserController.showUserDetail); //查询单个用户
router.put('/users/:id', UserController.updateUser);//更新单个用户
router.delete('/users/:id', UserController.deleteUser);//删除单个用户
//POST /users/login ：登录（获取 JWT Token）

export default router;
