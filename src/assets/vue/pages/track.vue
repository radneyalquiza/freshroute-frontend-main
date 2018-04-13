<template>
	<f7-page class="track-container" style="">

		<f7-navbar class="track-nav" name="nav">
			<f7-nav-left v-if="!locationopened">
				<f7-link icon="icon-back" @click="back()"></f7-link>
			</f7-nav-left>
			<f7-nav-left v-if="locationopened">
				<f7-link icon="icon-back"  @click="closeActiveLocation($event)"></f7-link>
			</f7-nav-left>
			<div class="title">Track {{ routename ? ("  " + routename) : "" }}</div>
			<f7-nav-right>
				<f7-link >RESET</f7-link>
			</f7-nav-right>
		</f7-navbar>

		<f7-navbar v-if="routevisible && !locationopened" fixed class="fixed-control route-control" style="display: flex; text-align: center; margin-top: 56px; margin-bottom: 5px;">
			<div style="width: 60%; display: flex">
				<!-- <div class="date" style="padding-right: 7px; text-align: right; font-size: 12px;">Feb 28, 2018</div> -->
				<clock style="width: 70%; padding-left: 15px; padding-right: 0px;"></clock>
				<div style="width:30%; line-height:20px; padding-top:10px; font-size: 0.75em">{{ showDate() }}</div>
			</div>
			<div style="width: 40%">
				<div style="display:flex; text-align: center;">
					<f7-button class="play fixed-control-button" @click="startTracking()" v-bind:disabled="tracking == TRACK.PLAY || tracking == TRACK.DONE"><i class="fa fa-play"></i></f7-button>
					<f7-button class="stop fixed-control-button" @click="stopTracking()" v-bind:disabled="tracking == TRACK.STOP || tracking == TRACK.DONE"><i class="fa fa-stop"></i></f7-button>
				</div>
			</div>
		</f7-navbar>

		<!-- <div style="width: 100%; margin:auto; margin-top: 55px;"> -->
			<!-- <p v-if="!tracking" style="font-size:12px">
				Press <i class='fa fa-play'></i> to Start your Route.
			</p>
			<p v-if="tracking" style="font-size:12px">
				Press <i class='fa fa-pause'></i> to Pause your Route (and the current property)<br/>
				Press <i class='fa fa-stop'></i> to End your Route.
			</p> -->
			<!-- <f7-segmented style="width:70%; margin: auto">
				<f7-button @click="startTracking()" v-bind:disabled="tracking == TRACK.PLAY" :fill=true round raised color="green"><f7-icon color="white" fa="play"></f7-icon></f7-button> -->
				<!-- <f7-button @click="pauseTracking()" v-bind:disabled="tracking == TRACK.PAUSE || tracking == TRACK.STOP" :fill=true round raised color="yellow"><f7-icon color="white" fa="pause"></f7-icon></f7-button> -->
				<!-- <f7-button @click="stopTracking()" v-bind:disabled="tracking == TRACK.STOP" :fill=true round raised color="red"><f7-icon color="white" fa="stop"></f7-icon></f7-button>
			</f7-segmented> -->
		<!-- </div>  -->

		
		<transition name="slidedown">
			<activelocation v-if="locationopened" :clocation="activeLocation" @doneProperty="revertTimeline"></activelocation>
		</transition>

		<transition name="swipeleft">
			<f7-button v-if="!routevisible" style="position: fixed; z-index: 1000; top: 50%; height: 50px; left: 10px; min-width: 50px; font-size: 25px;" @click="showRouteTimeline" :fill=true round raised color="orange">
				<f7-icon color="white" fa="list"></f7-icon>
				<span style="font-size: 9px; display:block; margin-left:0; line-height: 3px;">Route</span>
			</f7-button>
		</transition>

		<transition name="swipeleft">
			<div v-if="!locationopened && routevisible"
			     v-hammer:swipe.left="hideRouteTimeline"
				 style="margin-top: 50px; position: absolute; z-index: 999; padding-bottom: 45px; overflow-y: auto"
				 v-bind:style="{ maxHeight: routeheight + 'px' }"
				 class="timeline route-timeline">

				<!-- <stopwatch></stopwatch> -->

				<div class="timeline-item" v-for="address in route" :key="address.Sequence">
					<!-- <div class="timeline-item-date">21 <small>DEC</small></div> -->
					<div class="timeline-item-divider"
							v-bind:class="{ inc: address.Status == STATUS.INCOMPLETE,
											done: address.Status == STATUS.COMPLETE,
											todo: address.Status == STATUS.DOING }">
					</div>
					<div class="timeline-item-content">

						<div v-if="!address.AppAddress.lat" class="card inc">
							<div class="card-header"></div>
							<div class="card-content"><div style="width: 100%; text-align: center">LOADING...</div></div>
							<div class="card-footer footer play"></div>
						</div>

						<div v-if="address.AppAddress.lat" class="card" v-bind:class="{ active: address.Status == STATUS.ACTIVE && tracking != TRACK.DONE,
														pulse: address.Status == STATUS.ACTIVE && tracking != TRACK.DONE,
														skipped: address.Skipped == true,
														inc: address.Status == STATUS.INCOMPLETE,
														done: address.Status == STATUS.COMPLETE || tracking == TRACK.DONE }">
							<div class="card-header">
								{{ address.AppClient.FirstName + " " + address.AppClient.LastName }}
								<a class="contact" v-bind:href="phone(address.AppClient.Phone)">({{ address.AppClient.Phone }})</a>
								<!-- <a class="button skip" v-if="address.Status != STATUS.COMPLETE" @click="skipNode($event, address)"><f7-icon color="blue" f7="fastforward_fill" size=20></f7-icon></a> -->
								<!-- <a class="button complete" v-if="address.Status == STATUS.COMPLETE"><f7-icon color="blue" fa="check" size=20></f7-icon></a> -->
								
								<!-- <a class="button skip" v-if="address.Skipped" @click="unskipNode($event, address)"><f7-icon color="blue" fa="plus" size=14></f7-icon></a> -->
							</div>

							<div class="card-content">
								<!-- <f7-button @click="focusNode($event, address)">
									{{ address.Street + " " + address.City + " " + address.PostalCode }}
									<div class="moreinfo" v-bind:class="{show: address.Expand == true }">
										{{address}}
									</div>
								</f7-button> -->
								<p class="address-text">{{ address.AppAddress.Street + " " + address.AppAddress.City + " " + address.AppAddress.PostalCode }}</p>
								<div class="service" v-if="address.AppServices">
									<div v-for="appservice in address.AppServices" v-bind:key="appservice.index">
										<div class="servicechild type" style="width:15%"><span class="label">Type</span><span class="cont type ">{{ appservice.AppServiceType }}</span></div>
										<div class="servicechild" style="width:55%;"><span class="label">Frequency</span><span class="cont freq">{{ appservice.Frequency }}</span></div>
										<div class="servicechild" style="width:30%"><span class="label">Price</span><span class="cont prc">$ {{ appservice.Price }}</span></div>
									</div>
								</div>
							</div>
							
							<div class="card-footer footer"
							     v-if="address.Status != STATUS.COMPLETE"
								 v-bind:class="{ play: tracking != TRACK.DONE }"
								 @click="openProperty(address.Sequence)">
								 <div style="width: 100%">OPEN LOCATION</div>
							</div>
							<div class="card-footer" v-if="address.Status == STATUS.COMPLETE">
								<div style="display: flex; width: 100%; text-align: center; color: ">
									<div style="width: 66%; display: flex " v-for="appservice in address.AppServices" v-bind:key="appservice.index">
										<div style="width: 50%; padding: 3px;">{{ appservice.AppServiceType }}</div>
										<div style="width: 50%; border-left: 1px solid #CCC; padding: 3px;">CAD$ {{ appservice.Price }}</div>
									</div>
									<div v-if="address.JobData" style="width: 33%; border-left: 1px solid #CCC; padding: 3px;">{{ address.JobData.TotalJobTimeText }}</div>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>
		</transition>

		<f7-block></f7-block>

		<div v-if="!locationopened && tracking != TRACK.DONE" class="fab fab-right-bottom color-red">
			<a href="./addroutenode/track" style="width: 35px; height: 35px; bottom: 1px; right: 1px;">
				<i class="icon f7-icons">add</i>
			</a>
		</div>

		<div class="detail-buttons-container">
			<f7-button
					icon-f7="persons_fill"
					sheet-open=".workers-sheet"
					icon-size=28
					:fill=true raised color="pink">
			</f7-button>
			<f7-button href="./expenses/"
					icon-f7="money_dollar"
					icon-size=28
					:fill=true raised color="blue">
			</f7-button>
			<f7-button href="./routesummary/"
					v-if="tracking == TRACK.DONE"
					icon-f7="graph_round"
					icon-size=28
					:fill=true raised color="orange"
					style="margin-left: 20px;">
			</f7-button>
		</div>

		<div class="map-container" v-bind:style="{ height: mapheight + 'px', maxHeight: mapheight + 'px' }">
			<!-- <gmap-map
				v-if="currentLocation && Center"
				:center="Center"
				:zoom="zoom"
				map-type-id="terrain"
				class="map"
				v-bind:class="{ halfheight: locationopened }">
				<gmap-marker
					:key="index"
					v-for="(m, index) in Markers"
					v-if="m"
					:position="m.position"
					:clickable="false"
					:draggable="false"
					></gmap-marker>
			</gmap-map> -->
			<google-map
				id="test"
				:center="Center"
				:zoom="zoom"
				map-type-id="terrain"
				class="map"
				v-bind:class="{ halfheight: locationopened }"
				:markers="Markers"
				:nextlocation="activeLocationCoords"
				:userlocation="currentLocation"
				:locationopened="locationopened"
				>
			</google-map>
		</div>

		<div class="sheet-modal workers-sheet" >
			<div class="toolbar">
			<div class="toolbar-inner">
				<div class="left">All Employees in this Route</div>
				<div class="right"><a class="link sheet-close" href="#">Done</a></div>
			</div>
			</div>
			<div class="sheet-modal-inner">
				<div class="block">
					<f7-list >
						<f7-list-item title="" v-for="emp in workers" v-bind:key="emp.$index">
							{{ emp }}
						</f7-list-item>
					</f7-list>

				</div>
			</div>
		</div>

		<!-- <f7-popup v-if="tracking == TRACK.DONE" id="summarypopup" @popup:opened="showSummary()">
			<f7-page navbar-fixed>
				<f7-navbar title="Summary">
					<f7-nav-right>
						<f7-link :close-popup="true">Close</f7-link>
					</f7-nav-right>
				</f7-navbar>
				<f7-block>
					<routesummary
						v-if="showingsummary"
						:routedata="route"
						:routename="routename"
						:expensedata="ExternalExpenses">
					</routesummary>
				</f7-block>
			</f7-page>
		</f7-popup> -->

		<!-- <f7-popup id="addresspopup" v-if="addingroutenode" :opened="addingroutenode">
			<add-route-node @closedAddRouteNode="closeAddRouteNode()"></add-route-node>
		</f7-popup> -->


	</f7-page>

	
	
