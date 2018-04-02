<style scoped>
@import url(https://fonts.googleapis.com/css?family=Nunito);

body {
  font-size: 16px;
}

.container {
  max-width: 25rem;
  margin: 50px auto;
  text-align: center;
}

.clock {
  /* background: #fff; */
  /* border: .3rem solid #fff; */
  border-radius: .5rem;
  display: inline-block;
  margin: auto;
  text-align: center;
}

.clock__hours,
.clock__minutes,
.clock__seconds {
  /* background: linear-gradient(to bottom, #26303b 50%, #2c3540 50%); */

  /* main color */
  /* background: linear-gradient(to bottom,  #3ca9e8 50%, #43b2f2 50%); */
  background-color: transparent;
  display: inline-block;
  color: #fff;
  font-family: 'Nunito', sans-serif;
  font-size: 1.6rem;
  font-weight: 300;
  /* padding: .5rem 1rem; */
  padding: 7px;
  padding-left:2px;
  text-align: center;
  position: relative;
  margin: auto;
}

.clock__hours {
  /* border-right: .15rem solid #fff; */
  border-radius: .5rem 0 0 .5rem;
}
.clock__minutes {
  /* border-right: .15rem solid #fff; */
}
.clock__seconds {
  border-radius: 0 .5rem .5rem 0;
}

.clock__hourtime {
  font-size: 0.8rem;
  position: absolute;
  top: 4px;
  left: -10px;
}
</style>

<script>

export default {
	template: "<div class=clock><div class=clock__hours><span class=clock__hourtime>{{hourtime}}</span> {{hours}}</div><div class=clock__minutes>{{minutes}}</div><div class=clock__seconds> {{seconds}}</div></div>",
	data: function data() {
		return {
			hours: '',
			minutes: '',
			seconds: '',
			hourtime: ''
		};
	},
	mounted: function ready() {
		this.updateDateTime();
	},

	methods: {
		updateDateTime: function updateDateTime() {
			var self = this;
			var now = new Date();

			self.hours = now.getHours();
			self.minutes = self.getZeroPad(now.getMinutes());
			self.seconds = self.getZeroPad(now.getSeconds());
			self.hourtime = self.getHourTime(self.hours);
			self.hours = self.hours % 12 || 12;
			if(self.hours.toString().length == 1)
				self.hours = "0"+self.hours;

			setTimeout(self.updateDateTime, 1000);
		},
		getHourTime: function getHourTime(h) {
			return h >= 12 ? 'PM' : 'AM';
		},
		getZeroPad: function getZeroPad(n) {
			return (parseInt(n, 10) >= 10 ? '' : '0') + n;
		}
	}
};

</script>
