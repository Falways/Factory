let express = require('express');
let router = express.Router();
let fs = require('fs');
let path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// server support breakpoint download
router.get('/slice_dn',function (req,res,next) {
  console.log('Request download with slice!')
  const rbs = fs.createReadStream(path.resolve(__dirname,'../blobs/CentOS-7-x86_64-Minimal-1908.iso'));
  let size = fs.statSync(path.resolve(__dirname,'../blobs/CentOS-7-x86_64-Minimal-1908.iso')).size;
  let downLoadHeader = {
    "Content-Type":"application/force-download",
    'Content-Disposition': 'attachment; filename=' + 'CentOS-7-x86_64-Minimal-1908.iso',
    'Content-Length': size
  }
  res.writeHead(200,downLoadHeader);
  rbs.pipe(res)
})
module.exports = router;
