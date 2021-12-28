// src/routes.ts
import Router from '@koa/router';

import AuthController from './controllers/auth';
import UserController from './controllers/user';


const unprotectedRouter = new Router(); //unprotected无保护的
// auth 相关的路由 
unprotectedRouter.post('/auth/login', AuthController.login);
unprotectedRouter.post('/auth/register', AuthController.register);

const protectedRouter = new Router();//有保护的
// users 相关的路由
protectedRouter.get('/users', UserController.listUsers); //查询所有的用户
protectedRouter.get('/users/:id', UserController.showUserDetail); //查询单个用户
protectedRouter.put('/users/:id', UserController.updateUser);//更新单个用户
protectedRouter.delete('/users/:id', UserController.deleteUser);//删除单个用户
                                                                //POST /users/login ：登录（获取 JWT Token）

export { unprotectedRouter, protectedRouter };
