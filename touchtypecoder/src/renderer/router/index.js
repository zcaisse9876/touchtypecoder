import Vue from 'vue';
import Router from 'vue-router';
import LandingPage from '@/views/LandingPage';
import CreateLayout from '@/views/CreateLayout';
import Profile from '@/views/Profile';
import Stats from '@/views/Stats';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: LandingPage,
    },
    {
      path: '/create-layout',
      name: 'Create',
      component: CreateLayout,
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
    },
    {
      path: '/stats',
      name: 'Stats',
      component: Stats,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
