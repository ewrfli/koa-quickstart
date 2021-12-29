// src/controllers/user.ts
import { argon2d } from 'argon2';
import { Context } from 'koa';
import * as argon2 from 'argon2'; //非对称算法进行加密
import { getManager } from 'typeorm';
import { User } from '../entity/user';
import { NotFoundException, ForbiddenException } from '../exceptions';//错误处理
//getManager().getRepository(User).findOne(id) .update() .delete()


export default class UserController {

  //获取全部User
  public static async listUsers(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    const users = await userRepository.find();

    ctx.status = 200;
    ctx.body = users;
  }

  //获取单个User
  // ctx.params 获取到路由参数 id 
  public static async showUserDetail(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    const user = await userRepository.findOne(+ctx.params.id);

    if (user) {
      ctx.status = 200;
      ctx.body = user;
    } else {
      ctx.status = 404;
      throw new NotFoundException();
    }
  }

  //更新单个User ctx.request.body 获取到了请求体的数据
  public static async updateUser(ctx: Context) {
    //jwt鉴权 在合适的地方校验用户的 Token，确认其是否有足够的权限
    const userId = +ctx.params.id;
    if (userId !== +ctx.state.user.id) { //ctx.state.user.id 对比 只能登陆的user的id修改相同url/id
      ctx.status = 403;
      ctx.body = { message: '无权进行此操作' };
      throw new ForbiddenException();
      return;
    }

    const userRepository = getManager().getRepository(User);
    let hpassword = await argon2.hash(ctx.request.body.password)
    ctx.request.body.password = hpassword
    await userRepository.update(+ctx.params.id, ctx.request.body);
    const updatedUser = await userRepository.findOne(+ctx.params.id);

    //Column 例如我们给 password 设置了 select: false ，使得这个字段在查询时默认不被选中
    if (updatedUser) {
      ctx.status = 200;
      ctx.body = updatedUser;
    } else {
      ctx.status = 404;
    }
  }

  //删除单个User
  public static async deleteUser(ctx: Context) {
    const userId = +ctx.params.id;
    if (userId !== +ctx.state.user.id) {
      ctx.status = 403;
      ctx.body = { message: '无权进行此操作' };
      throw new ForbiddenException();
      return;
    }

    const userRepository = getManager().getRepository(User);
    await userRepository.delete(+ctx.params.id);
    ctx.body = 'success'
    ctx.status = 204;
  }
}


