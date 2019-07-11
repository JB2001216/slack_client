import electron from 'electron';
import Vue from 'vue';
import Router from 'vue-router';
import SpaceAdd1 from './views/single/space-add/SpaceAdd1.vue';
import SpaceAdd2 from './views/single/space-add/SpaceAdd2.vue';
import Login from './views/single/login/Login.vue';
import LoginSms from './views/single/login/LoginSms.vue';
import LoginInvitation from './views/single/login/LoginInvitation.vue';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/space-add1',
      name: 'space-add1',
      component: SpaceAdd1,
    },
    {
      path: '/space-add2/:email/:token',
      name: 'space-add2',
      component: SpaceAdd2,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/login-sms',
      name: 'login-sms',
      component: LoginSms,
    },
    {
      path: '/login-invitation',
      name: 'login-invitation',
      component: LoginInvitation,
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    // },
    { path: '*', redirect: (to) => ({ name: 'space-add1' }) },
  ],
});

// ブラウザ経由
electron.ipcRenderer.on('open-url', (ev: any, urlraw: string) => {
  const match = urlraw.match(new RegExp(`^${process.env.VUE_APP_URL_SCHEME}://([a-zA-Z0-9_-]+)`));
  if (match) {
    const method = match[1];
    const url = new URL(urlraw);
    const sparams = url.searchParams;
    if (method === 'create_space') {
      router.push({
        name: 'space-add2',
        params: {
          email: sparams.get('email') || '',
          token: sparams.get('token') || '',
        },
      });
    }
  }
});

export default router;
