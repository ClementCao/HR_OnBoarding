//引用koa模块
var Koa = require('koa'),
  router = require('koa-router')(),
  path = require('path'),
  render = require('koa-art-template'),
  static = require('koa-static'),
  session = require('koa-session'),
  bodyParser = require('koa-bodyparser'),
  jsonp = require('koa-jsonp'),
  sd = require('silly-datetime');
  
//实例化
var app = new Koa();

//配置jsonp的中间件
app.use(jsonp());

//配置session的中间件
app.keys = ['some secret hurr'];

const CONFIG = {
  key: 'koa:sess',
  maxAge: 864000,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: true, //每次请求都重新设置session
  renew: false,
};

app.use(session(CONFIG, app));

//配置模块引擎
render(app, {
  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production',
  dateFormat: dateFormat = function (value) {
    return sd.format(value, 'YYYY-MM-DD HH:mm:ss') /*扩展模板里面的时间转换方法*/
  }
});
//配置POST提交内容中间件

app.use(bodyParser({
  jsonLimit: "10mb",
  formLimit: "10mb",
  textLimit: "10mb"
}));

//配置静态资源的中间件
app.use(static(__dirname + '/public'));
//引入模块
var index = require('./routes/index.js');
router.use('/OnBoarding',index);

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
//用iisnode配置IIS站点时，开启以下端口监听方式
//app.listen(process.env.PORT);