<template>
	<f7-page class="routelist">
		<f7-navbar title="Route" back-link=" ">
		</f7-navbar>
		
		<f7-list v-if="routes && routes.length > 0">
			<f7-list-item 
				 v-for="route in routes"
				:title="route.Name "
				:key="route.Name"
				@click="openRoute(route.AppRouteId)"
				style="font-weight: 600; font-size: 14px; color: #595959"
				>
				<!-- <f7-accordion-content style="font-weight: 500">
					<f7-block class='clientinfo'>
						<f7-block-title>Info</f7-block-title>
						<f7-block class="infocontainer">
							<div>Phone: <a v-bind:href="phone(client.Phone)">{{ client.Phone }}</a></div>
							<div>Email: {{ client.Email }}</div>
						</f7-block>
					</f7-block>
					<f7-block class='clientinfo'>
						<f7-block-title>Addresses</f7-block-title>
						<f7-block class="infocontainer" v-for="address in client.AppAddresses" :key="address.Id">
							<div>Street: {{ address.Street }}</div>
							<div>City: {{ address.City }}</div>
							<div>Postal Code: {{ address.PostalCode }}</div>
							<f7-chip class="service-badge"
									@click="removeService"
							        deleteable media-bg-color="green"
									v-for="service in address.AppServices"
									:key="service.Id"
									v-bind:text="serviceType(service.AppServiceType, service.Frequency)">
							</f7-chip>
						</f7-block>


					</f7-block>
				</f7-accordion-content> -->

				
			</f7-list-item>
		</f7-list>

		
	</f7-page>
	
</template>

<style scoped>
.navbar-inner .right {
	margin-right: 5px;
	font-size: 15px;
}
.list-block .sortable-handler {
	visibility: visible !important;
	opacity: 1 !important;
}
.clientlist {
	padding-bottom: 20px;
}
.clientinfo {
	border: 1px solid #f4f4f4;
	margin: auto;
	margin-bottom: 5px !important;
	width: 99%;
	padding-left: 0;
	padding-right: 0;
}
.clientinfo .block-title {
	font-weight: 600;
	margin-top: 10px;
	margin-bottom: 10px;
}
.clientinfo .infocontainer {
	padding-bottom: 5px;
	margin-bottom: 5px;
}
.service-badge {
    font-size: 11px;
    background-color: #61a848;
    color: white;
    border-radius: 13px;
    /* border-bottom-left-radius: 3px; */
    padding-left: 7px;
	padding-right: 8px;
	height: 28px;
	line-height: 28px;
}
.service-badge .chip-delete {
	color: white;
}
.accordion-item-opened .accordion-item-content {
	box-shadow: 0px 0px 6px 0px inset;
}
.sheet-client-details .left {
	padding: 5px;
	padding-left: 15px;
	font-weight: 600;
}
</style>

<script>

import { mapGetters, mapActions } from 'vuex'

export default {
    name: "Clients",
	data: function () {
		return {
			sorting: false,
			// clients: [],
		}
	},
	computed: mapGetters({
		UserModel: 'User/UserModel',
		routes: 'RouteModel/Routes',
	}),
    mounted() {
		let instance = this;
		instance.getRoutes();

		$(window).on("popstate", function() {
			instance.closeViewDetails();
		})
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
		}
		
	},
    created() {
	}
};
</script>
