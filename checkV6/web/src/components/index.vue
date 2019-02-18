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
        <h2>赛讯在线检测网站IPv6访问</h2>
      </Col>
    </Row>
    <Button @click="drawer = true" style="position: absolute;right: 10px;top: 10px" type="info" >显示终端信息</Button>
      <Drawer :closable="false" width="400" v-model="drawer">
        <div style="margin-top: 30px;width: 29%;float: left" >
            <Card style="width:350px">
              <p slot="title">
                <Icon type="ios-contact" />
                终端信息
              </p>
              <div>
                <Row>
                  <Col span="10">
                    <span style="font-weight: 800;">IPv4：</span>
                  </Col>
                  <Col span="14">
                    <Tag color="success" v-if="terminal.isV4">支持</Tag>
                    <Tag color="error" v-if="!terminal.isV4">不支持</Tag>
                  </Col>
                </Row>
                <Row>
                  <Col span="10">
                    <span style="font-weight: 800">IPv6：</span>
                  </Col>
                  <Col span="14">
                    <Tag color="success" v-if="terminal.isV6">支持</Tag>
                    <Tag color="error" v-if="!terminal.isV6">不支持</Tag>
                  </Col>
                </Row>
                <Row>
                  <Col span="10">
                    <span style="font-weight: 800">Address：</span>
                  </Col>
                  <Col span="14">
                    <a style="color: #2473fa;">{{terminal.ip}}</a>
                  </Col>
                </Row>
                <Row>
                  <Col span="10">
                    <span style="font-weight: 800">Device：</span>
                  </Col>
                  <Col span="14">
                    <b>{{terminal.device}}</b>
                  </Col>
                </Row>
                <Row>
                  <Col span="10">
                    <span style="font-weight: 800">Addr：</span>
                  </Col>
                  <Col span="14">
                    <b>{{terminal.addr}}</b>
                  </Col>
                </Row>
                <Row>
                  <Col span="10">
                    <span style="font-weight: 800">Internet：</span>
                  </Col>
                  <Col span="14">
                    <b>{{terminal.internet}}</b>
                  </Col>
                </Row>
              </div>
            </Card>
      </div>
      </Drawer>

      <div  style="margin-top: 30px;width: 90%;margin-left: 5%">
        <Row style="text-align: center">
          <Form ref="formInline" :model="formInline" :rules="ruleInline"  inline>
            <FormItem style="width: 40%" prop="domain">
              <Input type="text" v-model="formInline.domain" size="large"  placeholder="如：www.cyberex.com.cn"/>
            </FormItem>
            <FormItem>
              <Button type="success" @click="toResolve">分析</Button>
            </FormItem>
          </Form>
        </Row>
        <div>
          <Icon size="15" type="ios-bulb-outline" />
          <a>检测记录</a>
          <Table stripe :row-class-name="rowClassName" border :columns="columns" :data="Tdata" style="margin-top: 6px"></Table>
          <Card style="margin-top: 8%" v-if="speed">
              <h3 style="text-align: center">网站访问速度分析({{speedDomain}})</h3>
              <ul style="list-style:none">
                <br/>
                <br/>
                <li v-for="item in speedList" style="margin-top: 3px;text-align: center">
                  <a href="#">{{ item.name }}:</a>
                  <span style="margin-left: 10px;line-height: 20px;padding: 0px">最长：{{item.max}}ms</span>
                  <span style="margin-left: 10px;line-height: 20px;padding: 0px">最短：{{item.min}}ms</span>
                  <span style="margin-left: 10px;line-height: 20px;padding: 0px">平均：{{item.avg}}ms/10次</span>
                  <span style="margin-left: 20px;line-height: 20px">
                    <Icon type="ios-star" v-for="n in item.n" color="orange" style="margin-bottom: 5px" size="16" :key="n"></Icon>
                </span>
                </li>
              </ul>
          </Card>
        </div>
        <div>

        </div>
      </div>

      <div class="login-footer">
        <h4>广州赛讯信息技术有限公司</h4>
        <span>Copyright(c) 2018-2020 GuangZhou CyberEX Co.Ltd, All rights reserved</span>
      </div>
    </div>

