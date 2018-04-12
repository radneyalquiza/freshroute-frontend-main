<template>
    <f7-page>
        <f7-navbar>
            <!-- <f7-nav-left>
                <f7-link class="panel-open" open-panel="left" icon="fa fa-bars"></f7-link>
            </f7-nav-left> -->
            <div class="title">FreshRoute - Express</div>
            <f7-nav-right>
                <f7-link class="searchbar-enable" data-searchbar=".searchbar-components" icon="fa fa-search"></f7-link>
            </f7-nav-right>
            <f7-searchbar class="searchbar-components" search-container=".components-list" search-in="a" expandable></f7-searchbar>
        </f7-navbar>

        <f7-block-title class="welcome">Welcome to <span class="red">FreshRoute</span></f7-block-title>

        <f7-list class="components-list searchbar-found">
            <f7-list-item link="/clients/" title="Clients" panel-close>
                <f7-icon slot="media" icon="fa fa-info fa-fw"></f7-icon>
            </f7-list-item>
            <f7-list-item link="/route/" title="Route" panel-close>
                <f7-icon slot="media" icon="fa fa-vcard-o fa-fw"></f7-icon>
            </f7-list-item>
            <f7-list-item link="/reports/" title="Reports" panel-close>
                <f7-icon slot="media" icon="fa fa-rss fa-fw"></f7-icon>
            </f7-list-item>
            <f7-list-item link="/chat/" title="Messaging" panel-close>
                <f7-icon slot="media" icon="fa fa-user fa-fw"></f7-icon>
            </f7-list-item>
            <!-- <f7-list-item link="/vuex/" title="Vuex" panel-close>
                <f7-icon slot="media" icon="fa fa-battery fa-fw"></f7-icon>
            </f7-list-item> -->
        </f7-list>
        <f7-list class="searchbar-not-found">
            <f7-list-item title="Nothing found"></f7-list-item>
        </f7-list>

        <p style="text-align: center; width: 90%; margin:auto; font-size: 12px; margin-bottom:10px;">Please make sure your device's GPS Location is turned on.</p>

        <f7-button class="trackbutton"
                    big :fill=true raised color="blue"
                    @click="openRoutes()">
            Track a Route
        </f7-button>


        <f7-toolbar class='toolbar-bottom' :bottom-md=true>
            <f7-link>
                <span class='loginstatlabel'>User</span>
                <span class='loginstat' v-if="UserModel">{{ UserModel.UserName }} </span> 
            </f7-link>
            <f7-link @click="logout">Logout</f7-link>
        </f7-toolbar>

        <f7-actions class='routes-actions' :opened="gotroutes" @actions:closed="gotroutes=false">
            <f7-actions-group>
				<f7-actions-label>Select a Route</f7-actions-label>
				<f7-actions-button
				    v-for='route in UserRoutes'
				    v-bind:key='route.RouteName'
					@click='selectRoute(route.AppRouteId)'>
					{{ route.RouteName }}
				</f7-actions-button>
			</f7-actions-group>
			<f7-actions-group>
				<!-- Cancel/Close Button -->
				<f7-actions-button color="red" bold @click="closeRoutes()">Cancel</f7-actions-button>
			</f7-actions-group>
		</f7-actions>

    </f7-page>
</template>


<script>

	import _ from 'lodash'
	import { mapGetters, mapActions } from 'vuex'

// this.$f7 ----> main APP Framework7 instance

	export default {
		data: function() {
			return {
				username: "",
				useragent: "",
				gotroutes: false
			}
		},
		// components: {
		// 	Login,
		// },
		created() {
            // console.log(this);
            console.log('in home created');
		},
		mounted() {

            // let instance = this;
            // // instance.useragent = navigator.userAgent;
            

		let updateObject = {};

		// updateObject["AppClients/"+appclientid+"/FirstName"] = instance.client.FirstName;
		// updateObject["AppClients/"+appclientid+"/LastName"] = instance.client.LastName;
		// updateObject["AppClients/"+appclientid+"/Email"] = instance.client.Email;
		// updateObject["AppClients/"+appclientid+"/Phone"] = instance.client.Phone;

		// updateObject["AppClients/-L8qoShdyMKoeUq_eQFj/AppAddresses/-L8rAkRB-g_NZz-rycEY/City"] = "Toronto";
        // updateObject["AppClients/-L8qoShdyMKoeUq_eQFj/AppAddresses/-L8rAkRB-g_NZz-rycEY/PostalCode"] = "M2R 3J2";
        // this.$firebase.database().ref().update(updateObject);



            // console.log('in home mounted')
            // var root = this.$root;

            // if(!instance.CurrentLocation) {
            //     instance.$f7.preloader.show("Getting Location...");
            //     instance.__getCurrentLocation(function() {
            //         instance.$f7.preloader.hide();
            //     });
            // }

            // // instance.__populateModelData();

        
            // if(!sessionStorage.getItem("AppUserId")) {
            //     instance.$f7.router.load({url: '/'})
            //     setTimeout(function() {
            //         instance.$f7.loginScreen.open("#login-screen", true);
            //     }, 1);
            // }
            // else {
            //     instance.__findUser(sessionStorage.getItem("AppUserId").toString());
            //     instance.$root.CurrentUserJobModel = root.JobModel;
            // }

		},
        computed: {
            ...mapGetters({
                CurrentLocation: 'User/currentLocation',
                Model: 'Model/Model',
                UserModel: 'User/UserModel',
                UserRoutes: 'User/Routes'
            })
        },
        
		methods: {
            ...mapActions({
                __getCurrentLocation:	'User/getCurrentLocation',
                // __populateModelData: 'Model/getModelData',
                __findUser: 'User/findUser',
                __getUserRoutes: 'User/getRoutesOfUser',
                __selectRoute: 'User/setSelectedAppRouteId'
            }),
            logout: function() {
                var instance = this;
                sessionStorage.clear();
                window.location.replace("/");
            },
            openRoutes: function() {
                console.log('open routes');
                let instance = this;

                if(sessionStorage.getItem("SelectedAppRouteId")) {
                    instance.selectRoute(sessionStorage.getItem("SelectedAppRouteId"));
                }
                else {
                    instance.__getUserRoutes(instance.UserModel.id);
                    instance.gotroutes = true;
                }
            },
            selectRoute: function(approuteid) {
                let instance = this;
                // parse the route info
                instance.__selectRoute(approuteid);

                // the below is temporary
                sessionStorage.setItem("SelectedAppRouteId", approuteid);

                instance.closeRoutes();
                instance.$f7.router.navigate({ url: '/track/'});
            },
            closeRoutes: function() {
                let instance = this;
                setTimeout(function() {
                    instance.gotroutes = false;
                }, 500)
            }
        }
	}

</script>
