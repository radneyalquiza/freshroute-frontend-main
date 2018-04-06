<template>
	<f7-page navbar-fixed>
		<f7-navbar title="Expenses">
			<f7-nav-right>
				<f7-link @click="$f7.router.back()">Close</f7-link>
			</f7-nav-right>
		</f7-navbar>
		<f7-block>
			
            <f7-list no-hairlines-md>
                <f7-list-item>
					<f7-label floating>Description</f7-label>
					<f7-input type="text" :value="description"
    			        		@input="description = $event.target.value" placeholder="Description"  clear-button></f7-input>
				</f7-list-item>

				<f7-list-item>
					<f7-label floating>Amount</f7-label>
					<f7-input type="number" :value="amount"
    			        	  @input="amount = $event.target.value" placeholder="Amount" v-model="amount" clear-button></f7-input>
				</f7-list-item>

				<f7-list-item>
					<f7-label floating>Receipt/Invoice Number</f7-label>
					<f7-input type="text" :value="receiptnumber"
    			        	  @input="receiptnumber = $event.target.value" placeholder="Receipt/Invoice Number" v-model="receiptnumber" clear-button></f7-input>
				</f7-list-item>
			</f7-list>

			<f7-button style="width: 200px;margin: auto" @click="addExpense" :fill=true round raised color="blue">
				<i class="fa fa-plus"></i> Add Expense
			</f7-button>

			<f7-block v-if="ExternalExpenses.length > 0">
				<f7-block-title>{{ today }}: Expenses for {{ RouteName }}</f7-block-title>
				<f7-list>
					<f7-list-item v-for="exp in ExternalExpenses" :key="exp.$index">
						<div style='width:100%'> {{ exp.Description }} | Receipt {{ exp.ReceiptNumber || "N/A" }} <span style='float:right'>{{ '$ ' + parseFloat(exp.Amount).toFixed(2) }}</span></div>
					</f7-list-item>

				</f7-list>

			</f7-block>

		</f7-block>
	</f7-page>
</template>

<style>

</style>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'

export default {
	name: "add-expense",
	data: function() {
		return {
			amount: null,
			description: null,
			receiptnumber: null
		};
	},
	watch: {},
	mounted: function() {},
	computed: {
		...mapGetters({ 
			ExternalExpenses: 'Route/ExternalExpenses',
			RouteName: 'Route/RouteName'
		}),
		today: function() {
			return moment().format("LL");
		}
	},
	methods: {
		...mapActions({
			addExternalExpense: 'Route/addExternalExpense'
		}),
		addExpense: function() {
			let instance = this;

			if(!instance.description || !instance.amount) {
				instance.$f7.alert("Please enter some information.", "Oops!");
				return;
			}

			instance.addExternalExpense({
				Description: instance.description,
				Amount: instance.amount,
				ReceiptNumber: instance.receiptnumber
			})

			instance.description = null;
			instance.amount = null;
			instance.receiptnumber = null;
		},

	}
};
</script>