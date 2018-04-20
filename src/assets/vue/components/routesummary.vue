<template>

	<f7-page navbar-fixed>
		<f7-navbar v-bind:title="name + ' Summary'">
			<f7-nav-right>
				<f7-link @click="$f7.router.back()">Close</f7-link>
			</f7-nav-right>
		</f7-navbar>

		<div class="route-summary" v-if="locations.datasets.length && money.datasets.length">
				<!-- <f7-swiper pagination navigation>
					<f7-swiper-slide> -->
						
						<h4>Locations</h4>
						<donut-chart v-if="locations.datasets" :width="150" :height="150" :datasets="locations.datasets" :labels="locations.labels"></donut-chart>
						
						<div class="summary-data-row">
							<div class="data-container" style="text-align: right">
								<div class="data-label">Completed</div>
								<div class="data">
									<!--<countto :number='1000'></countto>-->
										<ICountUp
										:startVal="startVal"
										:endVal="endVal"
										:duration="duration"
										:options="options"
										@ready="onReady"
										/>
										locations
								</div>
							</div>
							<div class="data-container" style="text-align: left">
								<div class="data-label">Incomplete</div>
								<div class="data">
									<!--<countto :number='1000'></countto>-->
										<ICountUp
										:startVal="startVal"
										:endVal="completeddata.incomplete"
										:duration="duration"
										:options="options"
										@ready="onReady"
										/>
										locations
								</div>
							</div>
						</div>

						<f7-block></f7-block>

						<h4>Time</h4>
						<div class="summary-data-row">
							<div class="data-container" style="text-align: right">
							<div class="data-label">Total Route Time</div>
							<div class="data">
									<!--<countto :number='1000'></countto>-->
									<ICountUp
									:startVal="startVal"
									:endVal="completeddata.totaltime"
									:decimals="decimals"
									:duration="duration"
									:options="options"
									@ready="onReady"
									/>
									mins
							</div>
							</div>
							<div class="data-container" style="text-align: left">
							<div class="data-label">Avg Time Worked</div>
							<div class="data">
									<!--<countto :number='1000'></countto>-->
									<ICountUp
									:startVal="startVal"
									:endVal="completeddata.averagetime"
									:decimals="decimals"
									:duration="duration"
									:options="options"
									@ready="onReady"
									/>
									mins
							</div>
							</div>
						</div>

						<f7-block></f7-block>
						
						<h4>Profit</h4>
						<donut-chart v-if="money.datasets" :width="150" :height="150"  :options="chartoptions" :datasets="money.datasets" :labels="money.labels"></donut-chart>
						
						<div class="summary-data-row">
							<div class="data-container"  style="text-align: right">
							<div class="data-label">Revenue</div>
							<div class="data">
									<!--<countto :number='1000'></countto>-->
									$ <ICountUp
									:startVal="startVal"
									:endVal="completeddata.totalserviceprice"
									:decimals="decimals"
									:duration="duration"
									:options="options"
									@ready="onReady"
									/>
							</div>
							</div>
							<div class="data-container"  style="text-align: left">
							<div class="data-label">Misc. Expenses</div>
							<div class="data">
									<!--<countto :number='1000'></countto>-->
									$ <ICountUp
									:startVal="startVal"
									:endVal="completeddata.miscexpenses"
									:decimals="decimals"
									:duration="duration"
									:options="options"
									@ready="onReady"
									/>
							</div>
							</div>
						</div>
						<div class="summary-data-row">
							<div class="data-container"  style="text-align: right">
							<div class="data-label underline">Total Employee Pay</div>
							<div class="data">
									<!--<countto :number='1000'></countto>-->
									$ <ICountUp
									:startVal="startVal"
									:endVal="completeddata.totalemployeepay"
									:decimals="decimals"
									:duration="duration"
									:options="options"
									@ready="onReady"
									/>
							</div>
							</div>

							<div class="data-container"  style="text-align: left">
							<div class="data-label underline">Employees Worked</div>
							<div v-for="(emp, idx) in workers" :key="idx" class="data-label mini">
								({{ dollar(emp.Pay) }}) &nbsp; {{ emp.AppUser.UserName }} 
							</div>

							<!-- <div class="data">
									$ <ICountUp
									:startVal="startVal"
									:endVal="completeddata.totalserviceprice"
									:decimals="decimals"
									:duration="duration"
									:options="options"
									@ready="onReady"
									/>
							</div> -->
							</div>
						</div>

				<f7-block>
					<f7-button :fill="true" blue raised @click="createWork()">Save Work Details</f7-button>
				</f7-block>

		</div>
	</f7-page>

