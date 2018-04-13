<template>
	<f7-page class="routelist">
		<f7-navbar title="Edit Route" back-link=" ">
		</f7-navbar>
		
		

		
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
		// instance.getRoutes();

		$(window).on("popstate", function() {
			instance.closeViewDetails();
		})
	},
	methods: {
		...mapActions({
			getRoutes: 'RouteModel/getRoutes',
		}),
		
	},
    created() {
	}
};
</script>
