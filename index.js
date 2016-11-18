
function prettySrcoll(element, options) {
	var defaultOptions = {
		defaultBarWidth: 20,
		barWidth: 8,
		barColor: 'rgba(0, 0, 0, 0.4)',
		barOffsetRight: 2
	};
	var config = Object.prototype.toString.call(options) === '[object Object]' ?
							Object.assign(defaultOptions, options) : defaultOptions;
	var ele = document.querySelector(element); //target element
	var height = parseInt(getStyle(ele).height); //target's height
	var width = parseInt(getStyle(ele).width); //target's width
	var x= ele.getBoundingClientRect().left; //target's x
	var y = ele.getBoundingClientRect().top; //target's y
	var scrollHeight = ele.scrollHeight; //target's true height
	var defaultBgColor = getStyle(ele).backgroundColor;
	var bgcolor = /^rgb/.test(defaultBgColor) && defaultBgColor !== 'rgba(0, 0, 0, 0)' ? getStyle(ele).backgroundColor : '#fff';
	var barHeight = height*height/scrollHeight;
	var wrapperStyle = 'position: absolute;top: '+y+'px;left: '+(x+width-config.defaultBarWidth)
										+'px;width: '+config.defaultBarWidth+'px;height: '+height
										+'px;background-color: '+bgcolor;
	var barStyle = 'position: absolute;width: '+config.barWidth
							+'px;height: '+barHeight+'px;top: 0;right: '
							+'2px;background-color: '+config.barColor+';border-radius: '
							+config.barWidth+'px;transition: top 0.05s linear;';

	function getStyle(selector) {
		return selector.currentStyle ? selector.currentStyle : document.defaultView.getComputedStyle(selector, null);
	}

	function initScrollBar() {
		//var barWrapper = ele.cloneNode(false);
		var barWrapper = document.createElement('div'); // create wrapper
		var bar = document.createElement('div'); // create bar
		barWrapper.style = wrapperStyle;
		bar.style = barStyle;
		barWrapper.appendChild(bar);
		document.body.appendChild(barWrapper);
		initEventScroll(bar);
		initEventDrag(bar);
	}

	function initEventScroll(bar) {
		function ScrollHandler() {
			var intervalTargetHeight = scrollHeight - height;
			var intervalBarHeight = height - barHeight;
			var go = ele.scrollTop/intervalTargetHeight*intervalBarHeight;
			bar.style.top = go+'px';
		}
		ele.addEventListener('scroll', ScrollHandler);
	}

	function initEventDrag(bar) {
		function DragHandler(e) {
			var ev = e || event;
			var eY = ev.clientY;
			bar.addEventListener('mousemove', move);
			function move(e) {
				var ev = e || event;
				var dis = ev.clientY - eY;
				bar.style.top = parseInt(bar.style.top) + dis + 'px';
			}
			function removeEvent() {
				console.log('dddddd')
				bar.removeEventListener('mousedown', DragHandler)
				bar.removeEventListener('mousemove', move);
				bar.removeEventListener('mouseup', removeEvent);
			}
			bar.addEventListener('mouseup', removeEvent);
		}
		bar.addEventListener('mousedown', DragHandler);
	}

	initScrollBar(ele);

}

module.exports = prettySrcoll;