</template>

<style scoped>
.route-timeline,
.route-timeline .card,
.route-timeline .card-header {
	font-size: 16px;
	width: 100%;
}
.route-timeline .contact {
	margin-left: 5px;
	margin-right: 5px;
}
.route-timeline .card-header,
.route-timeline .card-footer,
.route-timeline .card-content {
	min-height: 30px;
	width: 100%;
}
.route-timeline .card-footer.footer {
	text-align: center;
}
.route-timeline {
	padding-left: 5px;
}
.route-timeline .button {
	line-height: 36px;
}
.route-timeline .card-header {
	padding-right: 2px;
	padding-top: 2px;
	padding-bottom :1px;
}
.route-timeline .card-footer {
	border-top: 1px solid #f7f7f7
}
.route-timeline .card-footer .buttons-row {
	width: 100%;
}
 .card-content-inner {
	padding-top: 10px;
	padding-bottom: 10px;
}
.route-timeline .card {
	font-size: 13px;
	width: 100%;
}
.navbar-inner .right {
	margin-right: 5px;
	font-size: 15px;
}
.datetime {
	font-weight: 600;
}

.fixed-control-button {
	font-size: 130%;
	height: 100%;
	width: 50%;
	padding: 15px;
}
.play {
	background-color:#50b223;
	color: white !important;
}
.card.inc .play {
	opacity: 0.5;
	background-color: #8e3b3b
}
.stop {
	background-color:#f44336;
	color: white !important;
}
.pause {
	background-color: #f0d264;
	color: white !important;
}
.timeline {
	transition: all 0.4s ease-in-out;
}
.timeline-item-content {
	width: 100%;
	background-color: white;
}
.timeline-item-divider {
	transition: all 0.5s ease-in-out;
	margin: 0 7px;
	margin-top: 45px;
	width: 15px;
	height: 15px;
	background: #146aff;
}
.timeline-item-divider:after, .timeline-item-divider:before {
	width: 3px;
}
.pulse {
	animation: pulseblue 2s;
}
.timeline-item-divider.inc {
	background: #f44336;
}
.timeline-item-divider.done {
	background: #50b223;
}
.timeline-item-divider.todo {
	background: #eda444;
	animation: pulse 1s infinite;
	-moz-animation: pulse 1s infinite;
	-webkit-animation: pulse 1s infinite;
}
.card .skip,
.card .complete {
	min-height: 20px;
	min-width: 20px;
	font-size: 20px;
}
.card.skipped {
	background-color: rgba(204, 204, 204, 0.2);
}
.card.done,
.card.inc {
	background-color: rgba(204, 204, 204, 0.2);
	pointer-events: none;
	user-select: none;
	color: #adadad;
}
.card.done {
	background-color: rgba(204, 204, 204, 0.2);
}
.card.done .button,
.card.inc .button {
	color: #adadad;
}
.card.done .card-footer {
	color: #adadad;
}

