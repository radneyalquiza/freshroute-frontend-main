<template>
	<f7-page class="routelist">
		<f7-navbar title="Routes" back-link=" ">
		</f7-navbar>
		
		<div class="list media-list">
			<ul>
				<li v-for="route in routes" :key="route.Name">
					<a class="item-link item-content" @click="openRoute(route.AppRouteId)">
						<div class="item-inner">
						<div class="item-title-row">
							<div class="item-title">{{ route.Name }}</div>
							<div class="item-after">{{ date(route.createdate) }}</div>
						</div>
						<div class="item-subtitle">Created by: {{ route.creator }} </div>
						<div class="item-text"></div>
						</div>
					</a>
				</li>
			</ul>
		</div>

		<f7-fab color="orange" href="./addroute/">
			<f7-icon fa="plus" ></f7-icon>
		</f7-fab>

	</f7-page>
	
</template>

<style scoped>
.navbar-inner .right {
	margin-right: 5px;
	font-size: 15px;
}
.item-title {
	font-weight: 600;
	color: #6d6d6d;
}
.item-after {
	font-size: 12px !important;
}
.item-subtitle {
	color: #6d6d6d;
	font-size: 12px !important;
}
</style>

<script>

import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'

export default {
    name: "Route",
	data: function () {
		return {
			sorting: false,
		}
	},
	computed: {
		...mapGetters({
			UserModel: 'User/UserModel',
			routes: 'RouteModel/Routes',
		})
	},
    mounted() {
		let instance = this;
		instance.getRoutes();
	},
	methods: {
		...mapActions({
			getRoutes: 'RouteModel/getRoutes',
			selectActiveRoute: 'RouteModel/selectActiveRoute'
		}),
		openRoute: function(approuteid) {
			let instance = this;
			instance.selectActiveRoute(approuteid);
			setTimeout(function() {
				instance.$f7.router.navigate({ url: "./viewroute/" })
			});
		},
		date: function(date) {
			return moment(date).format("lll")
		}
		
	},
    created() {
	}
};
</script>
