<template>
    <!-- App -->
    <div id="app">

        <f7-statusbar></f7-statusbar>

        <!-- <f7-panel left cover layout="dark">
            <f7-view url="/panel-left/" links-view=".view-main" />
        </f7-panel> -->

        <f7-view id="main-view" :main="true" url="/" ></f7-view>

        <!-- Login Screen -->
		<!-- <login v-if="!UserModel"></login> -->

    </div>
</template>

<style>
    .notification {
        background-color: black;
        color: white;
    }
	.homepage {
		text-align: center;
	}
	.welcome {
		font-size: 18px;
	}
	.red {
		color: red;
	}
	.trackbutton {
		width: 60%;
		margin: auto;
	}
	.loginstat,
	.loginstatlabel {
		font-size: 13px;
		display: block;
		float: left;
		line-height: 10px;
	}
	.loginstat {
		transform: translate(-31px,8px);
		font-weight: 600;
	}
	.loginstatlabel {
		transform: translateY(-8px);
		font-size: 12px;
	}
</style>
<script>
import Login from './assets/vue/pages/login.vue'
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'

export default {
    data: function() {
        return {
            username: "",
            useragent: "",
            gotroutes: false,
            pollGPS: null,
            pollRate: 5000
        }
    },
    components: {
        Login,
    },
    computed: {
        ...mapGetters({
            UserModel: 'User/UserModel',
            CurrentLocation: 'User/currentLocation'
        })
    },
    mounted() {},
    methods: {
        ...mapActions({
            __getCurrentLocation:	'User/getCurrentLocation',
            // __populateModelData: 'Model/getModelData',
            __findUser: 'User/findUser',
            __getUserRoutes: 'User/getRoutesOfUser',
            __selectRoute: 'User/setSelectedAppRouteId'
        }),
        onF7Ready: function() {
            let instance = this;
            var root = this.$root;

            document.addEventListener('backbutton', function(e) {
                if(instance.Dom7(".popover").length > 0) {
                    instance.$f7.popover.close(".popover", true);
                    e.preventDefault();
                    return false;
                }
                else if(instance.Dom7(".popup").length > 0) {
                    instance.$f7.popup.close(".popup", true);
                    e.preventDefault();
                    return false;
                }
                else if(instance.Dom7(".dialog").length > 0) {
                    instance.$f7.dialog.close(".dialog", true);
                    e.preventDefault();
                    return false;
                }
            })

            if(!sessionStorage.getItem("AppUserId")) {
                // setTimeout(function() {
                    instance.$f7.router.navigate({
                        url: './login/',
                        pushState: true,
                        // history: false,
                        clearPreviousHistory: true,
                        reloadAll: true,
                        ignoreCache : true
                    });
                // }, 100)
            }
            else {
                instance.__findUser(sessionStorage.getItem("AppUserId").toString());
                instance.$root.CurrentUserJobModel = root.JobModel;
            }
        }
    }
    
}
</script>
