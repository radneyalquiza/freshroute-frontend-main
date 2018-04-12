<style scoped>
	.card.activelocation {
		margin-top: 3px;
		margin-left: 0;
		margin-right: 0;
		position: fixed;
		z-index:998;
		width: 100%;
		max-height: 50%;
	}
	.card.activelocation .address{
		color: #22910e;
		font-size: 0.85em;
	}
	.card .bg {
		opacity: 0.2;
		position: absolute;
		top:0; left: 0;
		height: 100%;
		width: 100%;
		background-repeat: no-repeat;
		background-position: center center;
		background-blend-mode: multiply;
		background-size: contain;
	}


	.card.activelocation .timediff,
	.card.activelocation .weatherposition {
		display: flex;
		width: 100%;
		padding: 0;
		text-align: center;
		font-size: 1.5em;
		min-height: 40px;
		border-bottom: 1px solid #ededed;
	}

	.card.activelocation .times,
	.card.activelocation .timer,
	.card.activelocation .weather,
	.card.activelocation .position {
		padding: 8px;
		display: inline-block;
		width: 32%;
		position: relative;
		font-weight: 1000;
		font-size: 0.75em !important;
		text-transform: uppercase;
	}

	.card.activelocation .times .label,
	.card.activelocation .timer .label,
	.card.activelocation .weather .label,
	.card.activelocation .position .label {
		margin:auto;
		margin-top: 0px;
		display: block;
		font-size: 0.7em;
		transition: all 0.2s ease-in-out;
		color: #999999;
		max-width: 80px;
	}

	.card.activelocation .times .label.start,
	.card.activelocation .times .label.stop,
	.card.activelocation .times .label.pause {
		margin:auto;
		margin-top: 7px;
		font-size: 1em;
		background-color: #50b223;
		color: white;
		border-radius: 5px;
		font-weight: 400;
		padding: 0;
		width: 90%;
		max-width: 90%;
	}
	.card.activelocation .times .label.started,
	.card.activelocation .times .label.paused,
	.card.activelocation .times .label.stopped {
		margin-bottom: 0;
		pointer-events: none;
		user-select: none;
		height: 16px;
    	line-height: 2;
	}
	.card.activelocation .times .label.pause {
		background-color: #efaf00;
	}
	.card.activelocation .times .label.stop {
		background-color: #f44336;
	}

	.card.activelocation .times .timedisplay,
	.card.activelocation .timer .temptimer {
		margin-top: 0px;
		padding: 5px;
		display: block;
		color: #7c7c7c;
	}
	.card.activelocation .buttons-cont {
		border-bottom: 1px solid #e5e5e5;
	}

	.card.activelocation .weather,
	.card.activelocation .position {
		text-align: left;
		font-weight: 500;
	}
	.card.activelocation .weather .data,
	.card.activelocation .position .data {
		font-size: 0.70em;
		max-width: 75px;
		display:block;
	}



	.card.activelocation .starttext,
	.card.activelocation .endtext,
	.card.activelocation .difftext {
		position: absolute;
		top: 5px;
		left: 10px;
		font-size: 0.65em;
		color: #727272;
	}
	.card.activelocation .endtext {
		top: 48px;
	}
	.card.activelocation .endtime {
		top: 15px;
	}

	.card.activelocation .service {
		display: flex;
		width: 100%;
		padding: 0;
	}
	.card.activelocation .service .servicechild {
		width: 33%;
		padding: 15px;
		padding-bottom: 7px;
		font-size:1em;
		position: relative;

	}
	.card.activelocation .service .servicechild span.label {
		position: absolute;
		color: #727272;
		text-align: center;
		top:5px;
		left: 20px;
		font-size:0.7em;
	}
	.card.activelocation .service .servicechild .type,
	.card.activelocation .service .servicechild .freq,
	.card.activelocation .service .servicechild .prc {
		padding: 5px;
		padding-top: 1px;
		padding-bottom: 1px;
		border-radius: 10px;
		display: inline-block;
		margin-top: 2px;
		min-width: 60px;
		font-size: 0.9em;
		text-align: left;
	}

	.truncate {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.temptimer.paused {
		animation: pulse 1s infinite;
		-moz-animation: pulse 1s infinite;
		-webkit-animation: pulse 1s infinite;
	}

	/* --------------------------------------------------- */
	/* Animations */
	/* --------------------------------------------------- */
	@-webkit-keyframes pulse {
		0% { opacity: 1; }
		50% { opacity: 0.5; }
		100% { opacity: 1; }
	}
	@keyframes pulse {
		0% { opacity: 1; }
		50% { opacity: 0.5; }
		100% { opacity: 1; }
	}

</style>

<script>

import moment from 'moment'
import Stopwatch from '../components/stopwatch.vue'
// import url from '../../images/weather/02d.png'
import { mapGetters, mapActions } from 'vuex'

export default {
	// <span class='temptimer' v-if="!startwatching">00:00:00</span>
	// <stopwatch v-if="startwatching" :stopcounter="stopcounter" @stoppedcounting="storeDuration" @pause="onPause" style="font-size: 1.2em"></stopwatch>


	// <div class="bg" v-if="location.Weather" :style="{ backgroundImage: 'url(' + weatherimage + ')' }"></div>
	// <div class="button" :disabled="gpsvalidation" @click="enableGPSValidation()" style="bottom:55px; left: 10px; font-size: 10px;position: fixed; z-index: 1100; background-color: #278aad; color: white;">[FOR DEMO] Enable Distance Validation</div>
	template:   `<div>
					
					<div class="card activelocation" v-if="location">

						<div class="buttons-cont">
							<f7-segmented style="width: 100%;">
								<f7-button v-if="location.Status != STATUS.COMPLETE && location.Status != STATUS.DONE" @click="backToTimeline()" class="footer "><f7-icon fa="map"></f7-icon> Back to Route</f7-button>
								<f7-button v-if="location.Status == STATUS.DOING" @click="takeBeforePhoto()" class="footer yellow"><f7-icon fa="camera"></f7-icon> Before</f7-button>
								<f7-button v-if="location.Status == STATUS.DONE" @click="takeAfterPhoto()" class="footer yellow"><f7-icon fa="camera"></f7-icon> After</f7-button>
								<f7-button v-if="location.Status == STATUS.DONE" @click="saveLocationAndExit()" class="footer yellow">JOB COMPLETED</f7-button>
							</f7-segmented>
						</div>
						<div class="cont">

							<div class="card-header">
								{{ location.AppClient.FirstName + " " + location.AppClient.LastName }}
								<span class='address'>{{ location.AppAddress.Street + " " + location.AppAddress.City + " " + location.AppAddress.PostalCode }}</span>
							</div>
							<div class="card-content ">

								<div class="timediff">
									<div class='times' style="width:70%; display: flex">
										<div style="width: 100%">
											<f7-button class='label ' v-bind:class="{ start: !start, started: start }" @click="startTimer()">START</f7-button>
											<span class='timedisplay' v-if="start">{{ start }}</span>
										</div>
										<div v-if="start && !end" style="width: 100%">
											<f7-button class='label ' v-bind:class="{ pause: !pausestart, paused: pausestart }" @click="togglePauseTimer()">{{ location.JobData.Paused ? location.JobData.PauseTimer : 'PAUSE' }}</f7-button>
										</div> 
										<div v-if="start" style="width: 100%">
											<f7-button class='label ' v-bind:class="{ stop: !end, stopped: end }" @click="stopTimer()">STOP</f7-button>
											<span class='timedisplay' v-if="end">{{ end }}</span>
										</div>
									</div>
									<div class='timer' style="width: 30%">
										<div>
											<span class='label'>ELAPSED</span>
											<span class='temptimer' v-if="!location.JobData">00:00:00</span>
											<span class='temptimer' v-bind:class="{ paused: location.JobData.Paused }" v-if="location.JobData">{{ location.JobData.Timer }}</span>
										</div> 
									</div>
								</div>

								<div class="weatherposition">
									<div class='weather' style="width: 55%; padding-right: 0px;">
										<div style="display: flex">
											<div style="margin-right: 5px; width: 30%;">
												<span v-if="location.Weather" class="data" style="text-align: center"><img style="width: 35px; margin: auto" :src="weatherimage" /></span>
											</div> 
											<div style="margin-right: 10px">
												<span class='label'>WINDS</span>
												<span v-if="location.Weather" class="data">{{ location.Weather.wind.speed }} km/h</span>
											</div>
											<div style="margin-right: 5px">
												<span class='label'>TEMP</span>
												<span v-if="location.Weather" class="data">{{ location.Weather.main.temp }} C</span>
											</div> 
										</div> 
									</div>
									<div class='position' style="width: 45%">
										<div style="">
											<div style="margin-right: 5px;">
												<span class='label'style="margin-left:0;">MY LOCATION</span>
												<span v-if="whereyouare" class="data truncate" style="width: 100%; max-width:100%;">{{ whereyouare }}</span>
												<span v-if="Distance" class="data" style="width: 100%; max-width:100%;">{{ distance }} ({{ distancetime }}) away</span>
											</div>
										</div> 
									</div>
								</div>


								<div class="service" v-if="location.AppServices">
									<div class="servicechild type" style="width:15%"><span class="label">Type</span><span class="cont type ">{{ appservice.AppServiceType }}</span></div>
									<div class="servicechild" style="width:55%;"><span class="label">Frequency</span><span class="cont freq">{{ appservice.Frequency }}</span></div>
									<div class="servicechild" style="width:30%"><span class="label">Price</span><span class="cont prc">$ {{ appservice.Price }}</span></div>
								</div>
							</div>
						</div>
					</div>
				</div>`,



				// <img :src='weatherimages + location.Weather.weather[0].icon + ".png"' />



	props: ['clocation'],
	components: {
		Stopwatch: Stopwatch
	},

	data: function data() {
		return {
			location: null,
			// start: null,
			// end: null,
			pausestart: null,
			pauseend: null,
			startwatching: false,
			stopcounter: false,
			duration: null,
			GeocodedLocation: null,
			// CurrentLocation: null,
			// weatherimages: url,
			Distance: null,
			DistanceTime: null,
			gpsvalidation: false
		};
	},

	computed:
		Object.assign({},
			mapGetters({
				UserLocation: 'User/currentLocation',
				startedRoute: 'Route/started',
				activeLocation: 'Route/activeLocation',
				whereyouare: 'User/currentAddress',
				STATUS: 'Route/LocationStatus'
			}),
			{
				weatherimage () {
					console.log(this.location.Weather);
					return require('../../images/weather/' + this.location.Weather.weather[0].icon + '.png')
				},
				distance() {
					return (this.Distance / 1000).toFixed(1) + " km";
				},
				distancetime() {
					return (this.DistanceTime / 60).toFixed(1) + " mins";
				},
				start: function() {
					if(this.location.JobData)
						return this.location.JobData.DateTimeStarted;
				},
				end: function() {
					if(this.location.JobData) {
						console.log(this.location);
						return this.location.JobData.DateTimeEnded;
					}
				},
				appservice: function() {
					for (var x in this.location.AppServices) {
						return this.location.AppServices[x]; // return first appservice only (for now)
					}
				}
			}
		)
	,

	mounted: function ready() {
		let instance = this;

		instance.location = instance.activeLocation;
		
		if(!instance.location ||
		   !instance.location.JobData ||
		   !instance.location.JobData.DateTimeStarted)
		{
			// instance.getCurrentLocation();

			instance.getWhereUser();
			instance.getCurrentLocationAddress();
			instance.getWeather();
		
			// for demo purposes, distances are not validated in case employee is too far
			instance.gpsvalidation = false;
		}
	},

	methods:
		Object.assign({},
		mapActions({
			__startPropertyTimer: 'Route/startPropertyTimer',
			__pausePropertyTimer: 'Route/pauseTimer',
			__unpausePropertyTimer: 'Route/unpauseTimer',
			__stopPropertyTimer: 'Route/stopTimer',
			__getWeather: 'Route/updateWeather',
			// __getAddress: 'Route/getAddress',
			__getDFL: 'Route/getDistanceFromLocation',
			__getUserCurrentAddress: 'User/getCurrentAddress',
			__closeActiveLocation: 'Route/closeProperty',
			__completeProperty: 'Route/completeProperty',
			__jobComplete: 'Route/jobComplete'
		}),
		{
			getWeather: function() {
				let instance = this;
				instance.__getWeather();

			},
			getWhereUser: function() {
				let instance = this;
				instance.__getUserCurrentAddress();
			},
			getCurrentLocationAddress: function() {
				let instance = this;

				// instance.getAddress(function(data) {
				// 	instance.$f7.addNotification({ message: 'Geocoder failed due to: ' + data });
				// });

				instance.__getDFL({
					userlocation: instance.UserLocation,
					callback: function(data) {
						console.log('doddododo', data);
						instance.Distance = data.rows[0].elements[0].distance.value; // in meters
						instance.DistanceTime = data.rows[0].elements[0].duration.value; // in seconds
					}
				});

				instance.$forceUpdate();
			},
			endLocation: function() {
				let instance = this;
				
				if(instance.gpsvalidation && instance.Distance > 500) {
					instance.$f7.alert("You are too far from the Job site.", "Distance Error");
					return;
				}

				if(!instance.start) {
					instance.$f7.alert("You cannot stop a Job without starting.", "Error");
					return;
				}

				instance.$f7.confirm("Complete Job for this Location?", "Finish",
					function() {
						// instance.location.EndTime = moment();
						// instance.location.Status = 2;
						// instance.end = moment(instance.location.EndTime).format('LT');
						// instance.stopcounter = true;
						// instance.$forceUpdate();
						console.log(instance.location)
						instance.__completeProperty(instance.location.Sequence);
					},
					function() {
						instance.$forceUpdate();
					}
				);

			},
			startTimer: function() {
				let instance = this;

				if(instance.gpsvalidation && instance.Distance > 500) {
					instance.$f7.alert("You are too far from the Job site.", "Distance Error");
					return;
				}

				// instance.start = moment().format('LT');
				// instance.startwatching = true;
				instance.__startPropertyTimer(instance.location.Sequence);
				// Status wasn't part of the reactive properties, so we need to manually update
				// instance.location.Status = instance.STATUS.DOING;
			},
			stopTimer: function() {
				let instance = this;

				if(instance.gpsvalidation && instance.Distance > 500) {
					instance.$f7.alert("You are too far from the Job site.", "Distance Error");
					return;
				}
				instance.__stopPropertyTimer(instance.location.Sequence);
			},
			togglePauseTimer: function() {
				let instance = this;
				if(!instance.location.JobData.Paused)
					instance.__pausePropertyTimer(instance.location.Sequence);
				else
					instance.__unpausePropertyTimer(instance.location.Sequence);
			},
			storeDuration: function(dur) {
				// dur.text
				// dur.value
				let instance = this;
				if(dur)
					instance.duration = dur;
			},
			saveLocationAndExit: function() {
				let instance = this;
				// instance.location.Duration = instance.duration;
				// instance.STATUS = instance.STATUS.COMPLETE;
				instance.__jobComplete(instance.location.Sequence);
				instance.__closeActiveLocation();
				instance.$emit('doneProperty', instance.location)
				instance.$forceUpdate();
			},
			takeBeforePhoto: function() {
				let instance = this;
				navigator.camera.getPicture(function() {
					// instance.$f7.notification.create({
					// 	text: "Will save the before photo."
					// }).open();
				}, function(data) {
					// instance.$f7.notification.create({
					// 	text: "Failed to take photo."
					// }).open();
				});
			},
			takeAfterPhoto: function() {
				let instance = this;
				navigator.camera.getPicture(function() {
					// instance.$f7.notification.create({
					// 	text: "Will save the after photo."
					// }).open();
				}, function(data) {
					// instance.$f7.notification.create({
					// 	text: "Failed to take photo."
					// }).open();
				});
			},
			backToTimeline: function() {
				let instance = this;
				// setTimeout(function() {
					instance.__closeActiveLocation();
					instance.$emit('doneProperty', this.location);
				// }, 300);
			},
			enableGPSValidation: function() {
				this.gpsvalidation = true;
				// this.$f7.notification.create({
				// 	title: "FreshRoute",
				// 	closeTimeout: 3000,
				// 	text: "This will validate if your location is too far from the job site. On production, it will be always active. Press [Back] to redo the Route."
				// }).open();
			}
	})
};

</script>
