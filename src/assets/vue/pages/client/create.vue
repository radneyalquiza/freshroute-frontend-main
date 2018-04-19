<template>
    <f7-page navbar-fixed>
        <f7-navbar v-bind:title="title">
            <f7-nav-right>
                <f7-link :close-popup="true" @click="closeAdd()">Close</f7-link>
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
								<masked-input :class="{ 'input-with-value': client.Phone }" v-model="client.Phone" mask="\+\1 (111) 111-1111" placeholder="" type="tel" />
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

		<!-- ADD NEW ADDRESS -->
		<f7-block v-if="address">
            <f7-block-title>Address Info</f7-block-title>

			<div class="list no-hairlines-md">

				<ul>
					<li class="item-content item-input">
						<div class="item-inner">
							<div class="item-title">Street Address</div>
							<div class="item-input-wrap">
								<f7-input type="text" :value="address.Street"
    				        		@input="address.Street = $event.target.value" placeholder="" clear-button></f7-input>
								<span class="input-clear-button" @click="address.Street = ''"></span>
							</div>
						</div>
					</li>
					<li class="item-content item-input">
						<div class="item-inner">
							<div class="item-title">City</div>
							<div class="item-input-wrap">
								<f7-input type="text" :value="address.City"
    			        			@input="address.City = $event.target.value" placeholder="" clear-button></f7-input>
								<span class="input-clear-button" @click="address.City = ''"></span>
							</div>
						</div>
					</li>
					<li class="item-content item-input" v-bind:class="{ 'item-input-with-value': address.PostalCode }">
						<div class="item-inner">
							<div class="item-title" >Postal Code</div>
							<div class="item-input-wrap">
								<masked-input :class="{ 'input-with-value': address.PostalCode }" v-model="address.PostalCode" mask="A#A #A#" placeholder="" type="tel" />
								<span class="input-clear-button" @click="address.PostalCode = ''"></span>
							</div>
						</div>
					</li>
				</ul>
			</div>
        </f7-block>
		
        <f7-button style="width:95%; margin:auto;" @click="collectAndSave()" big :fill=true raised color="blue">Create Client</f7-button>
		
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
	data: function() {
		return {
			address: null,
			client: null,
			selectedCustomerId: null,
		};
	},
	created() {},
	mounted() {
		let instance = this;

		instance.addEmptyClient();
		instance.addEmptyAddress();

	},
	methods: {
		...mapActions({
		}),
		closeAdd: function() {
			this.$f7.router.back();
		},
		// only use this when saving a record
		geocodeAddress: function() {
			let instance = this;
			let street = null;
			let city = null;
			let postalcode = null;
			let addressprop = null;
			// GoogleMapsLoader.KEY = gmapkey;

			console.log(instance.address);

			street = instance.address.Street;
			city = instance.address.City;
			postalcode = instance.address.PostalCode;

			return new Promise(function(resolve, reject) {
				// GoogleMapsLoader.load(function(google) {

				let geocoder = new google.maps.Geocoder();
				console.log(street + " " + city + " " + postalcode);

				geocoder.geocode(
				{
					address: street + " " + city + " " + postalcode
				},
				function(results, status) {
					instance.$f7.preloader.hide();
					if (status == google.maps.GeocoderStatus.OK) {
						instance.address.lat = results[0].geometry.location.lat();
						instance.address.lng = results[0].geometry.location.lng();
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
		addEmptyClient: function() {
			this.client = {
				FirstName: "",
				LastName: "",
				Phone: "",
				Email: ""
			};
		},
		addEmptyAddress: function() {
			this.address = {
				Street: "",
				City: "",
				PostalCode: "",
				lat: null,
				lng: null,
				AppClientId: null
			};
		},
		collectAndSave: async function() {
			let instance = this;
			let xc = null;

			instance.$f7.preloader.show();

			let gp = await instance.geocodeAddress(true);
			let cp = await instance.saveClient();
			let ad = await instance.saveAddress(cp,gp);

			if(ad) instance.address.AppAddressId = ad.key;

			await instance.updateAddressId(ad);

			instance.$f7.preloader.hide();
			instance.$f7.router.back();
		},

		saveClient: function() {
			let instance = this;

			return instance.$firebase
			.database()
			.ref("AppClients")
			.push(instance.client);
		},

		saveAddress: function(cp, gp) {
			let instance = this;
			instance.address.AppClientId = cp.key;
			instance.client.AppClientId = cp.key;

			if (!gp) return;

			return instance.$firebase
				.database()
				.ref("AppClients/" + instance.client.AppClientId + "/AppAddresses")
				.push(instance.address);
		},

		updateAddressId: function(ad) {
			let instance = this;
			if (!ad) return;

			return instance.$firebase
				.database()
				.ref("AppClients/" + instance.client.AppClientId + "/AppAddresses/" + ad.key)
				.update({ AppAddressId: ad.key });

		}

	},
	computed: {
		...mapGetters({
		}),
		title: function() {
			return "Add New Client";
		}
	}
};
</script>
