<template>
	<f7-page class="clientlist">
		<f7-navbar title="Clients" back-link=" ">
		</f7-navbar>
		
		<f7-list v-if="clients.length > 0">
			<f7-list-item 
				 v-for="client in clients"
				:title="client.FirstName + ' ' + client.LastName "
				after=""
				:key="client.AppClientId"
				style="font-weight: 600; font-size: 14px; color: #595959"
				@click="setActiveClient(client)"
				sheet-open="client-details"
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

		<f7-list v-if="clients.length == 0">
			<f7-list-item
				title="No Clients."
				style="text-align: center; font-weight: 600; font-size: 14px; color: #595959"
				>
			</f7-list-item>
		</f7-list>

		<f7-fab color="orange" href="./clientform/clients">
			<f7-icon fa="plus" ></f7-icon>
		</f7-fab>

		<div class='sheet-modal sheet-client-details scrollable'>

			<div class="toolbar">
				<div class="toolbar-inner">
					<div class="left">Client Details</div>
					<div class="right"><a class="link" v-if="activeclient" @click="closeViewDetails()" v-bind:href="'./clientform/editclients/' + activeclient.AppClientId" >Edit</a></div>
				</div>
			</div>

			<div class="sheet-modal-inner" style="overflow-y: auto">
				<f7-block class='clientinfo'  v-if="activeclient">
					<f7-block-title>Info</f7-block-title>
					<f7-block class="infocontainer">
						<div>Phone: <a v-bind:href="phone(activeclient.Phone)">{{ activeclient.Phone }}</a></div>
						<div>Email: {{ activeclient.Email }}</div>
					</f7-block>
				</f7-block>
				<f7-block class='clientinfo'  v-if="activeclient">
					<f7-block-title>Addresses</f7-block-title>
					<f7-block class="infocontainer" v-for="vaddress in activeclient.AppAddresses" :key="vaddress.AppAddressId">
						<div>Street: {{ vaddress.Street }}</div>
						<div>City: {{ vaddress.City }}</div>
						<div>Postal Code: {{ vaddress.PostalCode }}</div>
					</f7-block>
				</f7-block>
			</div>
			
		</div>

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
		clients: 'Model/Clients',
		activeclient: 'Model/ActiveClient'
	}),
    mounted() {
		let instance = this;
		instance.getClients();
	},
	methods: {
		...mapActions({
			getClientsAddresses: 'Model/getClientsAddresses',
			__setActiveClient: 'Model/selectClient'
		}),
		getClients: async function() {
			let instance = this;

			instance.$f7.preloader.show();

			instance.getClientsAddresses(function() {
				instance.$f7.preloader.hide();
			});

			// get clients 
			// let x = await instance.$firebase.database().ref("AppClients")
			// 	.on("child_added", function(data) {
			// 		let client = data.val();
			// 		let k = data.key;
					
			// 		client.AppClientId = k;


			// 		// get addresses
			// 		instance.$firebase.database().ref("AppAddresses")
			// 		.orderByChild("AppClientId")
			// 		.equalTo(k)
			// 		.once("child_added", function(data) {
			// 			let d = data.val();
			// 			let kk = data.key;
			// 			d.AppAddressId = kk;
			// 			client.AppAddresses = [];
			// 			client.AppAddresses.push(d);
			// 			instance.clients.push(client);

			// 			instance.$f7.preloader.hide();
			// 		}).catch(function(err) {
			// 			console.log('No Address Found');
			// 		});

			// 	});
		},
		phone: function(num) {
			return "+1-" + num;
		},
		serviceType: function(type, freq) {
			// return "<span class='servicetype'>" + type + "</span><span class='frequency'>" + freq + "</span>";
			return type + " | " + freq;
		},
		doSomething: function() {
			this.$f7.dialog.alert("Will allow adding Clients.", "Next Release");
		},
		removeService: function() {
			this.$f7.dialog.confirm(
				"Delete this service?",
				"Confirm Delete",
				function() {
					console.log('ye?', arguments);
				},
				function() {
					console.log('no?', arguments);
				})
		},
		setActiveClient: function(client) {
			this.$f7.sheet.open(".sheet-client-details", true);
			this.__setActiveClient(client.AppClientId);
		},
		closeViewDetails: function() {
			let i = this;
			setTimeout(function() {
				i.$f7.sheet.close(".sheet-client-details", true);
			}, 500);
		}
	},
    created() {
	}
};
</script>
