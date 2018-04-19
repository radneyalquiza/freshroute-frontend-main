<template>
	<f7-page class="routelist">
		<f7-navbar title="Create Route" back-link=" ">
		</f7-navbar>

		<div class="list no-hairlines-md" v-if="route">
			<ul>
				<li class="item-content item-input">
					<div class="item-inner">
						<div class="item-title item-label">Route Name</div>
						<div class="item-input-wrap">
							<f7-input type="text" :value="route.Name"
								@input="route.Name = $event.target.value" placeholder="" clear-button></f7-input>
							<span class="input-clear-button" @click="route.Name = ''"></span>
						</div>
					</div>
				</li>
				<li class="item-content item-input">
					<div class="item-inner">
						<div class="item-title item-label">Description</div>
						<div class="item-input-wrap">
							<f7-input type="text" :value="route.Description"
								@input="route.Description = $event.target.value" placeholder="" clear-button></f7-input>
							<span class="input-clear-button" @click="route.Description = ''"></span>
						</div>
					</div>
				</li>
			</ul>
		</div>

		<div class="employees">
			<div class="employees-title">
				Workers
			</div>
			<div class="employees-item list" style="margin-top: 0px; margin-bottom: 0px">
				<ul>
					<li style="background-color:#efefef ">
						<a class="item-link smart-select smart-select-init" data-open-in="popover" @smartselect:closed="storeCurrentEmployees()">
							<select name="workers" v-model="attachedemployees" multiple>
							<!-- <optgroup label="Japanese"> -->
								<option v-for="user in employees"
										:key="user.UserName"
										:value="user.AppUserId"
										>
										{{ user.UserName }}
								</option>
							<!-- </optgroup> -->
							</select>
							<div class="item-content">
								<div class="item-inner">
									Select
								</div>
							</div>
						</a>
					</li>
				</ul>

				<f7-block style="margin-top: 1px; margin-bottom: 10px; padding-left: 5px; padding-right: 5px;" >

					<f7-list class="emps" style="margin-top: -2px" v-if="route && currentWorkers.length">
						<f7-list-item v-for="(emp, index) in currentWorkers" @click="setActiveEmployee(emp,index)" :key="emp.AppUser.AppUserId" :title="emp.AppUser.UserName">
							<span style="font-size: 12px">{{ dollar(emp.Pay) }}</span>
						</f7-list-item>
					</f7-list>
					<div class='sheet-modal sheet-emp-details scrollable'>

						<div class="toolbar">
							<div class="toolbar-inner">
								<div class="left">Employee Details</div>
								<div class="right"><a class="link" @click="closeViewDetails()">Done</a></div>
							</div>
						</div>

						<div class="sheet-modal-inner" style="overflow-y: auto">
							<f7-block class='empinfo' v-if="activeemp">
								<f7-block class="infocontainer">
									<div>Name: {{ activeemp.AppUser.FirstName + " " + activeemp.AppUser.LastName }}</div>
									<div>User Name: {{ activeemp.AppUser.UserName }}</div>
								</f7-block>
							</f7-block>
							<f7-block class='empinfo' v-if="activeemp">
								<div style="padding-left: 15px; padding-top:10px;">Pay {{ dollar(activeemp.Pay) }}</div>
								<f7-block class="infocontainer">
									<div class="rate" style="display: flex">
										<!-- <div style="width: 30%">
											<f7-label style="width: auto" >Rate</f7-label>
											<span>{{ dollar(activeemp.Pay) }}</span>
										</div> -->
										<f7-range :value="activeemp.Pay"
													@range:change="updatePay(activeemp, $event)" :draggableBar="true" color="orange" :label="true" :min="0.00" :max="100.00" :step="0.50" >
										</f7-range>
									</div>
								</f7-block>
							</f7-block>
						</div>
						
					</div>
				</f7-block>

			</div>
		</div>

		<div class="nodes">
			<div class="nodes-title">
				Route Locations
			</div>
			<div class="nodes-item" style="display: flex; padding: 10px; border-bottom: 1px solid #e0e0e0">
				<div class="" style="font-size: 13px; padding-top: 5px">This route has <strong>{{ route && route.Nodes ? Object.keys(route.Nodes).length : 0 }}</strong> locations.</div>
				<f7-button style="width:170px; margin:auto;" @click="openNodes()" small :fill=true raised color="green">Open Locations UI</f7-button>
			</div>
		</div>


		<f7-button style="width:95%; margin:auto;" @click="saveRoute()" big :fill=true raised color="blue">Save Route</f7-button>



	</f7-page>
	
</template>

