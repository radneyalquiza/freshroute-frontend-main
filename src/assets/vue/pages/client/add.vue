<template>
    <f7-page navbar-fixed>
        <f7-navbar v-bind:title="'Add to ' + routename">
            <f7-nav-right>
                <f7-link :close-popup="true" @click="closeAddRouteNode()">Close</f7-link>
            </f7-nav-right>
        </f7-navbar>
        <f7-block>
            <f7-block-title>Customer Info</f7-block-title>
            <f7-list no-hairlines-md>
                <f7-list-item>
                    <!-- <f7-icon icon="demo-list-icon" slot="media"></f7-icon> -->
                    <f7-label floating>First Name</f7-label>
                    <f7-input type="text" :value="client.FirstName"
    			        		@input="client.FirstName = $event.target.value" placeholder="Your name" clear-button></f7-input>
                </f7-list-item>
                <f7-list-item>
                    <!-- <f7-icon icon="demo-list-icon" slot="media"></f7-icon> -->
                    <f7-label floating>Last Name</f7-label>
                    <f7-input type="text" :value="client.LastName"
    			        		@input="client.LastName = $event.target.value" placeholder="Your name" clear-button></f7-input>
                </f7-list-item>

                <f7-list-item>
                    <!-- <f7-icon icon="demo-list-icon" slot="media"></f7-icon> -->
                    <f7-label floating>Phone</f7-label>
                    <f7-input type="tel" :value="client.Phone"
    			        		@input="client.Phone = $event.target.value" placeholder="Your phone number" clear-button></f7-input>
                </f7-list-item>

                <f7-list-item>
                    <!-- <f7-icon icon="demo-list-icon" slot="media"></f7-icon> -->
                    <f7-label floating>E-mail</f7-label>
                    <f7-input type="email" :value="client.Email"
    			        		@input="client.Email = $event.target.value" placeholder="Your e-mail" clear-button></f7-input>
                </f7-list-item>

            </f7-list>
        </f7-block>

        <f7-block>
            <f7-block-title>Address Info</f7-block-title>
            <f7-list no-hairlines-md>
                <f7-list-item>
                    <!-- <f7-icon icon="demo-list-icon" slot="media"></f7-icon> -->
                    <f7-label floating>Street Address</f7-label>
                    <f7-input type="text" :value="address.Street"
    			        		@input="address.Street = $event.target.value" placeholder="Your name" clear-button></f7-input>
                </f7-list-item>
                <f7-list-item>
                    <!-- <f7-icon icon="demo-list-icon" slot="media"></f7-icon> -->
                    <f7-label floating>City</f7-label>
                    <f7-input type="text" :value="address.City"
    			        		@input="address.City = $event.target.value" placeholder="Your name" clear-button></f7-input>
                </f7-list-item>

                <f7-list-item>
                    <!-- <f7-icon icon="demo-list-icon" slot="media"></f7-icon> -->
                    <f7-label floating>Postal Code</f7-label>
                    <f7-input type="text" :value="address.PostalCode"
    			        		@input="address.PostalCode = $event.target.value" placeholder="Your phone number" clear-button></f7-input>
                </f7-list-item>

            </f7-list>
        </f7-block>

        <f7-block>
            <f7-block-title>Service Info (for now 1 service per Address)</f7-block-title>
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
                        <span>${{ serv.Price }}</span>
                    </div>
                    <f7-range :value="serv.Price"
    			        		@range:change="updatePrice(serv, $event)" :draggableBar="true" color="orange" :label="true" :min="0" :max="100" :step="5" >
                    </f7-range>
                </div>
            </div>
        </f7-block>

        <f7-button style="width:95%; margin:auto;" @click="collectAndSave()" big :fill=true raised color="blue">Save</f7-button>

        <f7-block></f7-block>
    </f7-page>
</template>

