<template>
	<f7-page navbar-fixed>
		<f7-navbar v-bind:title="title">
			<f7-nav-right>
				<f7-link :close-popup="true" @click="closeEdit()">Close</f7-link>
			</f7-nav-right>
		</f7-navbar>

		<!-- ADD OR EDIT CLIENT -->
		<f7-block v-if="client">
			<f7-block-title>Customer Info</f7-block-title>
			<div class="list no-hairlines-md">
				<ul>
					<li class="item-content item-input">
						<div class="item-inner">
							<div class="item-title">First Name</div>
							<div class="item-input-wrap">
								<f7-input type="text" :value="client.FirstName"
									@input="client.FirstName = $event.target.value" placeholder="" clear-button></f7-input>
								<span class="input-clear-button" @click="client.FirstName = ''"></span>
							</div>
						</div>
					</li>
					<li class="item-content item-input">
						<div class="item-inner">
							<div class="item-title">Last Name</div>
							<div class="item-input-wrap">
								<f7-input type="text" :value="client.LastName"
									@input="client.LastName = $event.target.value" placeholder="" clear-button></f7-input>
								<span class="input-clear-button" @click="client.LastName = ''"></span>
							</div>
						</div>
					</li>
					<li class="item-content item-input" v-bind:class="{ 'item-input-with-value': client.Phone }">
						<div class="item-inner">
							<div class="item-title" >Phone</div>
							<div class="item-input-wrap">
								<masked-input :class="{ 'input-with-value': client.Phone }" v-model="client.Phone" mask="\+\1 111 111-1111" placeholder="" type="tel" />
								<span class="input-clear-button" @click="client.Phone = ''"></span>
							</div>
						</div>
					</li>
					<li class="item-content item-input">
						<div class="item-inner">
							<div class="item-title">E-mail</div>
							<div class="item-input-wrap">
								<f7-input type="email" :value="client.Email"
									@input="client.Email = $event.target.value" placeholder="" clear-button></f7-input>
								<span class="input-clear-button" @click="client.Email = ''"></span>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</f7-block>

		<!-- EDIT CLIENT ADDRESS -->
		<f7-block v-if="client && client.AppAddresses" >
			<f7-block-title>Address Info</f7-block-title>

			<div class="list no-hairlines-md" v-for="caddress in client.AppAddresses" :key="caddress.AppAddressId">

				<ul>
					<li class="item-content item-input">
						<div class="item-inner">
							<div class="item-title">Street Address</div>
							<div class="item-input-wrap">
								<f7-input type="text" :value="caddress.Street"
									@input="caddress.Street = $event.target.value" placeholder="" clear-button></f7-input>
								<span class="input-clear-button" @click="caddress.Street = ''"></span>
							</div>
						</div>
					</li>
					<li class="item-content item-input">
						<div class="item-inner">
							<div class="item-title">City</div>
							<div class="item-input-wrap">
								<f7-input type="text" :value="caddress.City"
									@input="caddress.City = $event.target.value" placeholder="" clear-button></f7-input>
								<span class="input-clear-button" @click="caddress.City = ''"></span>
							</div>
						</div>
					</li>
					<li class="item-content item-input" v-bind:class="{ 'item-input-with-value': caddress.PostalCode }">
						<div class="item-inner">
							<div class="item-title" >Postal Code</div>
							<div class="item-input-wrap">
								<masked-input :class="{ 'input-with-value': caddress.PostalCode }" v-model="caddress.PostalCode" mask="A1A 1A1" placeholder="" type="tel" />
								<span class="input-clear-button" @click="caddress.PostalCode = ''"></span>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</f7-block>

		<f7-button v-if="!exist" style="width:95%; margin:auto;" @click="updateClient()" big :fill=true raised color="blue">Update</f7-button>
		
		<f7-block></f7-block>
	</f7-page>
</template>

<style scoped>
.servicetype,
.frequency,
.rate {
	margin-top: 5px;
	margin-bottom: 5px;
}
.list li.active {
	background-color: #38597a;
	color: white;
}
.list .item-title {
	font-size: 0.8em;
	color: #a0a0a0;
}
.md .block-title {
	font-weight: 600;
}
</style>

<script>
import { mapGetters, mapActions } from "vuex";
import GoogleMapsLoader from "google-maps";
import axios from "axios";
import _ from "lodash";
import MaskedInput from "vue-masked-input";