.card.active {
	background-color: transparent;
	pointer-events: auto;
	user-select: auto;
}
.address-text,
.time-text {
	padding-left: 12px;
	padding-top: 5px;
	font-size: 16px;
	color: #adadad;
}
.address-text {
	margin-bottom: 3px;
}
.time-text {
	padding-left: 12px;
	padding-top: 1px;
	padding-bottom: 1px;
	margin-bottom: 2px;
	background-color: #e8e8e8;
	color: #898989;
}
.time-text span {
	display: block;

}
.button {
	color: #707070;
}
.button.footer {
	line-height: 30px;
	height: 30px;
	font-size: 16px;
}
.card-content {
	padding: 4px;
}
.card-content .button {
	text-align: left;
	padding-left: 12px;
	font-size: 12px;
}
.card-content-inner {
	padding: 0;
}
.moreinfo {
	display: none;
}
.moreinfo.show {
	display: block;
}

.card .starttime,
.card .endtime {
	padding: 15px;
	display: inline-block;
	width: 50%;
	position: relative;
	font-weight: 1000;
}
.card .starttime {
	border-right: 1px solid #cccccc;
}
.card .starttext,
.card .endtext,
.card .difftext {
	position: absolute;
	top: 10px;
	left: 25px;
	font-size: 0.5em;
}
.card .endtext {
	top: 48px;
}
.card .endtime {
	top: 15px;
}
.service > div{
	display: flex;
	width: 100%;
	padding: 0;
	padding-left:10px;
}
.service .servicechild {
	width: 33%;
	padding: 0px;
	padding-bottom: 7px;
	font-size:1em;
	position: relative;

}
.service .servicechild span.label {
	position: absolute;
	color: #939393;
	text-align: center;
	top:1px;
	left: 5px;
	font-size:0.8em;
}
.service .servicechild .type,
.service .servicechild .freq,
.service .servicechild .prc {
	padding: 0px;
	padding-top: 2px;
	padding-left: 5px;
	padding-bottom: 1px;
	border-radius: 10px;
	display: inline-block;
	margin-top: 10px;
	min-width: 60px;
	font-size: 0.9em;
	text-align: left;
	color: #939393
}

