<template>
  <div id="wrapper">
    <div class="center">
      <measure class="mPanel" @test="onTestSignal" @prepare="resetTest" :wordcount="wordCount" :nerrors="nErrors" :ncorrect="nCorrect"/>
    </div>
    <div class="center">
      <textWindow class="textwindow" @nerrors="handleNErrors" @ncorrect="handleNCorrect" @mapupdate="mapDataReceiver" @completewords="wCompHandler" :prepare="reset" :teststatus="testRunning"/>
    </div>
    <div class="center">
      <KeyMapCont class="keyboard" :accuracymap="accuracyMap" :teststatus="testRunning"/>
    </div>
  </div>
</template>

<script>
  import KeyMapCont from '@/components/keyboard';
  import textWindow from '@/components/textwindow';
  import measure from '@/components/measurements';

  export default {
    name: 'landing-page',
    components: {
      KeyMapCont,
      textWindow,
      measure,
    },
    data() {
      return {
        accuracyMap: {},
        chartData: [],
        testRunning: false,
        reset: false,
        wordCount: 0,
        nErrors: 0,
        nCorrect: 0,
      };
    },
    methods: {
      open(link) {
        this.$electron.shell.openExternal(link);
      },
      onTestSignal(started) {
        this.testRunning = started;
        this.reset = false;
        if (started) {
          console.log('started');
        } else {
          console.log('ended');
        }
      },
      wCompHandler(data) {
        if (this.testRunning) {
          this.wordCount = data;
        }
      },
      mapDataReceiver(data) {
        if (this.testRunning || this.reset) {
          this.accuracyMap = JSON.parse(data);
        }
      },
      resetTest() {
        this.reset = true;
      },
      handleNErrors(data) {
        console.log('erors updated');
        this.nErrors = data;
      },
      handleNCorrect(data) {
        this.nCorrect = data;
      },
    },
  };
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100%;
    padding: 0 0 0 0;
    width: 100%;
    overflow: hidden;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .mPanel {
    display: inline-block;
  }

  .keyboard {
    display: inline-block;
  }

  .textwindow {
    display: inline-block;
  }
  
  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }

  .center {
    text-align: center;
    width: 100%;
  }

  .centered {
    margin: auto auto;
  }
</style>
