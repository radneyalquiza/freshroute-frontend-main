export default [{
        path: "/",
        component: require("./assets/vue/pages/home.vue"),
        routes: [{
            path: "login/",
            component: require("./assets/vue/pages/login.vue")
        }]
    },
    // {
    //   path: "login/",
    //   component: require("./assets/vue/pages/login.vue")
    // },
    {
        path: "/clients/",
        component: require("./assets/vue/pages/client/clients.vue"),
        routes: [{
                path: "edit/:appclientid",
                component: require("./assets/vue/pages/client/edit.vue")
            },
            {
                path: "add/",
                component: require("./assets/vue/pages/client/create.vue")
            }
        ]
    },
    {
        path: "/track/",
        component: require("./assets/vue/pages/track.vue"),
        routes: [{
                path: "addroutenode/:caller",
                component: require("./assets/vue/pages/addnewclienttoroute.vue")
            },
            {
                path: "expenses/",
                loginScreen: {
                    component: require("./assets/vue/pages/expenses.vue")
                }
            },
            {
                path: "routesummary/",
                component: require("./assets/vue/components/routesummary.vue")
            },
            {
                path: "activelocation/",
                // component: require("./assets/vue/components/activelocation.vue")
            }
        ]
    },
    {
        path: "/about/",
        component: require("./assets/vue/pages/about.vue")
    },
    {
        path: "/route/",
        component: require("./assets/vue/pages/route.vue"),
        routes: [{
                path: "viewroute/",
                component: require("./assets/vue/pages/editroute.vue"),
                routes: [{
                    path: "routelocations/",
                    component: require("./assets/vue/pages/routelocations.vue"),
                    routes: [{
                        path: "addnewnode/",
                        component: require("./assets/vue/pages/addnewclienttoroute.vue")
                    }, {
                        path: "addexistingnode/",
                        component: require("./assets/vue/pages/client/addexisting.vue")
                    }]
                }]
            },
            {
                path: "addroute/",
                component: require("./assets/vue/pages/addnewclienttoroute.vue")
            }
        ]
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
    },
    {
        path: '(.*)',
        component: require("./assets/vue/pages/404.vue")
    }
];