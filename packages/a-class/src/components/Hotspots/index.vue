<template>
  <div ref="hotspots" class="hotspots" :id="id">
    <div
      v-for="(item, index) in this.states"
      :key="item.id"
      :id="'hotspot-' + index"
      @click="onSelectHotspot(item)"
      class="hotspot"
      v-bind:class="{
        active: item.visible == true ? true : false,
        disabled: !enabled,
        viewed: item.viewed == true ? true : false,
      }"
      v-bind:style="{
        left: item.position.x + 'px',
        top: item.position.y + 'px',
      }"
    >
      <div
        class="contain-popup contain-popup-show"
        v-bind:class="{
          show: currentHotspot?.id === item.id,
          hide: currentHotspot?.id !== item.id,
        }"
        v-click-outside="onClickOutside"
      >
        <div class="inside-contain-popup">
          <div class="arrow-right">
            <div class="contain-close-hotspot">
              <span
                @click="closeHotspot(item)"
                v-if="currentHotspot?.id === item.id"
              >
                &times;
              </span>
            </div>
            <div class="hotspot-title-line">
              {{ currentHotspot?.headline }}
            </div>

            <div class="hotspot-description">
              {{ currentHotspot?.description }}
            </div>
            <div class="contain-read-more">
              <div class="hotspot-read-more">
                {{ $appData.eqs["discover-more"] }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="contain-popup" v-if="currentHotspot?.id !== item.id">
        <div class="inside-contain-popup">
          <div class="arrow-right">
            <div class="hotspot-title hotspot-headline">
              {{ item.title }}
            </div>
          </div>
        </div>
      </div>
      <div
        class="circle"
        :key="item.id"
        :id="'hotspot-circle-' + item.id"
      ></div>
    </div>
  </div>
</template>

<script>
import clickOutside from "@/directives/clickOutside";
export default {
  name: "ukscc-hotspots",
  directives: {
    "click-outside": clickOutside,
  },
  props: {
    id: {
      type: String,
      default: "hotspot-view",
    },
    hotspotsData: {
      type: Array,
    },
  },
  data() {
    return {
      showing: true,
      frame: 0,
      states: {},
      data: {},
      enabled: true,
      currentHotspot: {
        id: 0,
        title: "",
        description: "",
        headline: "",
      },
      closedHotspot: null,
    };
  },
  methods: {
    onClickOutside(event) {
      const classSelected = event.target.className;
      const acceptedClasses = [
        "circle",
        "arrow-right",
        "hotspot-title hotspot-headline",
        "inside-contain-popup",
        "hotspot-title",
        "hotspot-title-line",
        "hotspot-description",
        "contain-read-more",
        "hotspot-read-more",
      ];

      if (acceptedClasses.includes(classSelected) && this.currentHotspot.id > 0)
        return false;

      if (this.currentHotspot.id > 0) this.currentHotspot = {};
    },

    setFrame(frame) {
      this.frame = frame;
    },

    setEnabled(bln) {
      this.enabled = bln;
    },

    onFrameChanged(frame) {
      this.currentHotspot = {}; // Hide popup detail

      this.frame = frame;
      var scale = this.$refs["hotspots"].clientWidth / 1920;
      var windowWidth = window.innerWidth;
      var items = this.data;
      this.states = Object.assign({}, this.states, {});
      for (const hotspot in this.data) {
        // eslint-disable-next-line no-prototype-builtins
        if (this.hotspotsData.hasOwnProperty(hotspot)) {
          const element = this.data[hotspot];
          var f = frame - element.startFrame;
          var data = element.positions[0][f];
          if (data) {
            // To make hotspots responsive by the windowWidth
            let scaleLength = 140;

            if (windowWidth <= 800) {
              scaleLength = 140;
            }

            if (windowWidth > 800 && windowWidth <= 1024) {
              scaleLength = 100;
            }

            if (windowWidth > 1024) {
              scaleLength = 50;
            }

            this.states[element.id].visible = this.showing ? true : false;
            this.states[element.id].direction = element.direction;
            this.states[element.id].position = {
              x: data.x * scale - scaleLength * scale,
              y: data.y * scale - scaleLength * scale,
            };
          } else {
            this.states[element.id].visible = false;
          }
        }
      }
      return;
    },
    show() {
      this.showing = true;
      this.onFrameChanged(this.frame);
    },

    hide() {
      this.showing = false;
      for (const id in this.states) {
        this.states[id].visible = false;
      }
      this.states = Object.assign({}, this.states, {});
    },

    onSelectHotspot(hotspot) {
      const result = this.data.find(({ id }) => id === hotspot.id);
      if (this.closedHotspot) {
        this.currentHotspot = {};
        this.closedHotspot = null;
      } else {
        this.currentHotspot = result;
      }
    },

    closeHotspot(item) {
      this.closedHotspot = item.id;
    },

    hideAllHotspotDetail() {
      this.currentHotspot = {};
    },

    resetHotspotsClicked() {
      for (const id in this.states) {
        this.states[id].viewed = false;
      }
      this.states = Object.assign({}, this.states, {});
    },

    loadHotspots(data, viewedHotspotIDs) {
      this.data = data;
      this.states = {};
      var items = this.data;

      this.data = data;
      items.forEach((element) => {
        this.states[element.id] = {
          id: element.id,
          visible: false,
          viewed: viewedHotspotIDs.includes(element.id) ? true : false,
          icon: element.icon,
          title: element.title,
          position: { x: 330, y: 0 },
        };
      });
      this.onFrameChanged(1);
    },
  },

  mounted() {
    this.loadHotspots(this.hotspotsData, []);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.contain-popup {
  color: black;
  background: rgba(255, 255, 255, 0.8117647059);
  position: absolute;
  right: 100%;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 380px;
  cursor: initial;
  left: -35vh;
}

.inside-contain-popup {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  min-height: 50px;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.arrow-right:after {
  content: " ";
  position: absolute;
  right: -15px;
  top: 50%;
  border-top: 15px solid transparent;
  border-right: none;
  border-left: 15px solid rgba(255, 255, 255, 0.8117647059);
  border-bottom: 15px solid transparent;
  transform: translate(0%, -50%);

  @media screen and (max-width: 912px) {
    right: -14px;
    top: 50%;
    border-top: 8px solid transparent;
    border-right: none;
    border-left: 14px solid rgba(255, 255, 255, 0.8117647059);
    border-bottom: 8px solid transparent;
    transform: translate(0%, -50%);
  }
}

.contain-popup-show.show {
  animation: showing 0.8s linear;
}

.contain-popup-show.hide {
  animation: hiding 1s forwards;
}

@keyframes showing {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
    display: block;
  }
}

@keyframes hiding {
  0% {
    opacity: 1;
    scale: 1;
  }

  100% {
    opacity: 0;
    scale: 0;
    display: none;
  }
}

.contain-close-hotspot {
  width: 100%;
  text-align: right;
  margin-bottom: 10px;
  position: relative;
}

.contain-close-hotspot span {
  cursor: pointer;
  font-size: 27px;
  position: absolute;
  padding: 0px 10px;
  right: -15px;
  z-index: 20;
  top: -15px;
  @media screen and (max-width: 992px) {
    right: -10px;
    top: -10px;
  }
}

.hotspot-title,
.hotspot-title-line {
  font-size: 17px;
}

.hotspot-description {
  margin: 15px 0px;
  font-size: 14px;
  line-height: 25px;
}

.contain-read-more {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .hotspot-read-more {
    border: 1px solid;
    padding: 10px 20px;
    font-size: 14px;
    cursor: pointer;
    background: white;
    width: fit-content;
    margin-bottom: 11px;
  }
}

.hotspots {
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 100%;
  background: transparent;
  top: 0px;
  pointer-events: none;
  color: #ffffff;
  .hotspot {
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
    &.active {
      opacity: 1;
      pointer-events: all;
      cursor: pointer;
    }

    &.disabled,
    .disabled & {
      pointer-events: none;
    }

    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGgAAABoCAYAAAAdHLWhAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDA2IDc5LjE2NDY0OCwgMjAyMS8wMS8xMi0xNTo1MjoyOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjIgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkExMDFFRkRBMDNEMTFFQkFFMkRDMUFCNzFBNDM0OTEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkExMDFFRkVBMDNEMTFFQkFFMkRDMUFCNzFBNDM0OTEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCQTEwMUVGQkEwM0QxMUVCQUUyREMxQUI3MUE0MzQ5MSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCQTEwMUVGQ0EwM0QxMUVCQUUyREMxQUI3MUE0MzQ5MSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgcbjG8AAAaaSURBVHja7F1r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');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 50px 50px;

    .circle {
      position: absolute;
      display: block;
      top: 0;
      left: 0;
      transition: opacity 0.2s;
      opacity: 0;
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }

    .title {
      display: flex;
      margin-left: 80px;
      text-align: left;
      margin-top: 8px;
      h5 {
        font-family: daimler_csregular;
        font-size: 16px;
        width: max-content;
      }
      &.leftAlign {
        margin-left: 20px;
        transform: scaleX(-1);
        transform-origin: left;
        h5 {
          transform: scaleX(-1);
        }
      }
    }

    @media screen and (max-width: 912px) {
      background-size: 30px 30px;
      .title {
        margin-left: 70px;
        h5 {
          font-size: 12px;
        }
        &.leftAlign {
          margin-left: 30px;
        }
      }
    }
  }

  @media screen and (width: 720px) and (height: 540px) {
    div#hotspot-4 {
      .contain-popup {
        right: -57vh !important;
        left: 85%;
        max-width: 248px;
      }
    }
    div#hotspot-2 .contain-popup,
    div#hotspot-5 .contain-popup,
    div#hotspot-7 .contain-popup,
    div#hotspot-9 .contain-popup {
      left: -40vh !important;
      right: 80%;
      max-width: 248px;
    }
  }

  @media screen and (max-width: 992px) {
    .contain-popup {
      left: -57vh;
      right: 85%;
      max-width: 248px;
    }

    .inside-contain-popup {
      padding: 10px 20px 10px;
    }

    .contain-close-hotspot {
      margin-bottom: 0px;
    }

    .contain-close-hotspot span {
      font-size: 21px;
      padding: 0px;
    }

    .hotspot-title {
      font-size: 12px;
    }

    .hotspot-title-line {
      font-size: 12px;
      padding-top: 10px;
    }

    .hotspot-description {
      font-size: 11px;
      line-height: 19px;
    }

    .hotspot-read-more {
      font-size: 11px;
    }

    div#hotspot-4 {
      .contain-popup {
        right: -57vh;
        left: 85%;
        max-width: 248px;
      }

      .arrow-right:after {
        left: -15px;
        right: 100%;
        border-top: 8px solid transparent;
        border-left: none;
        border-right: 14px solid rgba(255, 255, 255, 0.8117647059);
        border-bottom: 8px solid transparent;
        transform: translate(0%, -50%);
      }
    }
  }

  @media screen and (max-width: 580px) and (max-height: 380px) {
    div#hotspot-5 {
      .contain-popup {
        right: -57vh;
        left: 85%;
        max-width: 248px;
      }

      .arrow-right:after {
        left: -15px;
        right: 100%;
        border-top: 8px solid transparent;
        border-left: none;
        border-right: 14px solid rgba(255, 255, 255, 0.8117647059);
        border-bottom: 8px solid transparent;
        transform: translate(0%, -50%);
      }

      .contain-popup.show {
        bottom: 20px;

        .arrow-right:after {
          top: 88%;
        }
      }
    }
  }

  @media screen and (max-width: 780px) and (max-height: 380px) {
    div#hotspot-4 {
      .contain-popup.show {
        bottom: 0px;

        .arrow-right:after {
          top: 76%;
        }
      }
    }
  }
}
</style>