</template>

<style>
.route-summary {
	color: #4b5259;
	overflow-x: hidden;
}
h4 {
	text-align: center;
	font-size: 1.4em;
	border-bottom: 1px solid #d6d6d6;
}
h3 {
	text-align: center;
	font-size: 1.4em;
	border-bottom: 1px solid #d6d6d6;
}
.data-container {
	width: 100%;
	display: block;
	text-align: center;
	padding-right: 20px;
}
.data-label {
	margin-top: 3px;
	margin-bottom: 3px;
	display: block;
	font-size: 0.8em;
	font-weight: 500;
	text-transform: uppercase;
	color: #37455b;
}
.data {
	display: block;
	width: 100%;
	color: #445675;
}
.data span {
	font-size: 1.6em;
	font-weight: 800;
}
.summary-data-row {
	display: flex;
	width: 100%;
	padding: 3px;
	padding-bottom: 15px;
}
donut-chart {
	display: block;
}
.data-label.underline {
	text-decoration: underline;
}
.data-label.mini {
	font-size: 0.75em;
}
</style>

<script>
	import ICountUp from 'vue-countup-v2'
	import BarChart from '../components/barchart.vue'
	import DonutChart from '../components/donutchart.vue'
	import { mapGetters, mapActions } from 'vuex'

