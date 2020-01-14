<template>
  <div>
    <div class="mWrapper">
      <div v-if="showModal" class="countdown-modal-container">
        <div class="countdown-modal">
          <div style="display: flex; height: 100%; justify-content: center; align-items: center; width: 100%; overflow: wrap; text-align: center;">
            <div style="font-size: 1.5rem; text-transform: uppercase; opacity: .5;">
              {{ modalMessage }}
            </div>
          </div>
        </div>
      </div>
      <div class="gWrapper">
        <div class="controls">  
          <button v-on:click.prevent="toggleTest" v-on:keyup.prevent class="startbtn">{{ !testRunning ? 'Start' : 'Cancel' }}</button>
          <input type="checkbox" id="checkbox" v-model="typeStart">
          <label class="checklbl" for="checkbox">{{ typeStart ? 'Type to Start' : 'Count down' }}</label>
        </div>
        <div  class="timer">
          <div>{{ elapsedTime }}</div>
        </div>
        <div class="stats">
          <div class="text-m text-blue">{{ `WPM: ${curWPM}` }}</div>
          <div class="text-small text-green">{{ `Best: ${bestWPM}` }}</div>
        </div>
        <div id="chart1"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import c3 from 'c3';

  export default {
    name: 'measurement-window',
    props: {
      wordcount: {
        type: Number,
        default: 0,
      },
      nerrors: {
        type: Number,
        default: 0,
      },
      ncorrect: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        typeStart: false,
        testType: 'Speed',
        testRunning: false,
        btnTxt: 'Begin',
        curWPM: 0,
        worstWPM: 0,
        bestWPM: 0,
        nErrors: 0,
        nCorrect: 0,
        statChart: null,
        cError: ['error'],
        cCorrect: ['correct'],
        cWPM: ['wpm'],
        modalMessage: 'Setting up environment...',
        showModal: false,
        countTimer: null,
        defaultMessage: 'Setting up environment...',
        elapsedTime: this.msToTime(0),
        elapsedTimeMinutes: 0,
        timerid: null,
        timeAtTimerStart: null,
      };
    },
    watch: {
      wordcount(newCount) {
        console.log('wordCount received in controller', newCount);
        if (this.elapsedTimeMinutes <= 0) {
          return;
        }
        this.curWPM = this.roundHalf(newCount / this.elapsedTimeMinutes);
      },
    },
    mounted() {
      window.addEventListener('resize', this.resizeChart);

      this.statChart = c3.generate({
        bindto: '#chart1',
        data: {
          columns: [
            this.cWPM,
            this.cError,
          ],
          colors: {
            wpm: '#4f85c0',
            error: '#ffb6c1',
          },
          selection: {
            enabled: true,
            grouped: true,
            multiple: true,
          },
          onclick(d, element) { console.log('onclick', d, element); },
          onselected(d, element) { console.log('onselected', d, element); },
          onunselected(d, element) { console.log('onunselected', d, element); },
          ondragstart() { console.log('ondragstart'); },
          ondragend() { console.log('ondragend'); },
        },
      });
      this.resizeChart();
    },
    methods: {
      open(link) {
        this.$electron.shell.openExternal(link);
      },
      incErrors() {
        this.nErrors += 1;
      },
      incSuccess() {
        this.nCorrect += 1;
      },
      loadChartData() {
        this.statChart.load({
          columns: [
            this.cWPM,
            this.cError,
          ],
        });
      },
      resizeChart() {
        this.statChart.resize({ height: window.innerHeight * 0.3 });
      },
      toggleTest() {
        if (this.testRunning) {
          this.cWPM.push(this.curWPM);
          this.cError.push(this.nerrors);
          this.cCorrect.push(this.ncorrect);
          this.loadChartData();
          if (this.curWPM > this.bestWPM) {
            this.bestWPM = this.curWPM;
          }
          this.cancelTest();
        } else {
          this.$emit('prepare', true);
          this.startTest();
        }
      },
      cancelTest() {
        this.showModal = false;
        this.modalMessage = this.defaultMessage;
        if (this.countTimer) {
          clearInterval(this.countTimer);
          this.countTimer = null;
        }
        if (this.timerid) {
          clearInterval(this.timerid);
          this.timerid = null;
        }
        if (this.showModal && this.typeStart) {
          window.removeEventListener('keydown', this.typeBegin);
        }
        this.testRunning = false;
        this.$emit('test', this.testRunning);
      },
      startTest() {
        this.testRunning = !this.testRunning;
        this.showModal = true;
        if (this.typeStart) {
          document.addEventListener('keydown', this.typeBegin);
          this.modalMessage = 'Begin typing to start the assessment...';
        } else {
          this.modalMessage = 'Beginning assessment...';
          this.timeBegin(3);
        }
      },
      typeBegin() {
        document.removeEventListener('keydown', this.typeBegin);
        this.startTimer();
        this.showModal = false;
        this.$emit('test', this.testRunning);
      },
      timeBegin(seconds) {
        this.countTimer = setTimeout(() => {
          if (seconds <= 0) {
            clearInterval(this.countTimer);
            this.countTimer = null;
            this.modalMessage = 'Start!';
            this.startTimer();
            setTimeout(() => {
              this.showModal = false;
              this.modalMessage = this.defaultMessage;
            }, 500);
            this.$emit('test', this.testRunning);
          } else {
            this.modalMessage = `${seconds}`;
            this.timeBegin(seconds - 1);
          }
        }, 1000);
      },
      startTimer() {
        this.elapsedTime = this.msToTime(0);
        this.timeAtTimerStart = new Date();
        this.timerid = setInterval(() => {
          this.elapsedTime = this.msToTime(Math.abs(this.timeAtTimerStart - new Date()));
        }, 250);
      },
      msToTime(duration) {
        this.elapsedTimeMinutes = duration / 60000;
        let seconds = Math.floor((duration / 1000) % 60);
        let minutes = Math.floor((duration / (1000 * 60)) % 60);
        const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        minutes = (minutes < 10 && hours > 0) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;

        return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${seconds}s`;
      },
      roundHalf(num) {
        return Math.round(num * 2) / 2;
      },
    },
    beforeDestroy() {
      if (this.showModal && this.typeStart) {
        window.removeEventListener('keydown', this.typeBegin);
      }
      window.removeEventListener('resize', this.resizeChart);
      this.statChart.destroy();
    },
  };
</script>

<style>
  @import '../../../node_modules/c3/c3.css';
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  .countdown-modal-container {
    position: absolute;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 0;
  }

  .countdown-modal {
    margin: 0 auto;
    left: 50%;
    margin-left: -20%;
    position: absolute;
    bottom: -18rem;
    height: 12rem;
    border: 1px solid lightgrey;
    background-color: rgba(255, 255, 255, .9);
    backdrop-filter: blur(20rem);
    width: 40%;
    box-shadow: 0 .5rem .5rem 0 rgba(0, 0, 0, 0.2), 0 .5rem .5rem 0 rgba(0, 0, 0, 0.19);
  }

  .mWrapper {
    position: relative;
    padding: 0px 20px 0px 20px;
    width: 60vw;
    border-radius: 10px;
    display: flex;
    text-align: left;
    font-size: 3vh;
  }
  
  .controls {
    display: block;
    position: absolute;
    top: 0;
    left: 0; 
    margin-left: 4rem;
    z-index: 500;
    float: left;
  }

  .timer {
    color: lightgrey;
    position: absolute;
    width: 10rem;
    text-align: center;
    height: 2rem;
    left: 50%;
    margin-left: -5rem;
  }

  .stats {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    float: right;
  }

  .gWrapper {
    height: 100%;
    position: relative;
    width: 100%;
  }

  #chart-1 {
    height: 100%;
  }

  .text-green {
    color: #4fc08d;
  } 

  .text-grey {
    color: lightgrey;
  }

  .text-blue {
    color: #4f85c0;
  }

  .text-red {
    color: #ffb6c1;
  }

  .text-m {
    font-size: 2rem;
  }
  
  .text-small {
    font-size: 1rem;
  }

  .bottom-left {
    position: absolute;
    bottom: 20px;
    left: 20px;
  }

  .startbtn{
    font-size: 1rem;
    cursor: pointer;
    outline: none;
    width: 8rem;
    height: 2rem;
    padding: .3vh 1vh;
    border-radius: 1vh;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .startbtn:hover {
    filter: brightness(70%);
  }

  .checklbl {
    font-size: 1rem;
  }
</style>