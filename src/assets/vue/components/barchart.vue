<style>

</style>

<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  props: ['labels','datasets'],
  computed: {
    'chartdata': function () {
      return {
        labels: this.labels,
        datasets: this.datasets
      }
    }
  },

  mounted () {
console.log(this.labels, this.datasets)
    this.renderChart({
      labels: this.labels,
      datasets: this.datasets
	}, { responsive: true, maintainAspectRatio: false })

	//   console.log(this.chartdata);
    // // Overwriting base render method with actual data.
    // this.renderChart(this.chardata,  { responsive: true, maintainAspectRatio: false });
  }
}
</script>
