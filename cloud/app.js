// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var app = express();

// App 全局配置
app.set('views','cloud/views');   // 设置模板目录
app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(express.bodyParser());    // 读取请求 body 的中间件\

// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();

var express = require('express');
var app = express();
var avosExpressCookieSession = require('avos-express-cookie-session');

// App全局配置
app.set('views','cloud/views');   //设置模板目录
app.set('view engine', 'ejs');    // 设置template引擎
app.use(express.bodyParser());    // 读取请求body的中间件

// 启用 cookieParser
app.use(express.cookieParser('SK8PTYLTD'));
// 使用 avos-express-cookie-session 记录登录信息到 cookie
app.use(avosExpressCookieSession({ cookie: { maxAge: 3600000 }, fetchUser: false}));

app.get('/admin', function(req, res) {
    // 渲染登录页面
    res.render('admin.ejs');
});
// 点击登录页面的提交将出发下列函数
app.post('/admin', function(req, res) {
    AV.User.logIn(req.body.username, req.body.password).then(function() {
      //登录成功，avosExpressCookieSession会自动将登录用户信息存储到cookie
      //跳转到profile页面。
      console.log('signin successfully: %j', AV.User.current());
      res.redirect('/profile');
    },function(error) {
      //登录失败，跳转到登录页面
      console.log('signin failed: error', error.message);
      res.redirect('/admin');
  });
});

//查看用户profile信息
app.get('/profile', function(req, res) {
    // 判断用户是否已经登录
    if (req.AV.user) {
      // 如果已经登录，发送当前登录用户信息。
      res.send(req.AV.user);
    } else {
      // 没有登录，跳转到登录页面。
      res.redirect('/login');
    }
});

//调用此url来登出帐号
app.get('/logout', function(req, res) {
  //avosExpressCookieSession将自动清除登录cookie信息
    AV.User.logOut();
    res.redirect('/profile');
});

// 使用 cookieSession 记录自定义信息到 cookie
app.use(express.cookieSession());

var avosExpressHttpsRedirect = require('avos-express-https-redirect');
app.use(avosExpressHttpsRedirect());