.map {
	width: 100%;
	height: 100%;
	margin-top: -2px;
}
.map-viewport {
	width: 100%;
	height: 600px;
	background-color: transparent;
	pointer-events: none;
	user-select: none;
}
.halfheight { height: 50%; margin-top: 69%; transition: all 0.5s ease-in-out; }

.detail-buttons-container {
	display: flex;
	height: 35px;
	left: 5px;
	font-size:25px;
	position: fixed;
	z-index: 1500;
	bottom: 15px;
}
.detail-buttons-container .button {
	width: 50%;
	margin-right: 5px;
}

.workers-sheet .left {
	padding: 5px;
	padding-left: 15px;
	font-weight: 600;
}
/* -------------------------------------------------- */
/* Transitions */
/* -------------------------------------------------- */
.swipeleft-enter-active, .swipeleft-leave-active {
  transition: transform .5s ease-in-out;
}
.swipeleft-enter, .swipeleft-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform:translateX(-500px);
}

.slidedown-enter-active, .slidedown-leave-active {
  transition: transform .5s ease-in-out;
}
.slidedown-enter, .slidedown-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform:translateY(65px);
}

.slideup-enter-active, .slideup-leave-active {
  transition: transform .3s ease-in-out;
}
.slideup-enter, .slideup-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform:translateY(60px);
}

