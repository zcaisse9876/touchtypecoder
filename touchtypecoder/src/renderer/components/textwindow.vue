<template>
  <div>
    <div class="text-box">
      <p class="scrapetext"><span class="pretext">{{ typed }}</span><span :class="{ 'char-failed': error, 'valid-cursor': !error }" class="curtext">{{ current }}</span><span class="posttext">{{ untyped }}</span></p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'text-window',
    props: {
      teststatus: {
        type: Boolean,
        default: false,
      },
      prepare: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        typed: '',
        current: '',
        untyped: '',
        wCharset: 'abcdefghijklmnopqrstuvwxyz'.split(''),
        pLength: 20,
        wMax: 8,
        error: false,
        timesAppeared: {},
        correctMap: {},
        accuracyMap: {},
        nErrors: 0,
        nCorrect: 0,
        wordsComplete: 0,
      };
    },
    watch: {
      teststatus: {
        deep: true,
        handler(newVal) {
          if (newVal) {
            console.log('test started');
          }
        },
      },
      prepare: {
        deep: true,
        handler(newVal) {
          if (newVal) {
            this.reset();
          }
        },
      },
    },
    created() {
      for (let i = 0; i < this.wCharset.length; i += 1) {
        this.timesAppeared[this.wCharset[i]] = 0;
        this.correctMap[this.wCharset[i]] = 0;
      }
      this.correctMap[' '] = 0;
      this.timesAppeared[' '] = 0;

      window.addEventListener('keydown', (e) => {
        if (e.keyCode === 20 || e.keyCode === 16 || this.prepare) {
          return;
        }
        const tempKey = this.current;
        this.timesAppeared[tempKey] += 1;

        if (e.key === this.current) {
          this.nCorrect += 1;
          this.correctMap[tempKey] += 1;
          if (tempKey === ' ') {
            this.wordsComplete += 1;
            this.$emit('completewords', this.wordsComplete);
          }
          this.error = false;
          this.typed += this.current;
          this.current = this.untyped[0]; // eslint-disable-line
          this.untyped = this.untyped.slice(1);
        } else {
          this.nErrors += 1;
          this.error = true;
        }

        if (this.untyped.length <= 0) {
          this.typed = '';
          this.current = '';
          this.untyped = '';
          this.generateParagraph();
        }

        this.accuracyMap[tempKey] = this.correctMap[tempKey] / this.timesAppeared[tempKey];
        this.$emit('nerrors', this.nErrors);
        this.$emit('ncorrect', this.nCorrect);
        this.$emit('mapupdate', JSON.stringify(this.accuracyMap));
      });

      this.generateParagraph();
    },
    methods: {
      open(link) {
        this.$electron.shell.openExternal(link);
      },
      getRandInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * ((max - min) + 1)) + min;
      },
      generateParagraph() {
        this.current = '';
        this.typed = '';
        this.untyped = '';
        for (let i = 0; i < this.pLength; i += 1) {
          const wordLength = this.getRandInt(1, this.wMax);
          for (let j = 0; j < wordLength; j += 1) {
            const randChar = this.wCharset[this.getRandInt(0, this.wCharset.length - 1)];
            if (this.current.length <= 0) {
              this.current += randChar;
            } else {
              this.untyped += randChar;
            }
          }
          this.untyped += ' ';
        }
      },
      reset() {
        this.nErrors = 0;
        this.nCorrect = 0;
        this.error = false;
        this.wordsComplete = 0;
        for (let i = 0; i < this.wCharset.length; i += 1) {
          this.timesAppeared[this.wCharset[i]] = 0;
          this.correctMap[this.wCharset[i]] = 0;
        }
        this.correctMap[' '] = 0;
        this.timesAppeared[' '] = 0;
        this.accuracyMap = {};
        this.$emit('completewords', this.wordsComplete);
        this.$emit('nerrors', this.nErrors);
        this.$emit('ncorrect', this.nCorrect);
        this.$emit('mapupdate', JSON.stringify(this.accuracyMap));
        this.generateParagraph();
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

  .text-box {
    padding: 0px 20px 0px 20px;
    width: 70vw;
    border-radius: 10px;
    display: block;
    overflow: auto;
    white-space: pre-wrap;
  }

  .scrapetext {
    font-size: 2.5rem;
  }

  .pretext {
    opacity: .3;
    color: #4fc08d;
  }

  .curtext {
    border-radius: 5px;
    color: black;
    font-weight: bold;
  }

  .valid-cursor {
    color:white;
    animation: blinking .2s infinite;
    -webkit-animation: blinking 0.3s infinite backwards alternate;
  }

  .posttext {
    opacity: .3;
    color: black;
  }

  .char-failed {  
    color: white;
    background-color: lightpink;
  }

  @-webkit-keyframes blinking {
    0%   { background-color: rgba(79,192,141,1); }
    100% { background-color: rgba(79,192,141,.4); }
  }

  @keyframes blinking {
    0%   { background-color: rgba(79,192,141,1); }
    100% { background-color: rgba(79,192,141,.4); }
  }

</style>