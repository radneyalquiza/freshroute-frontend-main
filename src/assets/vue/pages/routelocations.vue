<template>
	<f7-page class="routelocationslist">
		<f7-navbar title="Edit Locations for Route" back-link=" ">
		</f7-navbar>

        <f7-block style="margin-top: 1px; margin-bottom: 10px; padding-left: 5px; padding-right: 5px;" >

            <f7-list class="emps" style="margin-top: -2px" v-if="route && route.Nodes">
                <f7-list-item v-for="(node, index) in route.Nodes" :key="index" :title="node.AppClient.FirstName + ' ' + node.AppClient.LastName">
                    
                </f7-list-item>
            </f7-list>
        </f7-block>
	</f7-page>
	
</template>

<style scoped>
.navbar-inner .right {
	margin-right: 5px;
	font-size: 15px;
}
</style>

<script>

import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import _ from 'lodash'
import draggable from 'vuedraggable'

export default {
    name: "RouteLocations",
    components: {
        draggable
    },
	data: function () {
		return {
			sorting: false,
            route: null,
            clients: null
		}
	},
	computed: {
		...mapGetters({
			UserModel: 'User/UserModel',
			activeRoute: 'RouteModel/ActiveRoute'
		})
	},
	watch: {
	},
    mounted() {
		let instance = this;
		instance.getRoutes();

        instance.route = JSON.parse(JSON.stringify(instance.activeRoute));
        
        instance.$firebase.database().ref("AppClients")
        .once("value", function(data) {
            let c = data.val();
            for(var x in c) {
                c[x].AppClientId = x;
                instance.clients.push(c[x]);
            }
        });

	},
	methods: {
		...mapActions({
			getRoutes: 'RouteModel/getRoutes',
			selectActiveRoute: 'RouteModel/selectActiveRoute'
		}),
		
		
	},
    created() {
	}
};
</script>
