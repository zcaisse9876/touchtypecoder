<template>
  <div id="app">
    <div class="main">
      <SidebarMenu id="app-menu" :menu="menu" :collapsed="true" :width="'13rem'">
        <span slot="footer"></span>
        <span slot="header"></span>
        <span slot="toggle-icon"><i class="fa fa-expand" aria-hidden="true"></i></span>
        <span slot="dropdown-icon"><i class="fa fa-caret-down" aria-hidden="true"></i></span>
      </SidebarMenu>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import { SidebarMenu } from 'vue-sidebar-menu';

  export default {
    name: 'touchtypecoder',
    components: {
      SidebarMenu,
    },
    data() {
      return {
        menu: [
          {
            href: { name: 'landing-page' },
            title: 'Type',
            icon: 'fa fa-keyboard-o',
          },
          {
            href: { name: 'Create' },
            title: 'Create',
            icon: 'fa fa-pencil-square-o',
          },
          {
            href: { name: 'Stats' },
            title: 'Statistics',
            icon: 'fa fa-area-chart',
          },
          {
            href: { name: 'Profile' },
            title: 'Profile',
            icon: 'fa fa-user',
            child: [
              {
                href: { name: 'Profile' },
                title: 'View Profile',
              },
              {
                href: { name: 'Profile' },
                title: 'Sign Out',
              },
            ],
          },
        ],
      };
    },
    methods: {
      handleClick(name) {
        this.$router.push({ name });
      },
    },
  };
</script>

<style>
  @import 'assets/font-awesome-4.7.0/css/font-awesome.min.css';
  @import '../../node_modules/vue-sidebar-menu/dist/vue-sidebar-menu.css';
  #app-menu:focus { outline: 0 !important; }
</style>
