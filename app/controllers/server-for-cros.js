// 以下是实现跨域的服务器端示例代码：
// ------------------------------------------------

// nodejs API 参考：http://nodeapi.ucdok.com/#/api/

// 需要本地安装 formidable ，参见 https://github.com/felixge/node-formidable
// var formidable = require('formidable');
var fs = require('fs');
// var url = require('url');
var path = require('path');

// 文件将要上传到哪个文件夹下面
// var uploadfoldername = 'upload';
// var uploadfolderpath = path.join(__dirname, uploadfoldername);
// var uploadfolderpath = path.join(__dirname, '../../', '/public/' + uploadfoldername)


exports.upload = function(req, res) {

    //收到上传图片请求后，以管道的形式交给busboy处理
    req.pipe(req.busboy);
    //接收文件上传，就执行后面匿名函数方法
    // fieldname字段名字、file文件对象、filename文件名字、encoding使用的编码、mimetype文件类型
    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        // new Date().getTime()表示当前时间戳，然后转换字符串
        // path.extname获取文件的后缀名
        var newFilename = String(new Date().getTime()) + path.extname(filename); //上传图片名

        var filePath = path.join(__dirname, '../../', '/public/upload/' + newFilename);
        var url = path.join(__dirname, '../../', '/public/upload/' + newFilename); //上传文件新的路径
        //将文件转换成管道形式，以流的形式写进指定路径
        file.pipe(fs.createWriteStream(filePath));
        console.log(filePath);
        console.log(url);
        //文件写完结束后，执行以下函数返回信息
        file.on('end', function() {
            var rurl = url.substr(35)
            var fullpath = req.headers.origin + rurl;
            //res.json({success: true, url: url});
            res.send(fullpath); //返回文件url绝对路径
            console.log(fullpath);
        });

    });



}

// // 监听 localhost port 端口
// console.log('server start at http://' + server + ':' + port);


exports.aupload = function(req, res) {

    //收到上传图片请求后，以管道的形式交给busboy处理
    req.pipe(req.busboy);
    //接收文件上传，就执行后面匿名函数方法
    // fieldname字段名字、file文件对象、filename文件名字、encoding使用的编码、mimetype文件类型
    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        // new Date().getTime()表示当前时间戳，然后转换字符串
        // path.extname获取文件的后缀名
        var newFilename = String(new Date().getTime()) + path.extname(filename); //上传图片名

        var filePath = path.join(__dirname, '../../', '/public/uploadcache/' + newFilename);
        var url = path.join(__dirname, '../../', '/public/uploadcache/' + newFilename); //上传文件新的路径
        //将文件转换成管道形式，以流的形式写进指定路径
        file.pipe(fs.createWriteStream(filePath));
        console.log(filePath);
        console.log(url);
        //文件写完结束后，执行以下函数返回信息
        file.on('end', function() {
            var rurl = url.substr(35)
            var fullpath = req.headers.origin + rurl;
            //res.json({success: true, url: url});
            res.send(fullpath); //返回文件url绝对路径
            console.log(fullpath);
        });

    });



}