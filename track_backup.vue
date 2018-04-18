<template>
	<f7-page style="padding-bottom: 60px">

		<f7-navbar title="Track Route" back-link=" " sliding>
		</f7-navbar>

		<f7-navbar fixed class="fixed-control" style="display: flex; text-align: center; margin-top: 56px; margin-bottom: 5px;">
			<div style="width: 50%">
				<!-- <div class="date" style="padding-right: 7px; text-align: right; font-size: 12px;">Feb 28, 2018</div> -->
				<clock></clock>
			</div>
			<div style="width: 50%">
				<div style="display:flex; text-align: center;">
					<div class="button fixed-control-button play" @click="startTracking()" v-bind:disabled="tracking == TRACK.PLAY"><i class="fa fa-play"></i></div>
					<div class="button fixed-control-button stop" @click="stopTracking()" v-bind:disabled="tracking == TRACK.STOP"><i class="fa fa-stop"></i></div>
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
		
		
		<div style="margin-top: 80px;" class="timeline route-timeline">

			<stopwatch></stopwatch>

			<div class="timeline-item" v-for="(address,idx) in route" :key="idx">
				<!-- <div class="timeline-item-date">21 <small>DEC</small></div> -->
				<div class="timeline-item-divider"
				     v-bind:class="{ inc: address.Status == STATUS.INCOMPLETE,
					                 done: address.Status == STATUS.COMPLETE,
									 todo: address.Status == STATUS.DOING }">
				</div>
				<div class="timeline-item-content">

					<div class="card" v-bind:class="{ active: address.Status == STATUS.ACTIVE,
													  skipped: address.Skipped == true,
													  inc: address.Status == STATUS.INCOMPLETE,
													  done: address.Status == STATUS.COMPLETE }">
						<div class="card-header">
							{{ address.FirstName + " " + address.LastName }}
							<a v-bind:href="phone(address.Phone)">({{ address.Phone }})</a>
							<a class="button skip" v-if="!address.Skipped" @click="skipNode($event, address)"><f7-icon color="blue" f7="fastforward_fill" size=13></f7-icon></a>
							<a class="button skip" v-if="address.Skipped" @click="unskipNode($event, address)"><f7-icon color="blue" fa="plus" size=14></f7-icon></a>
						</div>
						<div class="card-content">
							<!-- <f7-button @click="focusNode($event, address)">
								{{ address.Street + " " + address.City + " " + address.PostalCode }}
								<div class="moreinfo" v-bind:class="{show: address.Expand == true }">
									{{address}}
								</div>
							</f7-button> -->
							<p class="address-text">{{ address.Street + " " + address.City + " " + address.PostalCode }}</p>
							<p class="time-text" v-if="address.StartTime">
								<span v-if="address.StartTime">Start: {{ address.StartTime }}</span>
								<span v-if="address.EndTime">End: {{ address.EndTime }}</span> 
							</p>
							
							<gmap-map
								v-if="address.Location"
								:center="address.Location"
								:zoom="15"
								map-type-id="terrain"
								style="width: 100%; height: 120px"
								>
							    <gmap-marker
									v-if="address.Location"
									:position="address.Location"
									:clickable="false"
									:draggable="false"
									></gmap-marker>
							</gmap-map>
						</div>
						<div class="card-footer">
							<f7-segmented>
								<f7-button v-bind:class="{ play: address.Status == STATUS.ACTIVE }" @click="startProperty(address)" class="footer">Start</f7-button>
								<f7-button open-popup="#infopopup" @click="updateFocusLocation(address.Location)" class="footer">Info</f7-button>
								<f7-button v-bind:class="{ stop: address.Status == STATUS.DOING }"  @click="stopProperty(address)" class="footer">Done</f7-button>
							</f7-segmented>
						</div>

						
					</div>

				</div>
			</div>
		</div>

		<f7-popup id="infopopup">
			<f7-view navbar-fixed>
				<f7-pages>
					<f7-page>
						<f7-navbar title="Map">
							<f7-nav-right>
								<f7-link :close-popup="true">Close</f7-link>
							</f7-nav-right>
						</f7-navbar>
						{{ focusLocation }}
						<gmap-map
							v-if="focusLocation"
							:center="focusLocation"
							:zoom="15"
							map-type-id="terrain"
							style="width: 100%; height: 100%"
							>
							<gmap-marker
								v-if="focusLocation"
								:position="focusLocation"
								:clickable="false"
								:draggable="false"
								></gmap-marker>
						</gmap-map>
					</f7-page>
				</f7-pages>
			</f7-view>
		</f7-popup>
		<f7-block></f7-block>

		
		
	</f7-page>
	