const gmapkey = "AIzaSyBLXvlal6niC0b49NWSorcdFV9cQT3Y754";
const firstAndOnly = v => v[Object.keys(v)[0]];

export default {
	components: {
		MaskedInput
	},
	props: ["caller", "appclientid", "exist"],
	data: function() {
		return {
			address: null,
			client: null,
			selectedCustomerId: null
		};
	},
	computed: {
		...mapGetters({
			activeClient: "ClientModel/ActiveClient"
		}),
		title: function() {
		return "Edit Client";
		}
	},
	created() {},
	mounted() {
		let instance = this;

			if (!instance.activeClient)
				instance.getClient(instance.appclientid);

			// NOTE: client will contain AppAddresses (for now only 1 address)
			// in edit mode
			instance.client = JSON.parse(JSON.stringify(instance.activeClient));		
	},
	methods: {
		...mapActions({
			deselectClient: "ClientModel/deselectClient",
			getClient: "ClientModel/getClient",
			__updateActiveRouteDisplay: "Route/updateActiveRouteDisplay"
		}),
		// only use this when saving a record
		geocodeAddress: function(geocodeexistingaddress) {
			let instance = this;
			let street = null;
			let city = null;
			let postalcode = null;
			let addressprop = null;
			// GoogleMapsLoader.KEY = gmapkey;

			for (var x in instance.client.AppAddresses) {
				street = instance.client.AppAddresses[x].Street;
				city = instance.client.AppAddresses[x].City;
				postalcode = instance.client.AppAddresses[x].PostalCode;
				addressprop = x;
			}

			return new Promise(function(resolve, reject) {

				let geocoder = new google.maps.Geocoder();
				console.log(street + " " + city + " " + postalcode);

				geocoder.geocode(
				{
					address: street + " " + city + " " + postalcode
				},
				function(results, status) {
					instance.$f7.preloader.hide();
					if (status == google.maps.GeocoderStatus.OK) {
						instance.client.AppAddresses[addressprop].lat = results[0].geometry.location.lat();
						instance.client.AppAddresses[addressprop].lng = results[0].geometry.location.lng();
						resolve(results);
					} else {
						instance.$f7.dialog.alert(
							"Address could not be found. Please check your address again.",
							"Hold on..."
						);
						reject();
					}
				},
				function(err) {}
				);
				// });
			});
		},

		updateClient: async function() {
			let instance = this;
			let xc = null;

			instance.$f7.preloader.show();

			let gp = await instance.geocodeAddress(true);
			let cp = await instance.saveClient();

			// update other places where Client and Address is duplicated in
			let ur = await instance.updateRouteNodeData(cp,gp);

			// we will need this until there is realtime updates in the "track" page
			await instance.__updateActiveRouteDisplay(sessionStorage.getItem("SelectedAppRouteId"));
			
			instance.$f7.preloader.hide();
			instance.$f7.router.back();
		},

		// saving client will also save address
		saveClient: function() {
			let instance = this;

			return instance.$firebase
				.database()
				.ref("AppClients/" + instance.appclientid)
				.update(instance.client);
		},

		updateRouteNodeData: function(a, b) {
			let instance = this;
			let tempaddress = firstAndOnly(instance.client.AppAddresses);
			let tempclient = {
				FirstName: instance.client.FirstName,
				LastName: instance.client.LastName,
				Phone: instance.client.Phone,
				Email: instance.client.Email,
				AppClientId: instance.client.AppClientId
			};
			console.log(tempclient);
			instance.$firebase
				.database()
				.ref("AppRoutes")
				.once("value", function(routesSnap) {
					let routes = routesSnap.val();
					for (var x in routes) {
						let nodes = routes[x].Nodes;
						for (var y in nodes) {

							if ( nodes[y].AppAddress.AppAddressId == tempaddress.AppAddressId )
							{
								instance.$firebase
								.database()
								.ref("AppRoutes/" + x + "/Nodes/" + y + "/AppAddress")
								.update(tempaddress);
								// break;
							}
							if (nodes[y].AppClient.AppClientId == tempclient.AppClientId) {
								instance.$firebase
								.database()
								.ref("AppRoutes/" + x + "/Nodes/" + y + "/AppClient")
								.update(tempclient);
								// break;
							}
						}
					}
				});
		},
		
		closeEdit: function() {
			this.$f7.router.back();
		}
	}
};
</script>
