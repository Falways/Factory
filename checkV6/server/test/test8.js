let request = require('request');
let qs = require('querystring')
const requireDomainResult = (auth,link,done) => {
    let headers = {
        "Content-Type":'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
    }
    /**
     * request params(conditionJson,callback)
     */
    request.get(
        {
            uri:link,
            timeout: 10000,
            json:true,
            oauth:auth},
        (err,res,body) => {
            console.log(body)
            if (err){
                done(err);
                return;
            }
            //let result = JSON.parse(body.toString())
            done(null,body.success);
        }
    )
}

let auth = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkX2F0IjoiMjAxOS0wMy0wN1QxNTowMjo1MloiLCJleHAiOjE1NTI2MjUzNjksImlkIjoyLCJvcmlnX2lhdCI6MTU1MjYyMTc2OSwicmF0ZV9mb3JtYXR0ZWQiOiIzMDAwLUgiLCJyb2xlcyI6W3sicGVybWlzc2lvbnMiOlt7Im9wZXJhdGlvbl9sYWJlbCI6IsOmxbjCpcOnxZPigLkiLCJvcGVyYXRpb25fbmFtZSI6InZpZXciLCJwZXJtaXNzaW9uX3R5cGVfbGFiZWwiOiLDqeKCrMWhw6figJ3CqMOmwp3GksOp4oSiwpDDp8KxwrvDpcW-4oC5IiwicGVybWlzc2lvbl90eXBlX25hbWUiOiJyZXNvdXJjZSIsInJlc291cmNlX2xhYmVsIjoiw6nigqzFocOn4oCdwqjDqMK14oCew6bCusKQIiwicmVzb3VyY2VfbmFtZSI6InJlc291cmNlIn1dLCJyb2xlX2xhYmVsIjoiw6bihKLCrsOp4oKsxaHDp-KAncKow6bLhsK3Iiwicm9sZV9uYW1lIjoibm9ybWFsIn1dLCJ1cGRhdGVkX2F0IjoiMjAxOS0wMy0wN1QxNTowMjo1MloiLCJ1c2VybmFtZSI6InRlc3QifQ.WwWqEF9xBL7YvifWi31d-E7aiw39xw9KkqkhshCeQHE';
let url = 'http://119.29.190.236:3000/api/evils?uri=www.superhang.top';
let oauth = {
    Authorization:auth
}
requireDomainResult(oauth,url,function (err,data) {
    if (err){
        console.log('错误：'+err)
    }else {
        console.log('结果是：'+data)
    }
})