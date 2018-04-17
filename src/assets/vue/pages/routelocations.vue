<template>
	<f7-page class="routelocationslist">
		<f7-navbar title="Edit Locations for Route" back-link=" ">
		</f7-navbar>

        <h3 v-if="locations && locations.length" style="padding-left: 15px;">Editing {{ locations.length }} locations</h3>
        <p style="padding-left: 15px; font-size: 12px;">Drag the handles on the right to reorder the locations.</p>
        <p style="padding-left: 15px; font-size: 12px;">Click "Save Route" to save ALL changes here.</p>

        <f7-block style="margin-top: 1px; margin-bottom: 10px; padding-left: 5px; padding-right: 5px;" >

            <!-- <f7-list class="emps" style="margin-top: -2px" v-if="route && route.Nodes">
                <f7-list-item v-for="(node, index) in route.Nodes" :key="index" :title="node.AppClient.FirstName + ' ' + node.AppClient.LastName">
                    
                </f7-list-item>
            </f7-list> -->
            <f7-block></f7-block>
            <draggable v-model="locations" :options="dragOptions" @update="swap">
                <transition-group :name="'flip-list'">
                    <div class="location" v-for="loc in locations" :key="loc.Sequence">
                        <div class="container">
                            <div class="address">{{ loc.AppAddress.Street + " " + loc.AppAddress.City + " " + loc.AppAddress.PostalCode }}</div>
                            <div class="secondline">
                                <span class="clientname">{{ loc.AppClient.FirstName + ' ' + loc.AppClient.LastName }}</span>
                                <span class="service" v-for="(appservice, index) in loc.AppServices" :key="index">
                                    <div class="chunk type">{{ appservice.AppServiceType }}</div>
                                    <div class="chunk freq">{{ appservice.Frequency }}</div>
                                    <div class="chunk price">{{ appservice.Price }}</div>
                                </span>
                            </div>
                            <span class="sort"><i class="fa fa-sort"></i></span>
                        </div>
                    </div>
                </transition-group>
            </draggable>

        </f7-block>

        <f7-button style="width:95%; margin:auto;" @click="saveAllChanges()" big :fill=true raised color="blue">Save Route</f7-button>



		<f7-fab class="addnodes" color="orange" @click="openaddnodes = true;" >
			<f7-icon fa="plus" ></f7-icon>
		</f7-fab>
        <f7-popover target=".addnodes" class='addnodes' @popover:closed="openaddnodes = false" :opened="openaddnodes == true">
            <f7-list>
                <f7-list-item @click="addNewNode(); openaddnodes= false;" >
                    Add New Client/Address
                </f7-list-item>
                <f7-list-item @click="addExistingNode(); openaddnodes= false;" >
                    Add Existing Client/Address
                </f7-list-item>
            </f7-list>
        </f7-popover>

	</f7-page>
	
</template>

<style scoped>
.flip-list-move {
  transition: transform 0.5s;
}
.routelocationslist {
    color: #636363
}
.navbar-inner .right {
	margin-right: 5px;
	font-size: 15px;
}
.location {
    padding: 5px;
    padding-left: 15px;
    background-color: white;
    border: 1px solid #CCC;
    margin-bottom: 0px;
}
.address {
    font-size: 12px;
    font-weight: 600;
}
.clientname {
    font-size: 11px;
    margin-right: 10px;
}
.service {
    display: flex;
    font-size: 11px;
}
.secondline {
    display: flex;
}
.service .chunk {
    padding: 2px;
    min-width: 55px;
    opacity: 0.65;
    text-align: center;
}
.location .container {
    position: relative;
}
.sort {
    position: absolute;
    top: 50%;
    right: 10px;
    font-size: 25px;
    margin-top: -18px;
    color: #8e8e93;
}
.chunk.type {
    padding-left: 2px;
    color: white;
    background-color: #369e29;
}
.chunk.freq {
    background-color: #196eaa;
    color: white;
}
.chunk.price {
    background-color: #d8ca04;
    color: #000000;
}
</style>

<script>

import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import _ from 'lodash'
import draggable from 'vuedraggable'

export default {
    name: "RouteLocations",
    components: {
        draggable
    },
	data: function () {
		return {
			sorting: false,
            locations: null,
            clients: [],
            openaddnodes: false
            // locations: []
		}
	},
	computed: {
		...mapGetters({
			UserModel: 'User/UserModel',
            activeRoute: 'RouteModel/ActiveRoute',
            route: 'Route/Route'
        }),
        dragOptions () {
            return  {
                animation: 0,
                group: 'description',
                // disabled: !this.editable,
                ghostClass: 'ghost',
                handle: '.sort'
            };
        },
	},
	watch: {
	},
    mounted() {
        let instance = this;

        // instance.route = JSON.parse(JSON.stringify(instance.activeRoute));
        console.log(instance.activeRoute);
        instance.__getRouteData(instance.activeRoute.AppRouteId);
        
        instance.$firebase.database().ref("AppClients")
        .once("value", function(data) {
            let c = data.val();
            for(var x in c) {
                c[x].AppClientId = x;
                instance.clients.push(c[x]);
            }
        });

        // if(instance.route.Nodes)
        //     for(var s in instance.route.Nodes)
        //         instance.locations.push(instance.route.Nodes[s]);

        instance.locations = JSON.parse(JSON.stringify(instance.route));
        console.log(instance.locations)
	},
	methods: {
		...mapActions({
			getRoutes: 'RouteModel/getRoutes',
            selectActiveRoute: 'RouteModel/selectActiveRoute',
            __getRouteData: 'Route/getRouteData',
            __setLocationSequence: 'Route/setLocationSequence'
		}),
		
		swap: function() {
            let instance = this;
            console.log("@@@@@", instance.locations);
            // setTimeout(function() {

            //     for(var x=0; x< instance.locations.length; x++) {
            //         instance.locations[x].Sequence = x;
            //         // instance.__setLocationSequence({ 
            //         //     fromseq: instance.locations[x].Sequence,
            //         //     toseq: x
            //         // });


            //     }
            // }, 300)
        },

        addNewNode() {
            this.$f7.router.navigate({ url: "./addroutenode/track" });
        },

        addExistingNode() {

            this.$f7.router.navigate({ url: "./addroutenode/track/existing" });

        },

        saveAllChanges() {

        }
	},
    created() {
	}
};
</script>
