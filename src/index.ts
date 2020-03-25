import * as Koa from 'koa';
import * as koaBody from 'koa-body';
import * as serve from 'koa-static';
import * as timing from 'koa-xtime';
import { resolve } from 'path';
import { Sequelize } from 'sequelize-typescript';
import { load } from './utils/route-decors';

const app = new Koa();

const router = load(resolve(__dirname, 'routes'));
const database = new Sequelize({
  port: 3306,
  database: 'myegg',
  username: 'root',
  password: '',
  dialect: 'mysql',
  modelPaths: [`${__dirname}/model`],
});

app.use(router.routes());
app.use(timing());
app.use(serve(`${__dirname}/public`));
app.use(
  koaBody({
    multipart: true,
    strict: false,
  }),
);

app.use((ctx) => {
  ctx.body = 'hello';
});

app.listen(3000, () => {
  console.log('正在监听:', '3000');
});
