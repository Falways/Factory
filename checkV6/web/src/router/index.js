import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const routers = [
    {
        path:'/',
        meta:{
            title:'首页'
        },
        name:'index',
        component:()=>import('../components/index.vue')
    }
]

// 路由配置
const RouterConfig = {
    routes: routers
};

export const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    next();
});

router.afterEach(route => {
    iView.LoadingBar.finish();
});