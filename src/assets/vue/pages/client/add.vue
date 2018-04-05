<template>
    <f7-page navbar-fixed>
        <f7-navbar title="Add to Route">
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
                    <f7-input type="text" placeholder="Your name" clear-button></f7-input>
                </f7-list-item>
                <f7-list-item>
                    <!-- <f7-icon icon="demo-list-icon" slot="media"></f7-icon> -->
                    <f7-label floating>Last Name</f7-label>
                    <f7-input type="text" placeholder="Your name" clear-button></f7-input>
                </f7-list-item>

                <f7-list-item>
                    <!-- <f7-icon icon="demo-list-icon" slot="media"></f7-icon> -->
                    <f7-label floating>Phone</f7-label>
                    <f7-input type="tel" placeholder="Your phone number" clear-button></f7-input>
                </f7-list-item>

                <f7-list-item>
                    <!-- <f7-icon icon="demo-list-icon" slot="media"></f7-icon> -->
                    <f7-label floating>E-mail</f7-label>
                    <f7-input type="email" placeholder="Your e-mail" clear-button></f7-input>
                </f7-list-item>

            </f7-list>
        </f7-block>

        <f7-block>
            <f7-block-title>Address Info</f7-block-title>
            <f7-list no-hairlines-md>
                <f7-list-item>
                    <!-- <f7-icon icon="demo-list-icon" slot="media"></f7-icon> -->
                    <f7-label floating>Street Address</f7-label>
                    <f7-input type="text" placeholder="Your name" clear-button></f7-input>
                </f7-list-item>
                <f7-list-item>
                    <!-- <f7-icon icon="demo-list-icon" slot="media"></f7-icon> -->
                    <f7-label floating>City</f7-label>
                    <f7-input type="text" placeholder="Your name" clear-button></f7-input>
                </f7-list-item>

                <f7-list-item>
                    <!-- <f7-icon icon="demo-list-icon" slot="media"></f7-icon> -->
                    <f7-label floating>Postal Code</f7-label>
                    <f7-input type="text" placeholder="Your phone number" clear-button></f7-input>
                </f7-list-item>

            </f7-list>
        </f7-block>

        <f7-button style="width:95%; margin:auto;" big :fill=true raised color="blue">Save</f7-button>

        <f7-block></f7-block>
    </f7-page>
</template>

<style>

</style>

<script>
    import GoogleMapsLoader from "google-maps"
    import axios from 'axios'

    const gmapkey = "AIzaSyBLXvlal6niC0b49NWSorcdFV9cQT3Y754"

    export default {
		components: {
		},
        data: function() {
            return {
                address: {
                    streetaddress: "",
                    city: "",
                    postalcode: "",
                    lat: null,
                    lng: null
                },
                customer: {
                    firstName: "",
                    lastName: "",
                    phone: ""
                },
                routeNode: {
                    sequence: null,
                    clientid: null,
                    addressid: null
                }
            }
        },
		created() {
		},
        mounted() {
            console.log('dsdsdsd', this);
		},
		methods: {
            closeAddRouteNode: function() {
                let instance = this;
                instance.$f7.router.back();
            },
            geocodeAddress: function() {

                GoogleMapsLoader.KEY = gmapkey;
                GoogleMapsLoader.load(function(google) {
                    let geocoder = new google.maps.Geocoder();
                    var route = getters.Route;
                    geocoder.geocode({ 'address': route[i].Street + " " + route[i].City + " " + route[i].PostalCode },
                        function(results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                var latitude = results[0].geometry.location.lat();
                                var longitude = results[0].geometry.location.lng();
                                var position = { lat: latitude, lng: longitude };
                            }
                        }
                    )
                });

            }
		},
		computed: {

		},
    } 
</script>