function timeConversion(millisec) {

        var seconds = (millisec / 1000).toFixed(1);

        var minutes = (millisec / (1000 * 60)).toFixed(1);

        var hours = (millisec / (1000 * 60 * 60)).toFixed(1);

        var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);

        if (seconds < 60) {
            return seconds + " Sec";
        } else if (minutes < 60) {
            return minutes + " Min";
        } else if (hours < 24) {
            return hours + " Hrs";
        } else {
            return days + " Days"
        }
    }

    export default {
		components: {
			BarChart,
			DonutChart,
			ICountUp
		},
		computed: {
			...mapGetters({
				route: 'Route/Route',
				routename: 'Route/RouteName',
				expense: 'Route/ExternalExpenses',
				workers: 'Route/Workers',
				routeid: 'Route/RouteId'
			})
		},
        data: function() {
            return {
				donutData: null,
				name: "Default Route",
				completeddata: {},
				startVal: 0,
				endVal: 0,
				decimals: 2,
				duration: 5,
				options: {
					useEasing: true,
					useGrouping: true,
					separator: ',',
					decimal: '.',
					prefix: '',
					suffix: ''
				},
				chartoptions: {
					legend: {
						display: false
					}
				},

				labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
				datasets: [
					{
						label: 'Data One',
						borderColor: 'red',
						// pointBackgroundColor: 'white',
						borderWidth: 1,
						pointBorderColor: "red",
						// backgroundColor: "#f3f3f3",
						data: [40, 39, 10, 40, 39, 80, 40]
					},{
						label: 'Data Two',
						borderColor: 'blue',
						// pointBackgroundColor: 'white',
						borderWidth: 1,
						// backgroundColor: "#337abe",
						data: [60, 55, 32, 10, 2, 12, 53]
					}
				],
				locations: null,
				money: null
            }
        },
		created() {
			let instance = this;
			instance.getData();
			instance.name = instance.routename;
			instance.endVal = instance.completeddata.completed;

		},
        mounted() {
		},
		methods: {
			...mapActions({
				resetRoute: 'Route/resetRouteStore'
			}),
			dollar: function(a) {
				return "$" + parseFloat(a).toFixed(2) + "/hr";
			},
			onReady: function(instance, CountUp) {
				const that = this;
				// instance.update(that.endVal + 50);
			},
			getData: function() {

				let instance = this;
				var completed = 0;
				var totalserviceprice = 0;
				var totaltime = 0;
				var averagetime = 0;
				var miscexpenses = 0.00;
				var incomplete = 0;
				var totalemployeepay = 0.00;
				var totalmilliseconds = 0;
				
				for(var x=0; x<instance.route.length; x++) {
					if(instance.route[x].Status == 2) {
						completed++;
						if(instance.route[x].AppServices) {
							for(var a in instance.route[x].AppServices) {
								totalserviceprice += parseFloat(instance.route[x].AppServices[a].Price);
								break;
							}
						}
						if(instance.route[x].JobData.TotalJobTime) {
							averagetime += instance.route[x].JobData.TotalJobTime;
						}
					}
					else
						incomplete++;
				}

				totaltime = parseFloat(averagetime / (1000 * 60)); // in minutes
				if(averagetime) {
					averagetime = (averagetime / (1000 * 60)) / completed;
					if(!averagetime) averagetime = 0;

					// if(averagetime < 60) {
					// 	averagetime = averagetime + "seconds";
					// }
					// else if(averagetime > 60 && averagetime < 3600)
					// 	averagetime = averagetime + "minutes";
					// else if(averagetime > 3600)
					// 	averagetime = averagetime + "hours";
				}

console.log('aaaa', instance.workers)
				for(var x in instance.workers) {
					var g = instance.workers[x];
					var pay = parseFloat(g.Pay) * (totaltime / 60.00); 
					totalemployeepay += parseFloat(pay); 
				}

				if(instance.expense) {
					console.log(instance.expense)
					for(var x=0; x<instance.expense.length; x++) {
						miscexpenses += parseFloat(instance.expense[x].Amount);
					}
				}
				instance.locations = {};
				instance.locations.labels = ['Completed', 'Not Completed'];
				instance.locations.datasets = [{
					backgroundColor: [
						'#41B883',
						'#E46651',
					],
					data: [completed, incomplete]
				}];
				instance.money = {};
				instance.money.labels = ['Revenue', 'Expenses'];
				instance.money.options = {
					legend: { display: false }
				}
				instance.money.datasets = [{
					backgroundColor: [
						'#00D8FF',
						'#DD1B16'
					],
					data: [totalserviceprice, miscexpenses]
				}];

				console.log('ddd', totalemployeepay);

				instance.$forceUpdate();
				instance.completeddata = {
					completed: parseInt(completed),
					incomplete: parseInt(incomplete),
					totalserviceprice: parseInt(totalserviceprice),
					averagetime: parseFloat(averagetime),
					miscexpenses: parseInt(miscexpenses),
					totaltime: parseFloat(totaltime),
					totalemployeepay: parseFloat(totalemployeepay)
				};

			},
			createWork() {

				let instance = this;

				instance.$f7.dialog.confirm("Route Job will be saved and you will be returned to the home screen. Is this ok?", "Save and Close",
					async function() {
						let s = await instance.saveWork();
						instance.resetRoute();
						sessionStorage.removeItem("SelectedAppRouteId");
						instance.$f7.router.navigate({ url: '/' });
					},
					function() {}
				);
				
			},

			saveWork() {
				let instance = this;

				instance.$firebase.database().ref("AppWork")
				.push({
					SaveDate: Date.now(),
					WorkData: instance.completeddata,
					Route: {
						AppRouteId: instance.routeid,
						Workers: instance.workers,
						Nodes: instance.route
					}
				})
			}
		},
    } 
</script>
