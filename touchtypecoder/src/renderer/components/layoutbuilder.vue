<template>
  <div>
    <div>
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
           :class="{ 'key-pressed': keyCodeList[keyInfo.keyCode] }" 
           :style="{ background: keyInfo.background, color: keyInfo.color, width: keyInfo.width + 'px', height: keyInfo.height + 'px', top: keyInfo.top + 'px', left: keyInfo.left + 'px' }"  
           draggable="true" class="key gmk-olivetti-key">
        {{ keyLayout.keyMap[index].keyText }}
      </div>
    </div>
  </div>
</template>

<script>
  import defaultKeyLayout from '@/keylayouts/ergodox';
  
  export default {
    name: 'layoutbuilder',
    data() {
      return {
        layoutForm: '',
        keyCodeList: new Array(500).fill(0),
        keyLayout: defaultKeyLayout,
      };
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

  .key:hover {
    filter: brightness(70%) !important;
  }

  .key-pressed {
    filter: brightness(50%) !important;
  }

  .gmk-olivetti-key {
    background: #e1dbd1;
    color: #000;
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

</style>
