<template>
  <div>
    <div class="left">
      <p class="form-title">Layout:&nbsp;
        <span class="keymapselect">
          <select v-model="layoutForm" class="map-select">
            <option value="">Default</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>      
          </select>
        </span>
      </p>
    </div>
    <div :style="{ width: keyLayout.container.width + 'px', height: keyLayout.container.height + 'px' }"
         id="keymap-container" class="row-full">
      <div v-for="(keyInfo, index) in keyLayout.keyMap" :key="`key-${index}`" 
           :class="{ 'key-pressed': keyCodeList[keyInfo.keyCode], 
                     'correctness1': accuracymap[keyLayout.keyMap[index].keyText.toLowerCase()] < 0.5,
                     'correctness2': accuracymap[keyLayout.keyMap[index].keyText.toLowerCase()] >= 0.5 && accuracymap[keyLayout.keyMap[index].keyText.toLowerCase()] < 0.7,
                     'correctness3': accuracymap[keyLayout.keyMap[index].keyText.toLowerCase()] >= 0.7 && accuracymap[keyLayout.keyMap[index].keyText.toLowerCase()] < 0.8,
                     'correctness4': accuracymap[keyLayout.keyMap[index].keyText.toLowerCase()] >= 0.8 && accuracymap[keyLayout.keyMap[index].keyText.toLowerCase()] < 0.9,
                     'correctness5': accuracymap[keyLayout.keyMap[index].keyText.toLowerCase()] >= 0.9, }"
           :style="{ background: keyInfo.background, color: keyInfo.color, width: keyInfo.width + 'px', height: keyInfo.height + 'px', top: keyInfo.top + 'px', left: keyInfo.left + 'px',  }"  
           draggable="true" class="key gmk-olivetti-key">
        {{ keyLayout.keyMap[index].keyText }}
        <span :class="{ 'key-pressed': keyCodeList[keyInfo.keyCode], 
                     'correctness1': accuracymap[keyLayout.keyMap[index].keyText.toLowerCase()] < 0.5,
                     'correctness2': accuracymap[keyLayout.keyMap[index].keyText.toLowerCase()] >= 0.5 && accuracymap[keyLayout.keyMap[index].keyText.toLowerCase()] < 0.7,
                     'correctness3': accuracymap[keyLayout.keyMap[index].keyText.toLowerCase()] >= 0.7 && accuracymap[keyLayout.keyMap[index].keyText.toLowerCase()] < 0.8,
                     'correctness4': accuracymap[keyLayout.keyMap[index].keyText.toLowerCase()] >= 0.8 && accuracymap[keyLayout.keyMap[index].keyText.toLowerCase()] < 0.9,
                     'correctness5': accuracymap[keyLayout.keyMap[index].keyText.toLowerCase()] >= 0.9, }"
              :style="{ background: keyInfo.background, color: keyInfo.color }"
              class="tooltiptext">{{ (accuracymap[keyLayout.keyMap[index].keyText.toLowerCase()] ? `${(accuracymap[keyLayout.keyMap[index].keyText.toLowerCase()] * 100).toFixed(2)}%` : 'No Data' )}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import defaultKeyLayout from '@/keylayouts/ergodox';
  
  export default {
    name: 'keymap-container',
    props: {
      accuracymap: {
        type: Object,
        default: () => ({}),
      },
      teststatus: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        layoutForm: '',
        keyCodeList: new Array(500).fill(0),
        keyLayout: defaultKeyLayout,
      };
    },
    watch: {
      accuracymap: {
        deep: true,
        handler(newMap) {
          console.log(this.accuracymap);
          console.log(newMap);
        },
      },
    },
    created() {
      window.addEventListener('keydown', (e) => {
        this.keyCodeList.splice(e.keyCode, 1, 1);
      });
      window.addEventListener('keyup', (e) => {
        this.keyCodeList.splice(e.keyCode, 1, 0);
      });
    },
    methods: {
      open(link) {
        this.$electron.shell.openExternal(link);
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

  #keymap-container {
    width: 760px;
    height: 355px;
    position: relative;
    text-align: center;
  }

  #keymap-container:after {
    content: " ";
    display: block;
    height: 0;
    clear: both;
  }

  .key {
    border-radius: 6px;
    font-family: Montserrat,sans-serif;
    -webkit-font-smoothing: antialiased;
    line-height: 120%;
    box-shadow: inset 0 -1px 0 3px rgba(0,0,0,.1), 0 0 0 1px rgba(0,0,0,.3);
    border-left: 1px solid rgba(0,0,0,.1);
    border-right: 1px solid rgba(0,0,0,.1);
    display: flex;
    justify-content: space-around;
    -webkit-box-align: center;
    align-items: center;
    text-align: center;
    position: absolute;
    box-sizing: border-box;
    white-space: pre-line;
    cursor: pointer;
    padding: 1px;
    padding-bottom: 20px;
    font: 14px/1.5 Noto Sans,Helvetica Neue,Helvetica,Arial,sans-serif;
    font-weight: 400;
    width: 40px;
    height: 40px;
    font-size: .61rem;
  }
  
  .centered {
    margin: 0 auto;
  }

  .key:hover {
    filter: brightness(70%) !important;
    z-index: 200;
  }

  .key-pressed {
    filter: brightness(50%) !important;
  }

  .gmk-olivetti-key {
    background: #e1dbd1;
    color: #000;
  }

  .left {
    text-align: left;
  }

  .row-full {
    margin-top: 2vh;
  }

  .keymapselect {
    background: transparent;
    font-size: 1.5vh;
  }

  select:focus {
    outline-offset: -2px;
    outline: none;
  }

  select:not(:-internal-list-box) {
    overflow: visible !important;
  }

  .keymapselect:after {
    content: '\203A';
    display: inline-block;
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    transform: rotate(90deg);
    position: relative;
    left: -1vh;
    top: 1vh;
    pointer-events: none;
    font-size: 4vh;
    font-weight: 400;
  }

  .keymapselect select {
    width: 14vh;
    -webkit-appearance: none;
    background-color: transparent;
    border: 0;
    border-bottom: 1px solid #000000;
    cursor: pointer;
  }

  .form-title {
    color: lightgrey;
    font-size: 2vh;
    font-weight: lighter;
  }

  .map-select {
    color: #4fc08d;
    font-size: 2vh;
  }

  .correctness1 {
    background-color: lightpink !important;
  }

  .correctness2 {
    background-color: #f7e5bb !important;
  }

  .correctness3 {
    background-color: #e9f38d !important;
  }

  .correctness4 {
    background-color: #c9f3a7 !important;
  }

  .correctness5 {
    background-color: #9bf792 !important;
  }

  .key .tooltiptext {
    visibility: hidden;
    pointer-events: none;
    opacity: .75;
    width: 8rem;
    font-size: 1rem;
    text-align: center;
    padding: 5px 0;
    /* Position the tooltip */
    top: -2.5rem;
    left: -2.5rem;
    position: absolute;
  }

  .key:hover .tooltiptext {
    visibility: visible;
    z-index: 900;
  }

</style>
