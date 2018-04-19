<template>
    <f7-page navbar-fixed>
        <f7-navbar v-bind:title="title">
            <f7-nav-right>
                <f7-link :close-popup="true" @click="closeAddRouteNode()">Close</f7-link>
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
								<masked-input :class="{ 'input-with-value': caddress.PostalCode }" v-model="caddress.PostalCode" mask="A#A #A#" placeholder="" type="tel" />
								<span class="input-clear-button" @click="caddress.PostalCode = ''"></span>
							</div>
						</div>
					</li>
				</ul>
			</div>
        </f7-block>

		<!-- ADD NEW ADDRESS -->
		<f7-block v-else-if="client && !client.AppAddresses" >
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
		<f7-block v-else>
			<f7-block-title>Select existing Client to Add</f7-block-title>
			<f7-list class="existingcustomerslist">
				<f7-list-item style="font-size: 15px;" v-for="(customer, index) in existingcustomers" :key="index">
					<label class="item-radio item-content" style="width: 100%">
						<input type="radio" 
						       name="demo-radio"
							   :checked="customer.AppClientId == selectedCustomerId"
    						   @change="selectedCustomerId = $event.target.value"
							   :value="customer.AppClientId" />
						<i class="icon icon-radio" style="margin-right: 8px; margin-left: -10px;"></i>
						<div class="item-title" style="width: 100%">
							<div style="color: #686868">
								<div class="">
									{{ customer.FirstName + " " + customer.LastName }}
								</div>
								<div class="" v-for="(addr, idx) in customer.AppAddresses" :key="idx">
									{{ addr.Street + " " + addr.City + " " + addr.PostalCode }}
								</div>
							</div>
						</div>
					</label>
					
					
					<!-- <span>{{ }}</span> -->
				</f7-list-item>
			</f7-list>
		</f7-block>
        <f7-block v-if="services && services.length">
            <f7-block-title>Service Info</f7-block-title>

            <div style="border:1px solid #e0e0e0; width:85%; text-align: center; margin:auto; padding: 8px; border-radius:3px;" v-for="serv in services" :key="serv.$index">
                <div style="display: flex">
                    <div class="servicetype" style="width:50%">
                        <f7-label style="width: auto" >Service Type</f7-label>
                        <f7-button class="servicesbutton" style="width:130px; font-size:12px; margin: auto; margin-top: 5px; " :fill=true green @click="openservicespopover = true;">
                            {{ serv.AppServiceType ? serv.AppServiceType : 'Select' }}
                        </f7-button>
                        <f7-popover target=".servicesbutton" class='services' :opened="openservicespopover == true">
                            <f7-list>
                                <f7-list-item v-bind:class="{ active: service.AppServiceType == serv.AppServiceType }" v-for="service in appservices" :key="service.$index" @click="selectService(serv, service); openservicespopover = false">
                                    {{ service.AppServiceDescription }}
                                </f7-list-item>
                            </f7-list>
                        </f7-popover>
                    </div>
                    <div class="frequency" style="width:50%" >
                        <f7-label style="width: auto" >Frequency</f7-label>
                        <f7-button class="frequenciesbutton" style="width:130px; font-size:12px; margin: auto; margin-top: 5px;" :fill=true green @click="openfrequenciespopover = true">
                            {{ serv.Frequency ? frequencyDescription(serv.Frequency) : 'Select' }}
                        </f7-button>
                        <f7-popover target=".frequenciesbutton" class='frequencies' :opened="openfrequenciespopover == true">
                            <f7-list>
                                <f7-list-item v-bind:class="{ active: fr.FrequencyType == serv.Frequency }" v-for="fr in frequencies" :key="fr.$index" @click="selectFrequency(serv, fr); openfrequenciespopover = false;">
                                    {{ fr.FrequencyDescription }}
                                </f7-list-item>
                            </f7-list>
                        </f7-popover>
                    </div>
                </div>

                <div class="rate" style="display: flex">
                    <div style="width: 30%">
                        <f7-label style="width: auto" >Rate</f7-label>
                        <span>${{ price }}</span>
                    </div>
                    <f7-range :value="serv.Price"
    			        		@range:change="updatePrice(serv, $event)" :draggableBar="true" color="orange" :label="true" :min="0.00" :max="100.00" :step="0.50" >
                    </f7-range>
                </div>
            </div>
        </f7-block>
		<f7-block v-if="(!services || !services.length) && caller == 'track'">
			<f7-button style="width:140px; margin:auto;" @click="addService()" big :fill=true raised color="blue">Add a Service</f7-button>
		</f7-block>

        <f7-button v-if="!exist" style="width:95%; margin:auto;" @click="collectAndSave()" big :fill=true raised color="blue">{{ caller=='editclients' ? 'Update' : 'Save' }}</f7-button>
		<f7-button v-else style="width:95%; margin:auto;" @click="addExistingNodeToRoute()" big :fill=true raised color="blue">Add to Route</f7-button>
		
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
      openfrequenciespopover: false,
      openservicespopover: false,
      appservices: null,
      address: null,
      client: null,
      existingcustomers: [],
      routeNode: {
        Sequence: null,
        AppClient: null,
        AppAddress: null,
        AppServices: null
	  },
	  selectedCustomerId: null,
      services: [],
      ras: [],
      frequencies: [
        {
          FrequencyType: "ONE",
          FrequencyDescription: "One-time"
        },
        {
          FrequencyType: "WEEK",
          FrequencyDescription: "Weekly"
        },
        {
          FrequencyType: "BIWEEK",
          FrequencyDescription: "Bi-weekly"
        },
        {
          FrequencyType: "MONTH",
          FrequencyDescription: "Monthly"
        },
        {
          FrequencyType: "BIMONTH",
          FrequencyDescription: "Bi-Monthly"
        },
        {
          FrequencyType: "BIANNUM",
          FrequencyDescription: "Bi-Annually"
        }
      ]
    };
  },
  created() {},
  mounted() {
    let instance = this;

    // cordova.plugins.notification.local.requestPermission(function (granted) {
    // cordova.plugins.notification.local.schedule({
    //   title: "FreshRoute Notification",
    //   text: "New Addresses will be appended to the end of the route",
    //   foreground: true,
    //   priority: 2
    // });
    // });

	// edit mode
    if (instance.appclientid) {
      // instance.$firebase.database().ref("AppClients/"+ instance.appclientid)
      // .once("value", function(data) {
      // 	let c = data.val();
      // 	instance.client = c;
      // 	instance.client.AppClientId = instance.appclientid;

      // });

		if (!instance.activeClient) {
			instance.getClient(instance.appclientid);
		}

		instance.client = JSON.parse(JSON.stringify(instance.activeClient));
		console.log("Sdsdss", instance.client);

      // if(instance.client.AppAddresses) {
      // 	instance.$firebase.database().ref("AppRouteAddressService")
      // 	.orderByChild("AppAddressesId")
      // 	.equalTo(instance.address.AppAddressesId)
      // 	.once("value", function(data) {
      // 		let ras = data.val();
      // 		console.log(ras, data.ref);

      // 	})

      // }
	}
	else if (instance.caller == "clients")
	{
	  	instance.addEmptyAddress();
	  	instance.addEmptyClient();
	}
	else if (instance.caller == "track")
	{
		console.log(instance.caller, instance.exist);
		instance.addEmptyClient();
		instance.addEmptyAddress();

		if (instance.exist == "existing") {
			console.log("empty?");
			instance.client = null;
			instance.address = null;

			instance.$firebase
			.database()
			.ref("AppClients")
			.once("value", function(data) {
				let c = data.val();
				for (var x in c) {
				c[x].AppClientId = x;
				instance.existingcustomers.push(c[x]);
				}
			});
		}

		// get the list of Services
		instance.$firebase
			.database()
			.ref("AppServices")
			.once("value", function(data) {
			instance.appservices = data.val();
				instance.services.push({
					AppServiceType: "",
					Frequency: "",
					Price: 0.0
				});
			});
    }
  },
  methods: {
    ...mapActions({
      addNodeToRoute: "Route/addNodeToRoute",
      deselectClient: "ClientModel/deselectClient",
      getClient: "ClientModel/getClient",
      updateRouteAddress: "Route/updateRouteAddress"
    }),
    closeAddRouteNode: function() {
      let instance = this;
      instance.deselectClient();
      instance.$f7.router.back();
    },
    // only use this when saving a record
    geocodeAddress: function(geocodeexistingaddress) {
      let instance = this;
      let street = null;
      let city = null;
      let postalcode = null;
      let addressprop = null;
      // GoogleMapsLoader.KEY = gmapkey;

      if (geocodeexistingaddress == true) {
        for (var x in instance.client.AppAddresses) {
          street = instance.client.AppAddresses[x].Street;
          city = instance.client.AppAddresses[x].City;
          postalcode = instance.client.AppAddresses[x].PostalCode;
          addressprop = x;
        }
      } else {
        street = instance.address.Street;
        city = instance.address.City;
        postalcode = instance.address.PostalCode;
      }

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
              if (geocodeexistingaddress == true) {
                instance.client.AppAddresses[
                  x
                ].lat = results[0].geometry.location.lat();
                instance.client.AppAddresses[
                  x
                ].lng = results[0].geometry.location.lng();
              } else {
                instance.address.lat = results[0].geometry.location.lat();
                instance.address.lng = results[0].geometry.location.lng();
              }
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
    createService: function() {
      this.services.push({
        AppServiceId: "",
        Price: null // on init, use Default Price
      });
    },
    selectService: function(serviceobj, srv) {
      serviceobj.AppServiceType = srv.AppServiceType;
    },
    selectFrequency: function(serviceobj, frq) {
      serviceobj.Frequency = frq.FrequencyType;
    },
    addService: function(service) {
      this.services.push(service);
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
    updatePrice: function(serviceobj, evt) {
      serviceobj.Price = evt;
      this.$forceUpdate();
    },

    collectAndSave: async function() {
      let instance = this;
      let xc = null;

      instance.$f7.preloader.show();

      if (instance.appclientid) {
			//   console.log('aaa');
			let gp = await instance.geocodeAddress(true);
			let cp = await instance.saveClient();
			xc = await instance.updateRouteNodeData(cp);
	  }
	  else
	  {
			let gp = await instance.geocodeAddress();
			let cp = await instance.saveClient();
			let ap = await instance.saveAddress(cp, gp);
			
			// only add to route and only add services if it is in a "track" workflow
			if (instance.caller == "track") {
				let rp = await instance.saveRouteWithNewNode(ap);
				let rn = await instance.saveServices(rp);
				xc = await instance.addNodeToLocalRoute(rn);
			}
      }

      instance.$f7.preloader.hide();
      instance.$f7.router.back();
    },

    saveClient: function() {
      let instance = this;

      // let clientpush = await instance.$firebase.database().ref('AppClients').push(instance.client);
      if (instance.appclientid) {
        //   console.log('pppppp', instance.client); return;
        return instance.$firebase
          .database()
          .ref("AppClients/" + instance.appclientid)
          .update(instance.client);
      } else {
        return instance.$firebase
          .database()
          .ref("AppClients")
          .push(instance.client);
        // instance.client.AppClientId = clientpush.key;
      }
    },

    saveAddress: function(cp, gp) {
      let instance = this;
      // let addresspush = await instance.$firebase.database().ref('AppAddresses').push(instance.address);
      instance.address.AppClientId = cp.key;
      instance.client.AppClientId = cp.key;

      if (!gp) return;

      return instance.$firebase
        .database()
        .ref("AppClients/" + instance.client.AppClientId + "/AppAddresses")
        .push(instance.address);
      // instance.address.AppAddressesId = addresspush.key;
    },

    saveRouteWithNewNode: function(ap) {
      let instance = this;
      instance.address.AppAddressesId = ap.key;
      let routelength = instance.route.length;

      instance.routenode = {
        AppClient: instance.client,
        AppAddress: instance.address,
        Sequence: routelength // the current zero index + 1
      };

      return instance.$firebase
        .database()
        .ref("AppRoutes/" + instance.routeid + "/Nodes")
        .push(instance.routenode);
	},
	
    updateRouteNodeData: function(a) {
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

    saveServices: function(rn) {
      console.log(rn);
      let instance = this;
      let nodekey = rn.key;

      if (
        instance.services[0] &&
        (!instance.services[0].AppServiceType ||
          !instance.services[0].Frequency ||
          !instance.services[0].Price)
      )
        return;

      return instance.$firebase
        .database()
        .ref(
          "AppRoutes/" + instance.routeid + "/Nodes/" + nodekey + "/AppServices"
        )
        .push(instance.services[0]); // only 1 service per address for now
    },

    frequencyDescription: function(val) {
      let instance = this;
      let s = _.find(instance.frequencies, function(obj) {
        return obj.FrequencyType.toLowerCase() === val.toLowerCase();
      });
      return s.FrequencyDescription;
    },

    addNodeToLocalRoute: function(np) {
      let instance = this;

      instance.routenode.AppServices = {};
      instance.routenode.AppServices[np.key] = instance.services[0];
      instance.addNodeToRoute(instance.routenode);

      //   instance.$firebase
      //     .database()
      //     .ref(
      //       "AppRoutes/" +
      //         instance.routeid +
      //         "/Nodes/" +
      //         instance.routenode.Sequence +
      //         "/AppServices"
      //     )
      //     .once("value", function(data) {
      // 	  let s = data.val();
      // 	  console.log("ssss", s);
      //       instance.routenode.AppServices = {};
      //       for (var p in s) {
      //         instance.routenode.AppServices[p] = s[p];
      //         break;
      // 	  }
      // 	  console.log("QQQQQQ", instance.routenode);

      //       instance.addNodeToRoute(instance.routenode);
      //     });
    },
    addExistingNodeToRoute() {
		let instance = this;
		// for now only 1 service per location. if multiple services, add customer multiple times
		let service = instance.services[0]; 

		let customer = _.find(instance.existingcustomers, function(obj) {
			return obj.AppClientId == instance.selectedCustomerId;
		});

	}
  },
  computed: {
    ...mapGetters({
      routename: "Route/RouteName",
      route: "Route/Route",
      routeid: "Route/RouteId",
      activeClient: "ClientModel/ActiveClient"
    }),
    price: function() {
      let instance = this;
      return parseFloat(instance.services[0].Price).toFixed(2);
    },
    title: function() {
      return "Add New Client to " + this.routename;
    }
  }
};
</script>
