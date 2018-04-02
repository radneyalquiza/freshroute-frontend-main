<template>
	<f7-page>
		<f7-navbar title="Your Route" back-link=" " sliding>
			<f7-nav-right>
				<f7-link toggle-sortable="#sortable">{{sorting ? 'Done' : 'Sort'}}</f7-link>
			</f7-nav-right>
		</f7-navbar>
		<f7-block style="text-align: center">
			Swipe right for MAP, swipe left for OPTIONS.
		</f7-block>
		<f7-block>
<!-- @sortable:open="onOpen" @sortable:close="onClose" -->

			<!-- <f7-list sortable @sortable:sort="onSort"  >
				<f7-list-item
				    swipeout
				    title="Item 1"
					subtitle="Test"
					text="Test123"
					@swipeout:deleted="onSwipeoutDeleted">
					<f7-swipeout-actions right>
						<f7-swipeout-button delete>Delete</f7-swipeout-button>
					</f7-swipeout-actions>
					<f7-swipeout-actions left>
						<f7-swipeout-button>More</f7-swipeout-button>
					</f7-swipeout-actions>
				</f7-list-item>
				<f7-list-item swipeout title="Item 2" @swipeout:deleted="onSwipeoutDeleted">
					<f7-swipeout-actions right>
						<f7-swipeout-button delete>Delete</f7-swipeout-button>
					</f7-swipeout-actions>
					<f7-swipeout-actions left>
						<f7-swipeout-button>More</f7-swipeout-button>
					</f7-swipeout-actions>
				</f7-list-item>
			</f7-list> -->

			<div class="list-block media-list sortable route">
				<ul>
					<li class="swipeout transitioning" v-for="address in route" :key="address.Sequence">
						<div class="swipeout-content" style="">
							<a href="#" class=" item-content">
								<!-- <div class="item-media">
									<f7-icon color="blue" icon="icon-bars" ></f7-icon>
								</div> -->
								<div class="item-inner">
									<div class="item-title-row">
										<div class="item-title">
										{{ address.Street + " " + address.City + " " + address.PostalCode }}</div>
										<!-- <div class="item-after">17:14</div> -->
									</div>
									<!-- <div class="item-subtitle">New messages from John Doe</div> -->
									<div class="item-text">
										{{ address.FirstName + " " + address.LastName }}
                  					</div>
								</div>
							</a>
						</div>
						<div class="swipeout-actions-left">
							<a href="#" class="bg-green swipeout-overswipe demo-reply" style="left: 0px; z-index: 2;">Map</a>
							<!-- <a href="#" class="demo-forward bg-blue" style="z-index: 1;">Forward</a> -->
						</div>
						<div class="swipeout-actions-right">
							<a href="#" class="demo-actions" style="">More</a>
							<a href="#" class="demo-mark bg-orange" style="">Mark</a>
							<a href="#" data-confirm-title="Confirm Delete" data-confirm="Delete this Address from your Route?" class="swipeout-delete swipeout-overswipe" style="left: 0px;">Delete</a>
						</div>
							<div class="sortable-handler"></div>
					</li>
				</ul>
			</div>

			<f7-fab style="transform:translateY(-50px);" color="orange" @click="doSomething">
				<f7-icon icon="icon-plus" ></f7-icon>
			</f7-fab>

		</f7-block>
	</f7-page>
	
</template>

<style scoped>
.navbar-inner .right {
	margin-right: 5px;
	font-size: 15px;
}
.route .item-content {
	padding-left:5px;
}
.route .item-media {
	min-width: 20px
}
.route .item-title {
	font-size: 14px;
	font-weight: 600;
	color: #6b6b6b
}
/* .list-block .sortable-handler {
	visibility: visible !important;
	opacity: 1 !important;
} */
</style>

<script>

import _ from 'lodash'
import Vue from 'vue'

function swap(arr, x, y) {
   var origin = arr[x]
   arr.splice(x, 1, arr[y])
   Vue.set(arr, y, origin)
}
export default {
    name: "Route",
	data: function () {
		return {
			sorting: false,
			route: []
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

			// manually set event handler for sort since framework7-vue doesn't support sort+list+swipe
			Dom7(".route").on("sortable:sort", function(evt, idx) {

				var from = idx.startIndex;
				var to = idx.newIndex;

				instance.route[from].Sequence = to;
				instance.route[to].Sequence = from;

				swap(instance.route, from, to)
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
	},
	methods: {
		onSort: function (event, indexes) {
			console.log('sort', arguments);
		},
		doSomething: function() {
			this.$f7.alert("Will allow adding addresses of Clients.", "Next Release");
		}
	},
    created() {
	}
};
</script>