/* --------------------------------------------------- */
/* Animations */
/* --------------------------------------------------- */
@-webkit-keyframes pulse {
  0% { -webkit-box-shadow: 0 0 0 0 rgba(255, 48, 48, 0.4); }
  70% { -webkit-box-shadow: 0 0 0 20px rgba(255, 48, 48, 0); }
  100% { -webkit-box-shadow: 0 0 0 0 rgba(255, 48, 48, 0); }
}
@keyframes pulse {
  0% {
	  -moz-box-shadow: 0 0 0 0 rgba(255, 48, 48, 0.4);
      box-shadow: 0 0 0 0 rgba(255, 48, 48, 0.4);
  }
  70% {
      -moz-box-shadow: 0 0 0 20px rgba(255, 48, 48, 0);
      box-shadow: 0 0 0 20px rgba(255, 48, 48, 0);
  }
  100% {
      -moz-box-shadow: 0 0 0 0 rgba(255, 48, 48, 0);
      box-shadow: 0 0 0 0 rgba(255, 48, 48, 0);
  }
}

@-webkit-keyframes pulseblue {
  0% { -webkit-box-shadow: 0 0 0 0 rgba(0, 82, 247, 0.4); }
  70% { -webkit-box-shadow: 0 0 0 20px rgba(0, 82, 247, 0);  }
  100% { -webkit-box-shadow: 0 0 0 0 rgba(0, 82, 247, 0);  }
}
@keyframes pulseblue {
  0% {
	  -moz-box-shadow: 0 0 0 0 rgba(0, 82, 247, 0.4);
      box-shadow: 0 0 0 0 rgba(0, 82, 247, 0.4);
  }
  70% {
      -moz-box-shadow: 0 0 0 20px rgba(0, 82, 247, 0);
      box-shadow: 0 0 0 20px rgba(0, 82, 247, 0);
  }
  100% {
      -moz-box-shadow: 0 0 0 0 rgba(0, 82, 247, 0);
      box-shadow: 0 0 0 0 rgba(0, 82, 247, 0);
  }
}


</style>