<style>
.servicetype, .frequency, .rate { margin-top: 5px; margin-bottom: 5px; }
.list li.active {  background-color: #38597a; color: white; }
</style>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import GoogleMapsLoader from "google-maps"
    import axios from 'axios'
    import _ from 'lodash'

    const gmapkey = "AIzaSyBLXvlal6niC0b49NWSorcdFV9cQT3Y754"

    export default {
		components: {
		},
        data: function() {
            return {
                openfrequenciespopover: false,
                openservicespopover: false,
                appservices: null,
                address: {
                    Street: "",
                    City: "",
                    PostalCode: "",
                    lat: null,
                    lng: null,
                    AppClientId: null
                },
                client: {
                    FirstName: "",
                    LastName: "",
                    Phone: "",
                    Email: ""
                },
                routeNode: {
                    Sequence: null,
                    ClientId: null,
                    AddressId: null
                },
                services: [],
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
                    },
                ]
            }
        },
		created() {
		},
        mounted() {
            
            let instance = this;

            setTimeout(function() {
                // instance.$f7.notification.create({
                //     closeOnClick: true,
                //     title: "FreshRoute",
                //     subtitle: "For Demo purposes",
                //     closeTimeout: 3000,
                //     text: 'New Addresses will be appended to the end of the route.',
                // }).open();

                cordova.plugins.notification.local.schedule({
                    title: 'FreshRoute Notification',
                    text: 'New Addresses will be appended to the end of the route',
                    foreground: true
                });
            }, 500);

            // get the list of Services
            instance.$firebase.database().ref("AppServices")
            .once("value", function(data) {
                instance.appservices = data.val();
                instance.services.push({
                    AppServiceType: "",
                    Frequency: "",
                    Price: 0
                })
            });

		},
		methods: {
            ...mapActions({
                addNodeToRoute: 'Route/addNodeToRoute'
            }),
            closeAddRouteNode: function() {
                let instance = this;
                instance.$f7.router.back();
            },
            geocodeAddress: function() {

                let instance = this;

                instance.$f7.preloader.show();

                // GoogleMapsLoader.KEY = gmapkey;

                return new Promise(function(resolve, reject) {
                    
                    // GoogleMapsLoader.load(function(google) {
                    
                        let geocoder = new google.maps.Geocoder();

                        geocoder.geocode({ 'address': instance.address.Street + " " + instance.address.City + " " + instance.address.PostalCode },
                            function(results, status) {

                                instance.$f7.preloader.hide();
                                if (status == google.maps.GeocoderStatus.OK) {
                                    instance.address.lat = results[0].geometry.location.lat();
                                    instance.address.lng = results[0].geometry.location.lng();
                                    resolve(results);
                                }
                            }, function(err) {
                                instance.$f7.preloader.hide();
                                reject(err);
                            }
                        )
                    // });

                });

            },
            createService: function() {
                this.services.push({
                    AppServiceId: "",
                    Rate: null, // on init, use Default Price
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
            updatePrice: function(serviceobj, evt) {
                serviceobj.Price = evt;
                this.$forceUpdate();
            },

            collectAndSave: async function() {

                let instance = this;
                let gp = await instance.geocodeAddress();
                let cp = await instance.saveClient();
                let ap = await instance.saveAddress(cp, gp);
                let rp = await instance.saveRouteWithNewNode(ap);
                let rn = await instance.saveServices(rp);
                let np = await instance.addNodeToLocalRoute(rn);

                instance.$f7.router.back();
            },

            saveClient: function() {
                let instance = this;
                // let clientpush = await instance.$firebase.database().ref('AppClients').push(instance.client);
                return instance.$firebase.database().ref('AppClients').push(instance.client);
                // instance.client.AppClientId = clientpush.key;
            },

            saveAddress: function(cp, gp) {
                let instance = this;
                // let addresspush = await instance.$firebase.database().ref('AppAddresses').push(instance.address);
                instance.address.AppClientId = cp.key;
                instance.client.AppClientId = cp.key;
                return instance.$firebase.database().ref('AppAddresses').push(instance.address);
                // instance.address.AppAddressId = addresspush.key;
            },

            saveRouteWithNewNode: function(ap) {

                let instance = this;
                instance.address.AppAddressId = ap.key;
                let routelength = instance.route.length;

                instance.routenode = {
                    ClientId: instance.client.AppClientId,
                    AddressId: instance.address.AppAddressId,
                    Sequence: routelength // the current length (zero index) + 1
                }

                return instance.$firebase
                    .database()
                    .ref('AppRoutes/' + instance.routeid + '/Nodes')
                    // create a new child using the custom id (integer index)
                    // and use .set() to create properties for the child
                    .child(instance.routenode.Sequence)
                    .set(instance.routenode);
                
            },

            saveServices: function(rn) {

                let instance = this;

                return instance.$firebase
                    .database()
                    .ref('AppRoutes/' + instance.routeid + '/Nodes/' + instance.routenode.Sequence + '/AppServices')
                    .push(instance.services[0]);
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
                instance.$firebase
                    .database()
                    .ref('AppRoutes/' + instance.routeid + '/Nodes/' + instance.routenode.Sequence + '/AppServices')
                    .once("value", function(data) {
                        let s = data.val();
                        instance.routenode.AppServices = {};
                        for(var p in s) {
                            instance.routenode.AppServices[p] = s[p];
                            break;
                        }

                        instance.addNodeToRoute(instance.routenode);
                    })

            }
		},
		computed: {
            ...mapGetters({
                routename: 'Route/RouteName',
                route: 'Route/Route',
                routeid: 'Route/RouteId'
            })
		},
    } 
</script>
