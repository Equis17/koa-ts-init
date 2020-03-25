import koa from 'koa';
import model from '../model/user';
import { get, middleWares, post } from '../utils/route-decors';

const users = [{ name: 'tome' }];
@middleWares([
  async function guard(ctx: koa.Context, next: () => Promise<any>) {
    console.log('guard', ctx.header);
    if (!ctx.header.token) {
      await next();
    } else {
      throw '请登录';
    }
  },
])
export default class User {
  @get('/users')
  public async list(ctx: koa.Context) {
    const user = await model.findAll();
    ctx.body = { user };
  }

  @post('/users')
  public add(ctx: koa.Context) {

    users.push(ctx.request.body);
    ctx.body = { ok: 1 };
  }
}