<script>
	import Vue from 'vue'
	import moment from 'moment'
	import Clock from '../components/clock.vue'
	import Stopwatch from '../components/stopwatch.vue'
	import Activelocation from '../components/activelocation.vue'
	import Routesummary from '../components/routesummary.vue'
	import FileService from '../../../assets/js/file.service.js'
	import Location from '../../../assets/js/location.class.js'
	import { mapGetters, mapActions } from 'vuex'
	import AddRouteNode from '../pages/client/add.vue'
	import GoogleMap from '../components/map.vue'

	export default {
		name: "Track",
		components: {
			Clock,
			Stopwatch,
			Activelocation,
			Routesummary,
			AddRouteNode,
			GoogleMap
		},
		data: function () {
			return {
				sorting: false,
				focusLocation: null,
				addingroutenode: false,
				// activeLocation: null,
				// tracking: 0,
				zoom: 0,
				height: "50%",
				mapheight: "640px",
				routeheight: "640px",
				routevisible: true,
				pollGPS: null,
				pollRate: 15000,
				// locationopened: false,
				ExternalExpenses: [],
				showingsummary: false,
				// routename: "Default Route",
				expense: {
					amount: "",
					description: ""
				},
				// FOR THE WHOLE ROUTE
				TRACK: {
					STOP: 0,
					PAUSE: 1,
					PLAY: 2,
					DONE: 3
				},
				// FOR A LOCATION
				STATUS: {
					INCOMPLETE: 0,
					DOING: 1,
					COMPLETE: 2,
					ACTIVE: 3
				}
			}
		},
		computed: {
			...mapGetters({
				currentLocation: 'User/currentLocation',
				route: 'Route/Route',
				routename: 'Route/RouteName',
				UserModel: 'User/UserModel',
				started: 'Route/started',
				RouteStatus: 'Route/RouteStatus',
				LocationStatus: 'Route/LocationStatus',
				Center: 'Route/Center',
				Markers: 'Route/Markers',
				current: 'Route/current',
				locationopened: 'Route/locationopened',
				activeLocation: 'Route/activeLocation',
				tracking: 'Route/RouteStatus',
				selectedRouteId: 'User/selectedAppRouteId',
				workers: 'Route/Workers',
				activeLocationCoords: 'Route/activeLocationCoords'
			})
		},
		mounted() { },
		created() { },
		methods: {
			...mapActions({
				__getRouteData: 'Route/getRouteData',
				__startRoute: 'Route/startRoute',
				__activateProperty: 'Route/enableProperty',
				__openProperty: 'Route/openProperty',
				__next: 'Route/next',
				__endRoute: 'Route/endRoute',
				__closeActiveLocation: 'Route/closeProperty',
				__selectRoute: 'User/setSelectedAppRouteId',
				__getCurrentLocation: 'User/getCurrentLocation',
				gpsGranted: 'User/gpsGranted'
			}),
			onF7Ready: function() {

				let clients;
				let instance = this;
				let Dom7 = instance.Dom7;

				instance.$f7.preloader.show();

				if(instance.route && instance.started) {
					instance.$f7.preloader.hide();
					return;
				}

				if(!instance.route || !instance.route.length) {

					if(!instance.selectedRouteId)
						instance.__selectRoute(sessionStorage.getItem('SelectedAppRouteId'));

					instance.__getRouteData(instance.selectedRouteId);
								
					if(!instance.currentLocation) {

						instance.$f7.preloader.show();
						
						instance.__getCurrentLocation({
							
							success: function() {

								instance.$f7.preloader.hide();
								
								setupmapview();

								instance.pollGPS = null;
								
								// start polling GPS location (default 15s)
								instance.pollGPS = setInterval(function() {
									instance.__getCurrentLocation();
								}, instance.pollRate);

							},
							
							fail: function() {
								// didn't allow GPS
								instance.$f7.preloader.hide();
								instance.$f7.dialog.alert(
									"This application needs device location to be active. Closing now.",
									"Hold on...",
									function() {
										navigator.app.exitApp();
									}
								);
							}
						});
					}

				
				}
				else {
					setTimeout(setupmapview,1000);
				}

				function setupmapview() {
					instance.$f7.preloader.hide();

					instance.zoom = 15;

					if(Dom7(".route-timeline").length) {
						instance.routeheight = Dom7(".track-container .page-content").outerHeight(true) - 120
						instance.mapheight = Dom7(".track-container .page-content").outerHeight(true);
						Dom7(".track-container .page-content").css("overflow-y", "hidden");
					}
				}

				// for(var x=0;x<instance.route.length;x++)
				// 	instance.$db.addRoute(instance.route[x]);

				// if(!instance.$store.state['User/currentLocation']) {
				// 	// showPreloader();
				// 	instance.$store.dispatch("User/getCurrentLocation", function() {
				// 		// instance.$f7.hidePreloader();
				// 	});
				// }

				// FileService.writeToFile("test12345.txt", "HELLO1!", function() {
				// 	console.log(arguments);
				// 	FileService.readFile("test12345.txt", function() {
				// 		console.log(arguments);
				// 		FileService.readLocalFiles();
				// 	})
				// });

				// 	// alert('dddd');
				// 	// e.preventDefault();
				// 	// cordova.plugins.notification.local.schedule({
				// 	// 	title: 'FreshRoute Notification',
				// 	// 	text: 'You have a route running',
				// 	// 	foreground: true
				// 	// });
				// });

				// custom height for the map background and the timeline
			},
			hideRouteTimeline: function() {
				this.routevisible = false;
			},
			showRouteTimeline: function(show) {
				this.routevisible = true;
			},
			revertTimeline: function(nodeData) {

				let instance = this;

				// instance.getCurrentLocation();
				instance.zoom = 14;

				instance.$f7.navbar.show(".track-nav", true)

				if(nodeData) {

					if(nodeData.Status == instance.STATUS.COMPLETE) {
						setTimeout(function() {
							// instance.activeLocation = null;
							instance.__next();

							if(instance.current > instance.route.length-1)
								instance.stopTracking();
							else {
								instance.__activateProperty({
									sequence: instance.current,
									callback: function() {
										setTimeout(function() {
											instance.Dom7('.route-timeline').scrollTop(instance.Dom7(".active").offset().top-120, 500);
										},300);
									}
								});
							}
						}, 700)
					}
					
				}

			},
			resetRoute: function() {

			},
			updateFocusLocation: function(location) {
				this.focusLocation = location;
				this.$forceUpdate();
			},
			phone: function(num) {
				return "tel://" + num;
			},
			skipNode: function(evt, nodeData) {
				let instance = this;
				
				if(nodeData && nodeData.Skipped == true) return;

				instance.$f7.dialog.confirm("Skip this Route Location?", "Skip",
					function() {
						nodeData.Skipped = true;
						nodeData.Status = instance.STATUS.INCOMPLETE
						instance.current++;
						instance.__activateProperty({
							sequence: instance.current
						});
					},
					function() {
						nodeData.Skipped = false;
						instance.$forceUpdate();
					}
				);
			},
			unskipNode: function(evt, nodeData) {
				let instance = this;
				instance.$f7.dialog.confirm("Re-add this Location to Ongoing Route?", "Re-Add",
					function() {
						nodeData.Skipped = false;
						nodeData.Status = instance.STATUS.INCOMPLETE
						instance.$forceUpdate();
					},
					function() {
						nodeData.Skipped = true;
						instance.$forceUpdate();
					}
				);
			},
			viewNode: function(evt, nodeData) {

			},
			focusNode: function(evt, nodeData) {
				let instance = this;
				nodeData.Expand = true;
				instance.$forceUpdate();
			},
			showDate: function() {
				return moment().format("ll");
			},
			// happens at the beginning
			startTracking: function() {
				let instance = this;

				instance.routevisible = true;
				instance.$f7.dialog.confirm(
					"Begin your Route?",
					"Begin Route",
					function() {

						// instance.$f7.notification.create({
						// 	closeOnClick: true,
						// 	closeTimeout: 3000,
						// 	text: 'Tap on [Open Location] on the next available Location to begin working.',
						// }).open();
						cordova.plugins.notification.local.schedule({
							title: 'FreshRoute Notification',
							text: 'Tap on [Open Location] on the next available Location to begin working.',
							foreground: true,
        					priority: 1
						});

						instance.__startRoute();
						instance.__activateProperty({
							sequence: instance.current
						});
					},
					function() {
						console.log('no?', arguments);
					}
				)
			},
			stopTracking: function() {
				let instance = this;
				
				var doing = _.find(instance.route, function(obj) {
					return obj.Status === instance.STATUS.DOING;
				});
				if(doing) {
					instance.$f7.dialog.alert(
						"You have unfinished Locations. Please complete before finishing Route.",
						"Hold on..."
					);
					return;
				}
				instance.$f7.dialog.confirm(
					"Finish your Route?",
					"End Route",
					function() { instance.__endRoute(); },
					function() { }
				)
			},
			pauseTracking: function() {
				let instance = this;
				instance.tracking = instance.TRACK.PAUSE;
			},
			// activateProperty: function(nodeData) {
			// 	let instance = this;
			// 	// Status wasn't part of the reactive properties, so we need to manually update
			// 	nodeData.Status = instance.STATUS.ACTIVE;
			// 	instance.$forceUpdate();
			// },
			openProperty: function(seq) {
				let instance = this;

				// if(nodeData && !nodeData.Status == instance.STATUS.ACTIVE) return;



				// instance.activeLocation = nodeData;
				// instance.locationopened = true;

				// instance.center = nodeData.Location;
				instance.zoom = 16;

				instance.__openProperty(seq);
				instance.$f7.router.navigate({ url: './activelocation/'})
			},
			stopProperty: function(nodeData) {
				let instance = this;
				
				if(nodeData && !nodeData.Status == instance.STATUS.DOING) return;

				instance.$f7.dialog.confirm(
					"Finish this Location?",
					"End Location",
					function() {
						// instance.current++;
						nodeData.Status = instance.STATUS.COMPLETE;
						nodeData.EndTime = moment().format('LLL');
						instance.current++;
						instance.activateProperty(instance.route[instance.current]);
						instance.$forceUpdate();
					},
					function() {
						console.log('no?', arguments);
					}
				)
			},

			showSummary: function() {
				this.showingsummary = true;
				this.$forceUpdate();
			},
			addRouteNode: function() {
				let instance = this;
				instance.addingroutenode = true;
			},
			closeAddRouteNode: function() {
				let instance = this;
				setTimeout(function() {
					instance.addingroutenode = false;
				}, 500)
			},
			closeActiveLocation: function(e) {
				this.__closeActiveLocation();
				instance.$f7.navbar.show(".track-nav", true)
			},
			back: function() {
				this.$f7.views.main.router.back();
			}
		}
	};


</script>
