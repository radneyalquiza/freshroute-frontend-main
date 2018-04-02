<template>
    <f7-page navbar-fixed>
        <f7-navbar title="Add to Route">
            <f7-nav-right>
                <f7-link :close-popup="true" @click="closeAddRouteNode()">Close</f7-link>
            </f7-nav-right>
        </f7-navbar>
        <f7-block>
            test
        </f7-block>
    </f7-page>
</template>

<style>

</style>

<script>

    export default {
		components: {
		},
        data: function() {
            return {
			
            }
        },
		created() {
		},
        mounted() {
            console.log('dsdsdsd', this);
		},
		methods: {
            closeAddRouteNode: function() {
                let instance = this;
                instance.$f7.router.back();
            }
		},
		computed: {

		},
    } 
</script>
