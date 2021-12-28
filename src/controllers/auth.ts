// src/controllers/auth.ts
import { Context } from 'koa';
import * as argon2 from 'argon2'; //非对称算法进行加密
import { getManager } from 'typeorm';
import { User } from '../entity/user';

//getManager().getRepository(User).findOne(id) .update() .delete()
// save(newUser);

export default class AuthController {
  public static async login(ctx: Context) {
    ctx.body = 'Login controller';
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
