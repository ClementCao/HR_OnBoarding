var router = require('koa-router')();
var url = require('url');
//引入模块
var login = require('./login.js');

//配置中间件
router.use(async (ctx, next) => {
    ctx.state.__HOST__ = 'http://' + ctx.request.header.host;

    ///admin/login/code?t=91.18029250911208
    var pathname = url.parse(ctx.request.url).pathname.substring(1);

    var splitUrl = pathname.split('/');
    //配置全局信息
    ctx.state.G = {
        url: splitUrl,
        userinfo: ctx.session.userinfo,
        prepage: ctx.request.header['referer'] /*上一页地址*/ ,
        forminfo: ''
    };
    //权限判断
    if (ctx.session.userinfo) {
        await next();
    } else { //没有登录跳转到登录页面
        if (pathname == 'OnBoarding/login' || pathname == 'OnBoarding/login/doLogin' || pathname == 'OnBoarding/login/code') {
            await next();
        } else {
            ctx.redirect('/OnBoarding/login');
        }
    }
})

router.use('/login', login);

module.exports = router.routes();