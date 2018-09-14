var router = require('koa-router')();
var _ = require('lodash');

//验证码模块
var svgCaptcha = require('svg-captcha');
//添加lodash中间件
var _ = require('lodash');

router.get('/', async (ctx) => {
    await ctx.render('login');
})

router.post('/doLogin', async (ctx) => {
    let Username = "ccd";
    let Password = "Jabil123456";
    let Code = ctx.session.code;
    if (_.toLower(Code) == _.toLower(ctx.session.code)) {
        var rows = await Db.find(collectionName, {
            Username: Username,
            Password: tools.md5(Password)
        });
        if (rows.length > 0) {
            ctx.session.userinfo = rows[0];
            //更新管理员最后更新时间
            let ID = rows[0].ID;
            let lasttime = new Date(Date.now());
            let Status = rows[0].Status;
            if (Status == 0) {
                ctx.render('error', {
                    message: '此用户已被禁用，请联系管理员',
                    redirect: ctx.state.__HOST__ + '/OnBoarding/login'
                })
            } else {
                await Db.update(collectionName, {
                    LastTime: lasttime
                }, {
                    ID: ID
                });
                //跳转到管理页面
                ctx.redirect(ctx.state.__HOST__ + '/admin');
            }

        } else {
            ctx.render('error', {
                message: '用户名或密码错误',
                redirect: ctx.state.__HOST__ + '/OnBoarding/login'
            })
        }
    } else {
        ctx.render('error', {
            message: '验证码错误',
            redirect: ctx.state.__HOST__ + '/OnBoarding/login'
        })
    }
})

/*验证码*/
router.get('/code', async (ctx) => {
    var captcha = svgCaptcha.create({
        size: 4,
        fontsize: 50,
        width: 120,
        height: 34,
        background: "#cc9966"
    });
    //保存验证码
    ctx.session.code = captcha.text;
    //设置响应头
    ctx.response.type = 'image/svg+xml';
    ctx.body = captcha.data;
})

//退出登录
router.get('/loginOut', async (ctx) => {
    ctx.session.userinfo = null;
    ctx.redirect(ctx.state.__HOST__ + '/OnBoarding/login');
})

module.exports = router.routes();