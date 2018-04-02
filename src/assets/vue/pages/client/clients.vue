<template>
	<f7-page class="clientlist">
		<f7-navbar title="Clients" back-link=" ">
		</f7-navbar>
		
		<f7-list v-if="clients.length > 0">
			<f7-list-item 
				accordion-item v-for="client in clients"
				:title="client.FirstName + ' ' + client.LastName "
				after=""
				:key="client.Id"
				style="font-weight: 600; font-size: 14px; color: #595959"
				>
				<f7-accordion-content style="font-weight: 500">
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
							<!-- <f7-badge class='service-badge' v-for="service in address.AppServices" color="green">
								{{ service.AppServiceType }} | {{ service.Frequency }}
							</f7-badge> -->
							<f7-chip class="service-badge"
									@click="removeService"
							        deleteable media-bg-color="green"
									v-for="service in address.AppServices"
									:key="service.Id"
									v-bind:text="serviceType(service.AppServiceType, service.Frequency)">
							</f7-chip>
						</f7-block>


					</f7-block>
				</f7-accordion-content>
			</f7-list-item>
		</f7-list>

		<f7-list v-if="clients.length == 0">
			<f7-list-item
				title="No Clients."
				style="text-align: center; font-weight: 600; font-size: 14px; color: #595959"
				>
			</f7-list-item>
		</f7-list>

		<f7-fab style="transform:translateY(-50px);" color="orange" @click="doSomething">
			<f7-icon icon="icon-plus" ></f7-icon>
		</f7-fab>

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
.clientinfo .content-block-title {
	font-weight: 600;
	padding-top: 1px;
}
.clientinfo .infocontainer {
	padding-bottom: 15px;
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

</style>

<script>

import { mapGetters, mapActions } from 'vuex'

export default {
    name: "Clients",
	data: function () {
		return {
			sorting: false,
			clients: []
		}
	},
	computed: mapGetters({
		UserModel: 'User/UserModel',
		Model: 'Model/Model'
	}),
    mounted() {
		let instance = this;

		showPreloader();

		setTimeout(function() {
			hidePreloader();
			instance.clients = instance.UserModel.AppClients || [];
		}, 1000);

		// Dom7.ajax({
		// 	url: "http://localhost:5000/api/clients/GetByAppUser",
		// 	method: "POST",
		// 	dataType: "json",
		// 	contentType: "application/json",
		// 	beforeSend: function() {
		// 		showPreloader();
		// 	},
		// 	data: JSON.stringify({
		// 		AppUserId: sessionStorage.getItem("AppUserId") ? parseInt(sessionStorage.getItem("AppUserId")) : 0,
		// 	}),
		// 	success: function(response) {
		// 		hidePreloader();
		// 		console.log('dsdsds', response);
		// 		if(response && response.length) {
		// 			instance.clients = response;
		// 		}
		// 	},
		// 	statusCode: {
		// 		400: function (xhr) {
		// 			hidePreloader();
		// 			var respjson = parseResponseText(xhr.responseText);
		// 		}
		// 	}
		// });
	},
	methods: {
		phone: function(num) {
			return "+1-" + num;
		},
		serviceType: function(type, freq) {
			// return "<span class='servicetype'>" + type + "</span><span class='frequency'>" + freq + "</span>";
			return type + " | " + freq;
		},
		doSomething: function() {
			this.$f7.alert("Will allow adding Clients.", "Next Release");
		},
		removeService: function() {
			this.$f7.confirm(
				"Delete this service?",
				"Confirm Delete",
				function() {
					console.log('ye?', arguments);
				},
				function() {
					console.log('no?', arguments);
				})
		}
	},
    created() {
	}
};
</script>
