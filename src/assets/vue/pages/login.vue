<template>
	<!-- <f7-login-screen id="login-screen" style="padding:30px;"> -->
		<f7-page login-screen>
			<f7-login-screen-title>Login</f7-login-screen-title>
			<f7-list form>
				<f7-list-item>
					<f7-label>Username</f7-label>
					<f7-input name="username" placeholder="Username"
					    :value="username"
    			        @input="username = $event.target.value" type="text">
					</f7-input>
				</f7-list-item>
				<f7-list-item>
					<f7-label>Password</f7-label>
					<f7-input name="password" type="password" 
					    :value="password"
    			        @input="password = $event.target.value" placeholder="Password"></f7-input>
				</f7-list-item>
			</f7-list>
			<f7-block>
				<f7-button big :fill=true color="blue" ripple-color="yellow" @click="login">Sign In </f7-button>
			</f7-block>
			<f7-block>
				<p class="advisor" v-bind:class="{ error: isError, success: !isError }">{{ loginMessage }}</p>
			</f7-block>
			<f7-block>
				<p class="advisor">Forgot Password?</p>
			</f7-block>

		</f7-page>
	<!-- </f7-login-screen> -->
</template>

<style scoped>
.advisor {
  text-align: center;
  font-size: 12px;
  color: #969696;
}
.advisor.error,
.advisor.success {
	color:#e26a6a;
	font-weight: 600;
}
.advisor.success {
	color: #7dbf76; 
}
</style>

<script>
// import Utilities from './assets/js/utilities.class.js';
function parseResponseText(rt) {
	let resultjson = null;
	try {
		resultjson = JSON.parse(rt);
	} catch (e) {}

	return resultjson;
}

import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'

export default {
	name: "Login",
	data() {
		return {
			username: "",
			password: "",
			loginMessage: "",
			isError: false
		};
	},
	created() {},
	mounted() {
		console.log('in login');
	},
	// this.$f7 ----> main APP Framework7 instance
	computed: mapGetters({
		CurrentLocation: 'User/currentLocation',
		Model: 'Model/Model',
		UserModel: 'User/UserModel'
	}),
	methods: {
	  	...mapActions({
			__findUser: 'User/findUser',
			__getCurrentLocation: 'User/getCurrentLocation'
    	}),
		closeLogin() {
			let f7 = this.$f7;
			f7.router.navigate({
				url: '/',
				pushState: true,
				// history: false,
				clearPreviousHistory: true,
				reloadAll: true,
				ignoreCache : true
			});
		},
		login() {
			let instance = this;
			var root = this.$root;

			console.log('test', instance.username, instance.password)

			sessionStorage.removeItem("AppUserId");

			instance.$f7.preloader.show();

			// setTimeout(function() {
				
				instance.__findUser({
					username: instance.username,
					password: instance.password
				})
				.then(function(obj) {

					instance.$f7.preloader.hide();

					console.log('bbbb', obj);

					instance.loginMessage = "Success! Welcome " + obj.user.FirstName + " " + obj.user.LastName + "!";
					instance.isError = false;
					
					setTimeout(function() {
						sessionStorage.setItem("AppUserId", obj.id);
						instance.closeLogin();
					}, 1000);
				})
				.catch(function(faildata) {

					instance.$f7.preloader.hide();

					instance.$f7.notification.create({
							text: faildata
						}).open();

					instance.loginMessage = "No User Found.";
					instance.isError = true;
				})
				

			// }, 2000);

		//   return;
		//   Dom7.ajax({
		//     url: "https://api.wawawa.bid/api/users/Login",
		//     method: "POST",
		//     dataType: "json",
		// 	contentType: "application/json",
		// 	beforeSend: function() {
		// 		showPreloader();
		// 	},
		//     data: JSON.stringify({
		// 		UserName: instance.username,
		// 		Password: instance.password
		// 	}),
		//     success: function(response) {
		// 		hidePreloader();
		// 		instance.loginMessage = "Success! Welcome " + response.FirstName + " " + response.LastName + "!";
		// 		instance.isError = false;
		// 		setTimeout(function() {
		// 			sessionStorage.setItem("session", response._encryptPassword);
		// 			sessionStorage.setItem("AppUserId", response.Id);
		// 			instance.closeLogin();
		// 		}, 2000);
		//     },
		// 	statusCode: {
		// 		400: function (xhr) {
		// 			hidePreloader();
		// 			var respjson = parseResponseText(xhr.responseText);
		// 			instance.loginMessage = respjson.Value;
		// 			instance.AppUserId = "";
		// 			instance.isError = true;
		// 		}
		// 	}
		//   });

		}
	}
};
</script>
