<template>
    <!-- App -->
    <div id="app">

        <f7-statusbar></f7-statusbar>

        <f7-panel left cover layout="dark">
            <f7-view url="/panel-left/" links-view=".view-main" />
        </f7-panel>

        <f7-views>
            <f7-view id="main-view" main url="/" ></f7-view>
        </f7-views>

        <!-- Login Screen -->
		<login v-if="!UserModel"></login>

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
            gotroutes: false
        }
    },
    components: {
        Login,
    },
    computed: {
        ...mapGetters({
            UserModel: 'User/UserModel',
        })
    },
    mounted() {
        console.log(this.$device)
    },
    
}
</script>