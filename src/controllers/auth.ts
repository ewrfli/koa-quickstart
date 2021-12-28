// src/controllers/auth.ts
import { Context } from 'koa';
import * as argon2 from 'argon2'; //非对称算法进行加密
import { getManager } from 'typeorm';
import { User } from '../entity/user';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants';
//getManager().getRepository(User).findOne(id) .update() .delete()
// save(newUser);

export default class AuthController {
  //登录
  public static async login(ctx: Context) {
    const userRepository = getManager().getRepository(User);

    const user = await userRepository
      .createQueryBuilder()
      .where({ name: ctx.request.body.name })
      .addSelect('User.password')
      .getOne();

    if (!user) {
      ctx.status = 401; //我们首先根据用户名（请求体中的 name 字段）查询对应的用户，如果该用户不存在，则直接返回 401
      ctx.body = { message: '用户名不存在' };
    } else if (await argon2.verify(user.password, ctx.request.body.password)) {
      ctx.status = 200; //存在的话再通过 argon2.verify 来验证请求体中的明文密码 password 是否和数据库中存储的加密密码是否一致，
      //如果一致则通过 jwt.sign 签发 Token如果不一致则还是返回 401。
      ctx.body = { token: jwt.sign({ id: user.id }, JWT_SECRET) };
      // 最新安装的koa-jwt不支持jwt.sign了，要直接用jsonwebtoken.sign。大家学习时注意啦
    } else {
      ctx.status = 401;
      ctx.body = { message: '密码错误' };
    }
  }


  //注册
  public static async register(ctx: Context) {
    const userRepository = getManager().getRepository(User);

    const newUser = new User();
    newUser.name = ctx.request.body.name;
    newUser.email = ctx.request.body.email;
    newUser.password = await argon2.hash(ctx.request.body.password);

    // 保存到数据库
    const user = await userRepository.save(newUser);

    ctx.status = 201;
    ctx.body = user;
  }
}
