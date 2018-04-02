<template>
	<f7-page>
		<f7-navbar title="Daily Report" back-link=" " sliding>
		</f7-navbar>

		

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