</template>
<script>
  export default {
    data() {
      const validDomain = (rule,value,callback) => {
        if (value === ''){
          callback(new Error('请输入域名！'))
        }
        let reg = /([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(:\d+)?/gi;
        if (reg.test(value)) {
          callback()
        }else {
          callback(new Error('输入的域名不合法！'))
        }
      }
      return {
        search:false,
        speedDomain:'',
        speedList:[],
        speed:false,
        ruleInline: {
          domain:[{required: true,validator:validDomain,  trigger: 'blur'}]
        },
        drawer:false,
        terminal: {
          addr:'',
          device:'',
          internet:'',
          ip:'',
          isV4:false,
          isV6:false
        },
        columns: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '时间',
            key: 'time',
            align: 'center',
            width:'150',
            sortable: true,
            render:(h,params)=>{
              return h('span',{},new Date(params.row.time).Format('yyyy/MM/dd hh:mm:ss'))
            }
          },
          {
            title: '网站',
            key: 'url',
            width:'160',
            align: 'center',
            tooltip:true
          },
          {
            title: 'IPv4地址',
            key: 'v4addr',
            width:'150',
            align: 'center',
          },
          {
            title: 'IPv6地址',
            key: 'v6addr',
            align: 'center',
            tooltip:true
          },
          {
            key: 'supportV4',
            align: 'center',
            renderHeader:(h,obj) => {
              return h('div',[h('span',{},'IPv4'),h('br',{}),h('span',{},'解析')])
            },
            render:(h,params)=>{
              const row = params.row;
              if (row.supportV4==true) {
                return h('Icon',{
                  props:{
                    type:'md-checkmark-circle-outline',
                    color:'green',
                    size:'20'
                  }
                })
              }else {
                return h('Icon',{
                  props:{
                    type:'md-close-circle',
                    color:'red',
                    size:'20'
                  }
                })
              }

            }
          },
          {
            key: 'supportV6',
            align: 'center',
            renderHeader:(h,obj) => {
              return h('div',[h('span',{},'IPv6'),h('br',{}),h('span',{},'解析')])
            },
            render:(h,params)=>{
              const row = params.row;
              if (row.supportV6==true) {
                return h('Icon',{
                  props:{
                    type:'md-checkmark-circle-outline',
                    color:'green',
                    size:'20'
                  }
                })
              }else {
                return h('Icon',{
                  props:{
                    type:'md-close-circle',
                    color:'red',
                    size:'20'
                  }
                })
              }
            }
          },
          {
            key: 'v4http',
            align: 'center',
            renderHeader:(h,obj) => {
              return h('div',[h('span',{},'IPv4'),h('br',{}),h('span',{},'HTTP')])
            },
            render:(h,params) => {
              const row = params.row;
              if (row.v4http=='success'){
                return h('Icon',{
                  props:{
                    type:'md-checkmark-circle-outline',
                    color:'green',
                    size:'20'
                  }
                })
              }else {
                return h('Icon',{
                  props:{
                    type:'md-close-circle',
                    color:'red',
                    size:'20'
                  }
                })
              }
            }
          },
          {
            key: 'v4https',
            align: 'center',
            renderHeader:(h,obj) => {
              return h('div',[h('span',{},'IPv4'),h('br',{}),h('span',{},'HTTPS')])
            },
            render:(h,params) => {
              const row = params.row;
              if (row.v4https=='success'){
                return h('Icon',{
                  props:{
                    type:'md-checkmark-circle-outline',
                    color:'green',
                    size:'20'
                  }
                })
              }else {
                return h('Icon',{
                  props:{
                    type:'md-close-circle',
                    color:'red',
                    size:'20'
                  }
                })
              }
            }
          },
          {
            key: 'v6http',
            align: 'center',
            renderHeader:(h,obj) => {
              return h('div',[h('span',{},'IPv6'),h('br',{}),h('span',{},'HTTP')])
            },
            render:(h,params) => {
              const row = params.row;
              if (row.v6http=='success'){
                return h('Icon',{
                  props:{
                    type:'md-checkmark-circle-outline',
                    color:'green',
                    size:'20'
                  }
                })
              }else {
                return h('Icon',{
                  props:{
                    type:'md-close-circle',
                    color:'red',
                    size:'20'
                  }
                })
              }
            }
          },
          {
            key: 'v6https',
            align: 'center',
            renderHeader:(h,obj) => {
              return h('div',[h('span',{},'IPv6'),h('br',{}),h('span',{},'HTTPS')])
            },
            render:(h,params) => {
              const row = params.row;
              if (row.v6https=='success'){
                return h('Icon',{
                  props:{
                    type:'md-checkmark-circle-outline',
                    color:'green',
                    size:'20'
                  }
                })
              }else {
                return h('Icon',{
                  props:{
                    type:'md-close-circle',
                    color:'red',
                    size:'20'
                  }
                })
              }
            }
          },
          {
            title:'评分',
            key:'score',
            width:'80',
            align: 'center',
            render:(h,params) => {
              if (params.row.score<60){
                return h('span',{style:{color:'red','font-size': '14px'}},params.row.score)
              } else{
                return h('span',{style:{color:'green','font-size': '14px'}},params.row.score)
              }

            }
          }
        ],
        Tdata: [],
        formInline:{
          domain:''
        }
      }
    },
    watch:{

    },
    methods:{
      getDeviceDetail(){
        let that = this;
        this.axios.get('/api/').then(function (response) {
          that.terminal=response.data;
          that.Tdata = response.data.top;
          }).catch(function (error) {
            console.log(error);
        });
      },
      toResolve(){
        this.$refs['formInline'].validate((valid) => {
          if (valid) {
            // 访问后端
            let that = this;
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
                  h('div', '系统正在分析中，请稍等...')
                ])
              }
            });
            this.axios.post('/api/checkV6',{domain:this.formInline.domain}).then(function (response) {
              that.Tdata.splice(0,0,response.data)
              if (that.Tdata.length>5){
                let temp = that.Tdata.slice(0,5);
                that.Tdata = temp;
              }
              let v4HttpSpeed = response.data.v4HttpSpeed || null;
              let v4HttpsSpeed = response.data.v4HttpsSpeed || null;
              let v6HttpSpeed = response.data.v6HttpSpeed || null;
              let v6HttpsSpeed = response.data.v6HttpsSpeed || null;
              let speedArr = [];
              const getNum = function (val) {
                if (val>=199 && val<500){
                  return 4;
                }
                if (val<199){
                  return 5;
                }
                if (val>=500 && val <1000) {
                  return 3;
                }
                if (val>=1000 && val<2000){
                  return 2;
                }
                if (val>=2000){
                  return 1;
                }
              }
              that.speedDomain = that.formInline.domain;
              if (v4HttpSpeed) {
                that.speed = true;
                let startAmount = getNum(v4HttpSpeed.avg);
                speedArr = speedArr.concat([Object.assign(v4HttpSpeed,{name:'IPv4 HTTP',n:startAmount})]);
              }
              if (v4HttpsSpeed) {
                that.speed = true;
                let startAmount = getNum(v4HttpsSpeed.avg);
                speedArr = speedArr.concat([Object.assign(v4HttpsSpeed,{name:'IPv4 HTTPS',n:startAmount})]);
              }
              if (v6HttpSpeed) {
                that.speed = true;
                let startAmount = getNum(v6HttpSpeed.avg);
                speedArr = speedArr.concat([Object.assign(v6HttpSpeed,{name:'IPv6 HTTP',n:startAmount})]);
              }
              if (v6HttpsSpeed) {
                that.speed = true;
                let startAmount = getNum(v6HttpsSpeed.avg);
                speedArr = speedArr.concat([Object.assign(v6HttpsSpeed,{name:'IPv6 HTTPS',n:startAmount})]);
              }
              console.log(speedArr.toString())
              that.speedList=speedArr;
              that.$Spin.hide();
              that.search=true;
              that.$Message.success('分析成功！')
            }).catch(function (error) {
              that.$Spin.hide();
              that.$Message.error('域名无法解析！')
              console.log(error);
            });
          }
        })
      },
      rowClassName (row, index) {
        if (index === 0 && this.search == true) {
          return 'demo-table-error-row';
        }
        return '';
      }
    },
    mounted() {
      this.getDeviceDetail()
    }
  }
</script>
