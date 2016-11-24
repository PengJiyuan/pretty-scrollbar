/*
 * Project: pretty-scrollbar
 * Author: PengJiyuan
 * Create: 2016/11/18
 * Update: 2016/11/23
 * 
 */

;(function(window) {

  function prettyScroll(element, options) {

    this.defaultOptions = {
      defaultWrapperWidth: 20,
      barWidth: 7,
      wrapperColor: null,
      barColor: 'rgba(0, 0, 0, 0.4)',
      right: 2,
      autoHide: true
    };

    this.config = Object.prototype.toString.call(options) === '[object Object]' ?
                Object.assign(this.defaultOptions, options) : this.defaultOptions;

    this.ele = document.querySelector(element); //target element

    this.hasCreated = false;

  }

  prettyScroll.prototype = {

    getStyle: function (selector) {
      return selector.currentStyle ? selector.currentStyle : document.defaultView.getComputedStyle(selector, null);
    },

    bind: function(target, eventType, handler) {
      if (window.addEventListener) {
        target.addEventListener(eventType, handler, false);
      } else if (target.attachEvent) {
        target.attachEvent('on' + eventType, handler);
      } else {
        target['on' + eventType] = handler;
      }
      return target;
    },

    unbind: function(target, eventType, handler) {
      if (window.removeEventListener) {
        target.removeEventListener(eventType, handler, false);
      } else if (window.detachEvent) {
        target.detachEvent(eventType, handler);
      } else {
        target['on' + eventType] = '';
      }
    },

    createProps: function() {

      this.height = parseInt(this.getStyle(this.ele).height); //target's height

      this.scrollHeight = this.ele.scrollHeight; //target's true height

      if(this.height < this.scrollHeight) {
        this.ele.style.boxSizing = 'border-box';
      }

      this.width = parseInt(this.getStyle(this.ele).width); //target's width

      this.x = this.ele.getBoundingClientRect().left + document.body.scrollLeft; //target's x

      this.y = this.ele.getBoundingClientRect().top + document.body.scrollTop; //target's y

      this.defaultBgColor = this.getStyle(this.ele).backgroundColor;

      if(this.config.wrapperColor) {
        this.bgcolor = this.config.wrapperColor;
      } else {
        this.bgcolor = /^rgb/.test(this.defaultBgColor) && this.defaultBgColor !== 'rgba(0, 0, 0, 0)' ? this.getStyle(this.ele).backgroundColor : '#fff';
      }
      
      this.barHeight = this.height*this.height/this.scrollHeight;
      
      this.wrapperStyle = 'position: absolute;top: '+this.y+'px;left: '+(this.x+this.width-this.config.defaultWrapperWidth)
                        +'px;width: '+this.config.defaultWrapperWidth+'px;height: '+this.height
                        +'px;background-color: '+this.bgcolor+';z-index:10';
      
      this.barStyle = 'position: absolute;z-index: 9;width: '+this.config.barWidth
                  +'px;height: '+this.barHeight+'px;top: 0;right: '+this.config.right
                  +'px;background-color: '+this.config.barColor+';border-radius: '
                  +this.config.barWidth+'px;'+(this.config.autoHide ? 'opacity: 0;transition: opacity 0.4s' : '');
    },

    initScrollBar: function() {
      this.initResize();
      this.initBar();
    },

    initResize: function() {
      this.createEvents();
      this.bind(window, 'resize', this.events.resize);
    },

    initBar: function() {
      this.createProps();
      if(this.height < this.scrollHeight) {
        this.hasCreated = true;
        this.bar = document.createElement('div'); // create bar
        this.bar.style = this.barStyle;
        this.barWrapper = document.createElement('div'); // create wrapper
        this.barWrapper.style = this.wrapperStyle;
        this.barWrapper.appendChild(this.bar);
        document.body.appendChild(this.barWrapper);

        this.initEventScroll();
      }
    },

    initEventScroll: function() {
      this.bind(this.ele, 'scroll', this.events.scroll);
      this.bind(this.bar, 'mousedown', this.events.down);
      if(this.config.autoHide) {
        this.initEnter();
      }
    },

    // mouseenter the target and show the scrollbar
    initEnter: function() {
      this.bind(this.ele, 'mouseenter', this.events.enter);
      this.bind(this.ele, 'mouseleave', this.events.leave);
      this.bind(this.barWrapper, 'mouseenter', this.events.enter);
      this.bind(this.barWrapper, 'mouseleave', this.events.leave);
    },

    removeEnter: function() {
      this.unbind(this.ele, 'mouseenter', this.events.enter);
      this.unbind(this.ele, 'mouseleave', this.events.leave);
      this.unbind(this.barWrapper, 'mouseenter', this.events.enter);
      this.unbind(this.barWrapper, 'mouseleave', this.events.leave);
    },

    removeScrollBar: function() {
      this.hasCreated = false;
      document.body.removeChild(this.barWrapper);
      this.unbind(this.ele, 'scroll', this.events.scroll);
      this.unbind(this.bar, 'mousedown', this.events.down);
      this.unbind(document, 'mouseup', this.events.up);
      this.unbind(document, 'mousemove', this.events.move);
      if(this.config.autoHide) {
        this.removeEnter();
      }
    },

    createEvents: function() {
      this.events = {
        resize: (function(_this) {
          return function(e) {
            if(!_this.hasCreated) {
              _this.initBar();
            } else {
              _this.createProps();
              if(_this.height < _this.scrollHeight) {
                _this.bar.style.height = _this.height*_this.height/_this.scrollHeight + 'px';
                _this.barWrapper.style.height = _this.height + 'px';
                _this.barWrapper.style.top = _this.y + 'px';
                _this.barWrapper.style.left = _this.x + _this.width - _this.config.defaultWrapperWidth + 'px';
              } else {
                _this.removeScrollBar();
              }
            }
          };
        })(this),
        scroll: (function(_this) {
          return function(e) {
            var intervalTargetHeight = _this.scrollHeight - _this.height;
            var intervalBarHeight = _this.height - _this.barHeight;
            var go = _this.ele.scrollTop/intervalTargetHeight*intervalBarHeight;
            _this.bar.style.top = go+'px';
            return false;
          };
        })(this),
        down: (function(_this) {
          return function(e) {
            _this.pY = e.pageY;
            _this.cacheTop = parseInt(_this.bar.style.top);
            _this.bind(document, 'mouseup', _this.events.up);
            _this.bind(document, 'mousemove', _this.events.move);
          };
        })(this),
        up: (function(_this) {
          return function(e) {
            _this.unbind(document, 'mousemove', _this.events.move);
            _this.unbind(document, 'mouseup', _this.events.up);
          };
        })(this),
        move: (function(_this) {
          return function(e) {
            var cap = e.pageY - _this.pY;
            if(parseInt(_this.bar.style.top) <= 0 && cap < 0) {
              _this.pY = e.pageY;
              _this.bar.style.top = 0;
              _this.cacheTop = 0;
              return;
            }
            if(parseInt(_this.bar.style.top) >= parseInt(_this.height - _this.barHeight) && cap > 0) {
              _this.bar.style.top = (_this.height - _this.barHeight) + 'px';
              _this.pY = e.pageY;
              _this.cacheTop = _this.height - _this.barHeight;
              return;
            }
            _this.bar.style.top = _this.cacheTop + cap + 'px';
            _this.ele.scrollTop = parseInt(_this.bar.style.top)/(_this.height - _this.barHeight)*(_this.scrollHeight-_this.height);
          };
        })(this),
        enter: (function(_this) {
          return function(e) {
            _this.bar.style.opacity = 1;
          };
        })(this),
        leave: (function(_this) {
          return function(e) {
            _this.bar.style.opacity = 0;
          };
        })(this)
      }
    }
  }

  window.PrettyScroll = function(element, options) {
    new prettyScroll(element, options).initScrollBar();
  }
})(window);
