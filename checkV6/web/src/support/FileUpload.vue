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
    <Modal width="500"  :mask-closable="false" :title="title" v-model="show">
        <div style="text-align:center">
            <Upload ref="uploadInstance" name="file" :before-upload="onHandleUpload" :on-success="onHandleSuccess"
                    :on-error="onHandleError" :on-progress="onHandleProgress"
                    :data="data"
                    :headers="importHeaders"
                    :action="action">
                <Button type="text" icon="md-cloud-upload">选择导入文件</Button>
            </Upload>
            <div>{{ uploadMsg }}</div>
        </div>
        <div slot="footer">
            <Button type="info" style="float: left" @click="getTemplate">下载模板</Button>
            <Button type="default" @click="show=false">关闭</Button>
        </div>
    </Modal>
</template>
<script>
    import FileSaver from 'file-saver';
    export default {
        name: 'FileUpload',
        props: {
            title: { type: String, default: '导入Excel文件'},
            action: String,
            data: Object
        },
        data() {
            return {
                show: false,
                importHeaders: {'x-access-token': ''},
                uploadMsg: ''
            }
        },
        methods: {
            getTemplate(){
                var that = this;
                that.axios.get('/api/badness_url/template',{timeout:'1000*60*5', responseType: 'blob'}).then(function (okResponse) {
                    var fileName = null;
                    for (var key in okResponse.headers) {
                        if (key.toLowerCase() === 'content-disposition') {
                            var disposition = okResponse.headers[key];
                            fileName = disposition.substring(disposition.indexOf('filename=') + 9);
                        }
                    }
                    // console.log(okResponse.data)
                    FileSaver.saveAs(okResponse.data, fileName || 'unknown');
                }).catch(function (error) {
                    if (error){
                        that.$Message.error('系统错误!');
                    }
                })
            },
            openDialog() {
                this.show = true;
                this.uploadMsg = '';
                this.$refs['uploadInstance'].clearFiles();
            },
            closeDialog() {
                this.show = false;
            },
            onHandleSuccess(result) {
                if (result) {
                    //this.$Message.success('导入成功!');
                    this.$Spin.hide();
                    this.$emit('upload-success',result)
                }
            },
            onHandleUpload() {
                this.$emit('before-upload')
            },
            onHandleError(result) {
                if (result && result.message) {
                    this.$Message.error(result.message);
                    this.uploadMsg = result.message;
                } else {
                    //this.$Message.error(JSON.stringify(result));
                }
                this.$Spin.hide();
                this.$emit('upload-error');
            },
            onHandleProgress(result) {
                if (result && result.percent) {
                    if (result.percent < 100) {
                        this.uploadMsg = '上传中：' + result.percent + '%';
                    } else {
                        this.uploadMsg = '上传完成';
                    }
                    this.$Spin.show({
                        render: (h) => {
                            return h('div', [
                                h('Icon', {
                                    'class': 'demo-spin-icon-load',
                                    props: {
                                        type: 'ios-loading',
                                        size: 50
                                    }
                                }),
                                h('div', '系统正在处理，请耐心稍等...')
                            ])
                        }
                    });
                }
            }
        },
        beforeDestroy: function () {
        },
        mounted: function () {
        }
    }

</script>