</template>

<style scoped>
.route-timeline,
.route-timeline .card,
.route-timeline .card-header {
	font-size: 16px;
	width: 100%;
}
.route-timeline .card-header,
.route-timeline .card-footer,
.route-timeline .card-content {
	min-height: 30px;
	width: 100%;
}
.route-timeline {
	padding-left: 5px;
}
.route-timeline .button {
	line-height: 36px;
}
.route-timeline .card-header {
	padding-right: 2px;
	padding-top: 1px;
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
.stop {
	background-color:#f44336;
	color: white !important;
}

.timeline-item-content {
	width: 100%;
}
.timeline-item-divider {
	transition: all 0.5s ease-in-out;
	margin-top: 52px;
}
.timeline-item-divider.inc {
	background: #f44336;
}
.timeline-item-divider.done {
	background: #50b223;
}
.timeline-item-divider.todo {
	background: #eda444;
}
.card .skip {
	min-height: 20px;
	min-width: 20px;
}
.card.skipped {
	background-color: rgba(204, 204, 204, 0.2);
}
.card.done,
.card.inc {
	background-color: rgba(204, 204, 204, 0.2);
	pointer-events: none;
	user-select: none;
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
</style>

<script>
	import Vue from 'vue'
	import moment from 'moment'
	import Clock from '../components/clock.vue'
	import Stopwatch from '../components/stopwatch.vue'

	export default {
		name: "Track",
		components: {
			Clock: Clock,
			Stopwatch: Stopwatch
		},
		data: function () {
			return {
				sorting: false,
				route: [],
				current: 0,
				focusLocation: null,
				tracking: 0,
				TRACK: {
					STOP: 0,
					PAUSE: 1,
					PLAY: 2
				},
				STATUS: {
					INCOMPLETE: 0,
					DOING: 1,
					COMPLETE: 2,
					ACTIVE: 3
				}
			}
		},
		mounted() {
			let clients;
			let instance = this;
			let JobModel = instance.$root.CurrentUserJobModel;
			
			showPreloader();

			setTimeout(function() {
				hidePreloader();

				// if(!sessionStorage)
				if(JobModel && JobModel.RouteAddresses)
					instance.route = _.orderBy(JobModel.RouteAddresses, ['Sequence'], ['asc']);

				if(instance.$root && instance.$root.CurrentUserModel && instance.$root.CurrentUserModel.AppClients)
					clients = instance.$root.CurrentUserModel.AppClients;
				
				let addresses = [];

				for(var x=0; x<instance.route.length; x++) {

					var id = instance.route[x].AppAddressId;

					// initialization
					// on load, always set all nodes to incomplete
					instance.route[x].Status = instance.STATUS.INCOMPLETE;
					instance.route[x].Skipped = false;
					instance.route[x].Expand = false;
					instance.route[x].Location = null;
					instance.route[x].StartTime = null;
					instance.route[x].EndTime = null;

					// geocode(x);

					for(var y=0; y < clients.length; y++) {

						var addrs = clients[y].AppAddresses;

						if(addrs.length) {
							var addr = _.find(addrs, function(obj) {
								return obj.Id.toString() === id.toString();
							})
							if(addr) {
								instance.route[x] = _.extend(instance.route[x], addr);
								var client = JSON.parse(JSON.stringify(clients[y]));
								instance.route[x] = _.extend(instance.route[x], client);
								delete instance.route[x].AppAddresses;
								break;
							}
						}
					}
				}
				instance.$nextTick(function() {
					geocode();
				});

				// manually set event handler for sort since framework7-vue doesn't support sort+list+swipe
				Dom7(".route").on("sortable:sort", function(evt, idx) {

					var from = idx.startIndex;
					var to = idx.newIndex;

					instance.route[from].Sequence = to;
					instance.route[to].Sequence = from;
					swap(instance.route, from, to);


					var temp = JSON.parse(JSON.stringify(instance.route = _.orderBy(instance.route, ['Sequence'], ['asc'])));
					instance.route = [];

					setTimeout(function() { instance.route = temp; },1);
				});

				Dom7(".route").on("sortable:open", function(evt, idx) {
					instance.sorting = true;
				});
				Dom7(".route").on("sortable:close", function(evt, idx) {
					instance.sorting = false;
				});
			
			},1000);

			function geocode() {
				let geocoder = new google.maps.Geocoder();
				for(var idx=0; idx<instance.route.length; idx++) {
					(function(i) {
						geocoder.geocode( { 'address': instance.route[i].Street + " " + instance.route[i].City + " " + instance.route[i].PostalCode }, function(results, status) {
							if (status == google.maps.GeocoderStatus.OK) {
								var latitude = results[0].geometry.location.lat();
								var longitude = results[0].geometry.location.lng();

								Vue.set(instance.route[i], "Location", { lat: parseFloat(latitude), lng: parseFloat(longitude) });
								instance.$forceUpdate();

							} else {
								alert("Geocode was not successful for the following reason: " + status);
							}
						});
					})(idx);
				}
			}
		},
		created() {
			
		},
		methods: {
			updateFocusLocation: function(location) {
				this.focusLocation = location;
				this.$forceUpdate();
			},
			phone: function(num) {
				return "+1-" + num;
			},
			skipNode: function(evt, nodeData) {
				let instance = this;
				
				if(nodeData && nodeData.Skipped == true) return;

				instance.$f7.confirm("Skip this Route Location?", "Skip",
					function() {
						nodeData.Skipped = true;
						nodeData.Status = instance.STATUS.INCOMPLETE
						instance.$forceUpdate();
					},
					function() {
						nodeData.Skipped = false;
						instance.$forceUpdate();
					}
				);
			},
			unskipNode: function(evt, nodeData) {
				let instance = this;
				instance.$f7.confirm("Re-add this Location to Running Route?", "Re-Add",
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
				var str = "";
				var date = new Date();
				var monthNames = ["January", "February", "March", "April", "May", "June",
				"July", "August", "September", "October", "November", "December"
				];
				str += monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
				return str;
			},
			showTime: function() {
				return new Date().toTimeString();
			},
			// happens at the beginning
			startTracking: function() {
				let instance = this;

				console.log(instance);
				instance.$f7.confirm(
					"Begin your Route?",
					"Begin Location",
					function() {
						instance.$f7.addNotification({
							message: 'Tap on Start on the next available Location when you begin working.',
						});
						instance.tracking = instance.TRACK.PLAY;
						instance.activateProperty(instance.route[instance.current]);
						// instance.$forceUpdate();
					},
					function() {
						console.log('no?', arguments);
					}
				)
			},
			stopTracking: function() {
				let instance = this;
				instance.$f7.confirm(
					"Finish your Route?",
					"End Route",
					function() { instance.tracking = instance.TRACK.STOP; },
					function() { }
				)
			},
			pauseTracking: function() {
				let instance = this;
				instance.tracking = instance.TRACK.PAUSE;
			},
			activateProperty: function(nodeData) {
				let instance = this;
				// Status wasn't part of the reactive properties, so we need to manually update
				nodeData.Status = instance.STATUS.ACTIVE;
				instance.$forceUpdate();
			},
			startProperty: function(nodeData) {
				let instance = this;

				if(nodeData && !nodeData.Status == instance.STATUS.ACTIVE) return;

				// Status wasn't part of the reactive properties, so we need to manually update
				nodeData.Status = instance.STATUS.DOING;
				nodeData.StartTime = moment().format('LLL');
				instance.$forceUpdate();
			},
			stopProperty: function(nodeData) {
				let instance = this;
				
				if(nodeData && !nodeData.Status == instance.STATUS.DOING) return;

				instance.$f7.confirm(
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
			}
		}
	};


// function geocode(idx) {
// 		console.log(idx);
// 		let geocoder = new google.maps.Geocoder();
// 		return geocoder.geocode( { 'address': instance.route[idx].Street + " " + instance.route[idx].City + " " + instance.route[idx].PostalCode }, function(results, status) {
// 			console.log(results);
// 			if (status == google.maps.GeocoderStatus.OK) {
// 				//Got result, center the map and put it out there
// 				// map.setCenter(results[0].geometry.location);
// 				// var marker = new google.maps.Marker({
// 				// 	map: map,
// 				// 	position: results[0].geometry.location
// 				// });
// 				var latitude = results[0].geometry.location.lat();
// 				var longitude = results[0].geometry.location.lng();
// 				// instance.route[idx].Location = {
// 				// 	lat: latitude,
// 				// 	lng: longitude
// 				// }
// 				// instance.$forceUpdate();
// 				console.log('sss', { lat: parseFloat(latitude), lng: parseFloat(longitude) });
// 				Vue.set(instance.route[idx], "Location", { lat: parseFloat(latitude), lng: parseFloat(longitude) })

// 			} else {
// 				alert("Geocode was not successful for the following reason: " + status);
// 			}
// 		});
// 	}
</script>
