<template>
  <div>
    <div class="mContainer">
      <div :class="{ 'leaf-active': curLeaf == 0 }" class="met-bar bar-quart"></div>
      <div :class="{ 'leaf-active': curLeaf == 1 }" class="met-bar bar-half"></div>
      <div :class="{ 'leaf-active': curLeaf == 2 }" class="met-bar bar-tquart"></div>
      <div :class="{ 'sound-bar': curLeaf == 3 }" class="met-bar bar-full"></div>
      <div :class="{ 'leaf-active': curLeaf == 4 }" class="met-bar bar-tquart"></div>
      <div :class="{ 'leaf-active': curLeaf == 5 }" class="met-bar bar-half"></div>
      <div :class="{ 'leaf-active': curLeaf == 6 }" class="met-bar bar-quart"></div>
    </div>
    <div class="met-ctl-container">
      <p class="bpm-title">BPM:&nbsp;
        <span class="bpm-span">
          <input v-model="mBPM" placeholder="60" type="number" max="999" class="bpm-form">
        </span>
      </p>
      <button :class="{ 'met-btn-disabled': playing }" v-on:click="startMetronome" class="met-button">Start</button>
      <button :class="{ 'met-btn-disabled': !playing }" v-on:click="stopMetronome" class="met-button">Stop</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'metronome',
    data() {
      return {
        mBPM: 60,
        nMLeaves: 7,
        curLeaf: 0,
        direction: 1,
        lastBeatTime: new Date(),
        intervalId: null,
        audioCtx: null,
        tick: null,
        tickVolume: null,
        soundHz: 1000,
        playing: false,
      };
    },
    created() {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.tick = this.audioCtx.createOscillator();
      this.tickVolume = this.audioCtx.createGain();
      this.tick.type = 'sine';
      this.tick.frequency.value = this.soundHz;
      this.tickVolume.gain.value = 0;
      this.tick.connect(this.tickVolume);
      this.tickVolume.connect(this.audioCtx.destination);
      this.tick.start();
    },
    methods: {
      open(link) {
        this.$electron.shell.openExternal(link);
      },
      nextTick() {
        this.intervalId = setTimeout(() => {
          const curDate = new Date();
          if (Math.abs(this.lastBeatTime - curDate) > (((60 / this.mBPM) * 1000) / this.nMLeaves)) {
            this.curLeaf += this.direction;
            if (this.curLeaf >= this.nMLeaves - 1) {
              this.direction = -1;
            } else if (this.curLeaf <= 0) {
              this.direction = 1;
            }
            if (this.curLeaf === Math.floor(this.nMLeaves / 2)) {
              this.click();
            }
            this.lastBeatTime = curDate;
          }
          this.nextTick();
        }, ((60 / this.mBPM) * 1000) / (this.nMLeaves * 100));
      },
      startMetronome() {
        this.playing = true;
        this.nextTick();
      },
      stopMetronome() {
        this.playing = false;
        this.tickVolume.gain.value = 0;
        clearTimeout(this.intervalId);
        this.curLeaf = 0;
        this.direction = 1;
        this.lastBeatTime = new Date();
      },
      click() {
        const time = this.audioCtx.currentTime;
        this.clickAtTime(time);
      },
      clickAtTime(time) {
        // Silence the click.
        this.tickVolume.gain.cancelScheduledValues(time);
        this.tickVolume.gain.setValueAtTime(0, time);

        // Audible click sound.
        this.tickVolume.gain.linearRampToValueAtTime(1, time + 0.001);
        this.tickVolume.gain.linearRampToValueAtTime(0, time + 0.001 + 0.01);
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

  .mContainer {
      background-color: transparent;
      width: 25vh;
      height: 6vh;
      text-align: center;
      overflow: hidden; 
      display: block; 
      padding: 0 0 0 0;
      margin: 0 0 0 0;
  }

  .met-bar {
    width: 12%;
    background-color: lightgrey;
    display: inline-block;
    bottom: 0;
    border-radius: 1vh;
    vertical-align: middle;
  }

  .sound-bar {
    background-color: #4fc08d;
  }

  .leaf-active {
    filter: brightness(70%) !important;
  }

  .bar-full {
    height: 90%;
  }

  .bar-quart {
    height: 30%;
  }

  .bar-half {
    height: 50%;
  }

  .bar-tquart {
    height: 70%;
  }

  .row-full {
    margin-top: 2vh;
  }

  .bpm-title {
    color: lightgrey;
    font-size: 12px;
    font-weight: lighter;
    width: 30%;
    display: inline-block;
  }

  .bpm-form {
    color: #4fc08d;
    font-size: 3vh;
  }

  input:focus {
    outline-offset: -2px;
    outline: none;
  }

  input:not(:-internal-list-box) {
    overflow: visible !important;
  }

  .bpm-span .bpm-form {
    width: 100%;
    -webkit-appearance: none;
    background-color: transparent;
    border: 0;
    border-bottom: 1px solid #000000;
    cursor: pointer;
  }

  .met-button {
    display: inline-block;
    font-size: 12px;
    cursor: pointer;
    outline: none;
    width: 30%;
    padding: .3vh 1vh;
    border-radius: 2vh;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .met-btn-disabled {
    filter: brightness(50%);
    cursor: not-allowed;
    pointer-events: none;
  }

  .met-ctl-container {
    display: block;
    width: 25vh;
  }
</style>