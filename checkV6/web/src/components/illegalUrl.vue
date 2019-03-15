<style lang="less">
    .index{
        padding: 8px;
    }
    .login-form .ivu-form-item{
        margin-bottom: 0px !important;
        color: white;
    }

    .login-form .ivu-form-item .ivu-form-item-label{
        color: white !important;
    }

    .login-footer{
        height:47px;
        text-align: center;
        position: fixed;
        width:100%;
        bottom: 0;
        padding:10px;
        color:#a7a7a7;
        h4{
            font-weight: 100;
            font-weight: bold;
        }
    }
    .ivu-table .demo-table-error-row td{
        font-weight: 700;
        background-color: rgba(3,54,73,0.2);
        color: #fff;
    }
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    .demo-spin-col{
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
    .ivu-spin-fix {
        background-color: rgba(255, 255, 255, 0.2);
    }
</style>
<template>
    <div class="index">
        <Row>
            <Col span="24" style="text-align: center">
                <h2>赛讯在线检测不良网站</h2>
            </Col>
        </Row>
        <div  style="margin-top: 30px;width: 90%;margin-left: 5%;text-align: center">
            <Form ref="formInline" :model="formInline" :rules="ruleInline"  inline>
                <FormItem style="width: 40%" prop="domain">
                    <Input type="text" v-model="formInline.domain" size="large"  placeholder="如：www.baidu.com"/>
                </FormItem>
                <FormItem>
                    <Button type="success" @click="toSearch">检测</Button>
                </FormItem>
                <FormItem>
                    <Button type="success" @click="openUploadUrlDialog" ghost>导入Excel</Button>
                </FormItem>
            </Form>
        </div>
        <Card style="width: 50%;margin-left: 25%;margin-top: 3%">
            <div slot="title">
                结果：
            </div>
            <div style="">
                <h1 v-if="line_result.url">{{line_result.url}}</h1>
                <h2 v-if="line_result.urltype==2" style="color: orange">检测结果：危险网站</h2>
                <h2 v-if="line_result.urltype==3 || line_result.urltype==4" style="color: green">检测结果：安全</h2>
                <h2 v-if="line_result.urltype==0 || line_result.urltype==1 || line_result.urltype=='其他'" style="color: gray">检测结果：未知</h2>
            </div>
        </Card>
        <div  style="margin-top: 30px;width: 50%;margin-left: 25%;text-align: center;" v-if="false">
            <Row>
                <Table border ref="dataTable" style="width: 100%" border :columns="tableColumns" :data="tableData" :loading="tableLoading" stripe></Table>
            </Row>
            <Row>
                <Page show-sizer  v-if="pagination.total"
                      show-total
                      :total="pagination.total"
                      :current="pagination.current"
                      :page-size-opts="[20, 50,100]"
                      :page-size="pagination.size"
                      @on-page-size-change="handleSizeChange"
                      @on-change="handleCurrentChange"></Page>
            </Row>
        </div>
        <FileUpload ref="fileUpload" action="/api/badness_url/importfiles" :data="uploadParam" @upload-success="onUploadSuccess"></FileUpload>
        <div class="login-footer">
            <h4>广州赛讯信息技术有限公司</h4>
            <span>Copyright(c) 2018-2020 GuangZhou CyberEX Co.Ltd, All rights reserved</span>
        </div>
        <Button type="info" @click="testXlsx">测试</Button>
    </div>
</template>

<script>
    import Table from '../support/table2';
    import Dialog from '../support/dialog';
    import FileUpload from '../support/FileUpload';
    import XLSX from  'xlsx';
    import FileSaver from 'file-saver';
    import vje from 'vue-json-excel';
    import json2xlsx from 'json2xlsx-export';

    export default {
        name: "illegalUrl",
        components: {
            FileUpload
        },
        mixins: [Table,Dialog],
        data(){
            const validDomain = (rule,value,callback) => {
                if (value === ''){
                    callback(new Error('输入域名'))
                }
                let reg = /([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(:\d+)?/gi;
                if (reg.test(value)) {
                    callback()
                }else {
                    callback(new Error('输入的域名不合法！'))
                }
            }
            return{
                uploadParam:{},
                line_result:{
                    url:'',
                    urltype:null
                },
                tableLoading:false,
                tableData:this.tableData,
                tableColumns:[],
                formInline:{
                    domain:''
                },
                ruleInline:{
                    domain:[{required: true,validator:validDomain,  trigger: 'blur'}]
                }
            }
        },
        "pagination.current": function () {
            this.doGetPage();
        },
        "pagination.size": function () {
            this.doGetPage();
        },
        methods:{
            testXlsx(){
               /* var url = "http://oss.sheetjs.com/test_files/formula_stress_test.xlsx";

                /!* set up async GET request *!/
                var req = new XMLHttpRequest();
                req.open("GET", url, true);
                req.responseType = "arraybuffer";

                req.onload = function(e) {
                    var data = new Uint8Array(req.response);
                    var workbook = xlsx.read(data, {type:"array"});
                    console.log(workbook);
                    var aFileParts = [JSON.stringify(workbook)]; // 一个包含DOMString的数组
                    var oMyBlob = new Blob(aFileParts, {type : 'text/html'});
                    FileSaver.saveAs(oMyBlob, 'unknown');
                }
                req.send();*/
                const config = {
                    filename: 'AwesomeFile',
                    sheet: {
                        data: [
                            [{
                                value: 'Text',
                                type: 'string'
                            },{
                                value: 'Another text',
                                type: 'string'
                            }, {
                                value: 1000,
                                type: 'number'
                            }]
                        ]
                    }
                };

                json2xlsx(config);
            },
            openUploadUrlDialog(){
                this.$refs['fileUpload'].openDialog();
            },
            onUploadSuccess(result){
                this.$Message.success('系统处理成功！');
                console.log(result)

            },
            toSearch(){
                this.$refs['formInline'].validate( (valid) => {
                    if (valid){
                        let that = this;
                        this.axios.get('/api/badness_url/',{params:{domain:this.formInline.domain}}).then(function (response) {
                            that.line_result=response.data.result;
                            that.$Message.success('查询成功');
                            //console.log(response)
                        }).catch(function (error) {
                            that.$Message.error(error.message);
                        });
                    }
                })
            },
            doGetPage(){

            }
        }
    }
</script>
