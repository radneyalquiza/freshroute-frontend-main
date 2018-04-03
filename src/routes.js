export default [
  {
    path: "/",
    component: require("./assets/vue/pages/home.vue"),
    routes: [
      {
        path: "login/",
        component: require("./assets/vue/pages/login.vue")
      }
    ]
  },
  // {
  //   path: "login/",
  //   component: require("./assets/vue/pages/login.vue")
  // },
  {
    path: "/clients/",
    component: require("./assets/vue/pages/client/clients.vue")
  },
  {
    path: "/track/",
    component: require("./assets/vue/pages/track.vue"),
    routes: [
      {
        path: "addroutenode/",
        component: require("./assets/vue/pages/client/add.vue")
      },
      {
        path: "activelocation/",
        component: require("./assets/vue/components/activelocation.vue")
      }
    ]
  },
  {
    path: "/about/",
    component: require("./assets/vue/pages/about.vue")
  },
  {
    path: "/route/",
    component: require("./assets/vue/pages/route.vue")
  },
  {
    path: "/reports/",
    component: require("./assets/vue/pages/reports/reports.vue")
  },
  {
    path: "/daily/",
    component: require("./assets/vue/pages/reports/daily.vue")
  },
  {
    path: "/dynamic-route/blog/:blogId/post/:postId/",
    component: require("./assets/vue/pages/dynamic-route.vue")
  },
  {
    path: "/panel-left/",
    component: require("./assets/vue/pages/panel-left.vue")
  },
  {
    path: "/color-themes/",
    component: require("./assets/vue/pages/color-themes.vue")
  },
  {
    path: "/chat/",
    component: require("./assets/vue/pages/chat.vue")
  },
  {
    path: "/vuex/",
    component: require("./assets/vue/pages/vuex.vue")
  }
];
