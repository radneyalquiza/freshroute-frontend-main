<template>
    <div class="countto" style="transition:all 0.2s ease-in-out">{{displayNumber}}</div>
</template>

<style>

</style>

<script>
    export default {
        props:{
          'number':{ default:0 }
        },
        data: function(){
            return {
                displayNumber:0,
                interval:false
            }
        },
        mounted() {
          let instance = this;
          setTimeout(function() {
            instance.displayNumber = instance.number ? instance.number : 0;
            instance.$forceUpdate();

            clearInterval(instance.interval);
          
              if(instance.number == instance.displayNumber){
                return;
              }
          
              instance.interval = window.setInterval(function(){
              
                if(instance.displayNumber != instance.number){
              
                  var change = (instance.number - instance.displayNumber) / 10;
                  
                  change = change >= 0 ? Math.ceil(change) : Math.floor(change);
                
                  instance.displayNumber = instance.displayNumber + change;
                
                }
              
              }.bind(instance), 19);



          }, 1000);
        },
        
    }
</script>