<style scoped>
.navbar-inner .right {
	margin-right: 5px;
	font-size: 15px;
}
.item-title {
	font-weight: 600;
	color: #6d6d6d;
}
.item-after {
	font-size: 12px !important;
}
.item-subtitle {
	color: #6d6d6d;
	font-size: 12px !important;
}
.empinfo {
	border: 1px solid #f4f4f4;
	margin: auto;
	margin-bottom: 5px !important;
	width: 99%;
	padding-left: 0;
	padding-right: 0;
}
.empinfo .block-title {
	font-weight: 600;
	margin-bottom: 10px;
}
.empinfo .infocontainer {
	padding-bottom: 5px;
	margin-bottom: 5px;
	margin-top: 10px;
}
.employees, .nodes {
	margin-bottom: 10px;
	
}
.employees-title, .nodes-title {
	background-color: #a7b6ce;
	color: white;
	padding: 10px;
}

.emps .item-inner {
	height: 25px !important;
	min-height: 25px !important;
}
.sheet-emp-details .left {
	padding: 5px;
	padding-left: 15px;
	font-weight: 600;
}
</style>

<script>

import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import _ from 'lodash'

export default {
    name: "CreateRoute",
	data: function () {
		return {
			sorting: false,
			// clients: [],
			route: {
				Name: "",
				Description: ""
			},
			services: [], // list of all services
			employees: [], // list of all employees
			attachedemployees: [],	// list of selected employee id's
			parsedemployees: [],	// list of actual attached employee info
			currentWorkers: [],
			activeemp: null
		}
	},
	computed: {
		...mapGetters({
			UserModel: 'User/UserModel',
		})
	},
	watch: {
		attachedemployees: function(newval, oldval) {
			let instance = this;

			if(newval && newval.length && instance.employees.length)
			{
				let tempworkers = [];

				if(!newval.length) tempworkers = [];

				for(var x=0; x<newval.length; x++) {
					var found = findemp(instance.currentWorkers, newval[x]);
					if(found) {
						tempworkers.push(found)
					}
					else {
						let s = _.find(instance.employees, function(obj) {
							return obj.AppUserId === newval[x];
						})
						if(s) tempworkers.push({ AppUser: s, Pay: 0 });
					}
				}
				instance.currentWorkers = tempworkers;
			}
			else {
				if(oldval.length > newval.length && newval.length == 0)
					instance.currentWorkers = [];
			}

			function findemp(collection, appuserid) {
				for(var x=0; x<collection.length; x++) {
					if(collection[x].AppUser && collection[x].AppUser.AppUserId == appuserid)
						return collection[x];
				}
				return null;
			}
		}
	},
    mounted() {
		let instance = this;

		// get all users
		instance.$firebase.database().ref("AppUsers")
		.once("value", function(data) {
			let e = data.val();
			for(var x in e) {
				e[x].AppUserId = x;
				instance.employees.push(e[x]);
			}
		})
		instance.$firebase.database().ref("AppServices")
		.once("value", function(data) {
			let e = data.val();
			for(var x in e)
				instance.services.push(e[x]);
		})

	},
	methods: {
		...mapActions({
			getRoutes: 'RouteModel/getRoutes',
			selectActiveRoute: 'RouteModel/selectActiveRoute',
			__getRouteData: 'Route/getRouteData',
		}),
		dollar: function(a) {
			return "$" + parseFloat(a).toFixed(2) + "/hr";
		},
		updatePay: function(emp, amt) {
			emp.Pay = amt;
			this.$forceUpdate();
		},
		openRoute: function(approuteid) {
			let instance = this;
			instance.selectActiveRoute(approuteid);
			setTimeout(function() {
				instance.$f7.router.navigate({ url: "./viewroute/" })
			});
		},
		storeCurrentEmployees: function() {
			let instance = this;

			instance.route.Workers = instance.currentWorkers;
		},	
		
		date: function(date) {
			return moment(date).format("lll")
		},

		setActiveEmployee: function(emp, idx) {
			this.activeemp = emp;
			this.$f7.sheet.open(".sheet-emp-details", true);
		},

		saveRoute: function() {

			let instance = this;
			console.log(instance.route, instance.attachedemployees, instance.parsedemployees, instance.currentWorkers);

		},

		closeViewDetails: function() {
			let i = this;
			setTimeout(function() {
				i.$f7.sheet.close(".sheet-emp-details", true);
			}, 100);
		},

		openNodes: function() {
			this.$f7.router.navigate({ url: "./routelocations/" });
		}
		
	},
    created() {
	}
};
</script>
