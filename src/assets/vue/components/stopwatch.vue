<template>
    <span id="time" v-html="time"></span>
</template>

<style>
    
</style>

<script>
    export default {
		props: ['stopcounter'],
        data: function() {
            return {
                state: "started",
                startTime: Date.now(),
                currentTime: Date.now(),
				interval: null
            }
        },
        mounted: function() {
			this.interval = setInterval(this.updateCurrentTime, 1000);
			this.$watch('stopcounter', this.pause)
        },
        destroyed: function() {
            clearInterval(this.interval)
		},
        computed: {
            time: function() {
                return this.hours + ':' + this.minutes + ':' + this.seconds;
            },
            milliseconds: function() {
                return this.currentTime - this.$data.startTime;
            },
            hours: function() {
                var lapsed = this.milliseconds;
                var hrs = Math.floor((lapsed / 1000 / 60 / 60));
                return hrs >= 10 ? hrs : '0' + hrs;
            },
            minutes: function() {
                var lapsed = this.milliseconds;
                var min = Math.floor((lapsed / 1000 / 60) % 60);
                return min >= 10 ? min : '0' + min;
            },
            seconds: function() {
                var lapsed = this.milliseconds;
                var sec = Math.ceil((lapsed / 1000) % 60);
                return sec >= 10 ? sec : '0' + sec;
            }
        },
        methods: {
            reset: function() {
                this.$data.state = "started";
                this.$data.startTime = Date.now();
                this.$data.currentTime = Date.now();
            },
            pause: function(stop) {
				if(stop == true)
					this.$data.state = "paused";
				else if(stop == false)
					this.$data.state = "play";
				else
					this.$data.state = "paused";

                var mins = this.minutes || 0;
                var hours = this.hours || 0;
                var sec = this.seconds || 0;
                var totalseconds = (parseInt(mins) * 60) + parseInt(sec);
                totalseconds = parseInt(totalseconds) + (parseInt(hours) * 60);
				
				this.$emit('stoppedcounting', { text: (this.hours + ':' + this.minutes + ':' + this.seconds), value: totalseconds });
            },
            resume: function() {
                this.$data.state = "started";
            },
            updateCurrentTime: function() {
                if (this.$data.state == "started") {
                    this.currentTime = Date.now();
                }
            }        
        }
    } 
</script>
