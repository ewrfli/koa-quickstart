import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import { logger } from './logger';
import router from './routes';

import { createConnection } from 'typeorm';
import 'reflect-metadata';

// 初始化 Koa 应用实例
const app = new Koa();

// 注册中间件
app.use(logger());
app.use(cors());
app.use(bodyParser());

// 响应用户请求
//ctx （Context上下文）
app.use(async (ctx, next) => {
   // 第一阶段
   ctx.body = 'Hello Koa';
   console.log('start')
   await next();
   // 第二阶段
  console.log('end:',ctx.url,ctx.body ,ctx.status);

});

// ctx.url    // 相当于 ctx.request.url
// ctx.body   // 相当于 ctx.response.body
// ctx.status // 相当于 ctx.response.status

// 响应用户请求
app.use(router.routes()).use(router.allowedMethods());

// 运行服务器
app.listen(3000);
