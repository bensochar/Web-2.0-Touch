/******************************************************************************
*
* -- jsTouch   - is a small and clean utility to write nice applications
*                for touch devices (iPhone, iPad, iPod Touch, Android, etc.)
* -- License   - Dual licenses MIT and GPL
* -- Developer - vitmalina@gmail.com
*/

var jsTouch = {

	init: function(name, params) {
		var tmpTouch = new jsTouchBox(name, params);
		if (params && typeof(params) == 'object' && params['page']) tmpTouch.loadPage(params['page']);
		return tmpTouch;
	},
	
	loadPage: function(url, params, callBack) {
		if (window.event) {
			// find current touch box
			var currObj = this.getCurrentBox(window.event.target);
			// auto add clicked class (remove previous)
			if (window.event.currentTarget.tagName == 'A') { 
				$('#'+ currObj.name +' a').removeClass('clicked');
				$(window.event.currentTarget).addClass('clicked'); 
			};
		}
		// if target is defined - open there
		if (params && typeof(params) == 'object' && params['target']) {
			window.elements[params['target']].loadPage(url, params, callBack);
		} else {
			currObj.loadPage(url, params, callBack);
		}
	},
	
	resize: function() {
		for (el in window.elements) {
			window.elements[el].resize();
		}
	},
	
	getCurrentBox: function(el) {
		var currObj = null;
		var tmp 	= el;
		while (tmp.tagName != 'BODY') {
			if (tmp.tagName == 'DIV' && window.elements[tmp.id]) {
				currObj = window.elements[tmp.id];
				break;
			}
			tmp = tmp.parentNode;
		}
		return currObj;
	}
}

function jsTouchBox(name, params) {
	// -- variables
	this.name		= name;		// - unique name for the element
	this.width		= ''; 	    // - if empty - then full screen
	this.height		= ''; 	    // - if empty - then full screen	
	// -- init function
	this.loadPage	= jsTouch_loadPage;
	this.animate	= jsTouch_animate;
	this.initScroll	= jsTouch_initScroll;
	this.initTabs	= jsTouch_initTabs;
	this.resize		= jsTouch_resize;	
	// -- internal variables
	this._tmpCallBack;
	this._tmpTimer;
	this._lastDiv;
		
	function jsTouch_loadPage(url, params, callBack) {
		// -- save some temp variables		
		this._tmpCallBack	= callBack;
		// -- get the page
		this._tmpTimer = window.setTimeout(new Function("$('#"+ this.name +"').append('<div class=\"progress\">Loading...</div>')"), 200);		
		$.get(url, params, new Function("data", 
			"$('#"+ this.name +" > .progress').remove(); "+
			"var obj = window.elements['"+ ((typeof(params) == 'object' && params['target']) ? params['target'] : this.name) +"']; "+ 
			"if (obj && typeof(obj) == 'object') { "+
			"	clearTimeout(obj._tmpTimer); "+
			"	obj.animate(data, '"+ ((typeof(params) == 'object' && params['transition']) ? params['transition'] : "") +"'); "+
			"	obj.initTabs();"+
			"	if (obj._tmpCallBack && obj._tmpCallBack == 'function') { obj._tmpCallBack(); } "+
			"}")
		);
	}
	
	function jsTouch_animate(HTML, transition) {
		// get width and height of the div
		var width  = this.width;
		var height = this.height;
		if (width == '')  width  = window.innerWidth;
		if (height == '') height = window.innerHeight;
		if (parseInt(width) < 0)  width = window.innerWidth + width;
		if (parseInt(height) < 0) height = window.innerHeight + height;
		// find two divs
		if (this._lastDiv) {
			var div_old = $('#'+ this.name +' > .jsTouch.div1')[0];
			var div_new = $('#'+ this.name +' > .jsTouch.div2')[0];
			this._lastDiv = false;
		} else {
			var div_old = $('#'+ this.name +' > .jsTouch.div2')[0];
			var div_new = $('#'+ this.name +' > .jsTouch.div1')[0];
			this._lastDiv = true;
		}
		$('#'+this.name)[0].style.cssText += '-webkit-perspective: 700px; overflow: hidden;';
		
		var comcss = 'position: absolute; width: '+ width +'px; height: '+ height +'px; overflow: hidden;';
		div_old.style.cssText = 'z-index: 0; -webkit-backface-visibility: hidden;';
		div_new.style.cssText = 'z-index: 1; -webkit-backface-visibility: hidden;';
		
		switch (transition) {
			case 'slide-left':
				// init divs
				div_old.style.cssText += comcss +'-webkit-transform: translate3d(0, 0, 0);';
				div_new.style.cssText += comcss +'-webkit-transform: translate3d('+ width +'px, 0, 0);';
				div_new.innerHTML = HTML;
				// -- need a timing function because otherwise not working
				window.setTimeout(function() {
					div_old.style.cssText += '-webkit-transition: .5s; -webkit-transform: translate3d(-'+ width +'px, 0, 0);';
					div_new.style.cssText += '-webkit-transition: .5s; -webkit-transform: translate3d(0px, 0, 0);';
				}, 1);
				break;
				
			case 'slide-right':
				// init divs
				div_old.style.cssText += comcss +'-webkit-transform: translate3d(0, 0, 0);';
				div_new.style.cssText += comcss +'-webkit-transform: translate3d(-'+ width +'px, 0, 0);';
				div_new.innerHTML = HTML;
				// -- need a timing function because otherwise not working
				window.setTimeout(function() {
					div_old.style.cssText += '-webkit-transition: .5s; -webkit-transform: translate3d('+ width +'px, 0, 0);';
					div_new.style.cssText += '-webkit-transition: .5s; -webkit-transform: translate3d(0px, 0, 0);';
				}, 1);
				break;
							
			case 'slide-down':
				// init divs
				div_old.style.cssText += comcss +'z-index: 1; -webkit-transform: translate3d(0, 0, 0);';
				div_new.style.cssText += comcss +'z-index: 0; -webkit-transform: translate3d(0, 0, 0);';
				div_new.innerHTML = HTML;
				// -- need a timing function because otherwise not working
				window.setTimeout(function() {
					div_old.style.cssText += '-webkit-transition: .5s; -webkit-transform: translate3d(0, '+ height +'px, 0);';
					div_new.style.cssText += '-webkit-transition: .5s; -webkit-transform: translate3d(0, 0, 0);';
				}, 1);
				break;
			
			case 'slide-up':
				// init divs
				div_old.style.cssText += comcss +'-webkit-transform: translate3d(0, 0, 0);';
				div_new.style.cssText += comcss +'-webkit-transform: translate3d(0, '+ height +'px, 0);';
				div_new.innerHTML = HTML;
				// -- need a timing function because otherwise not working
				window.setTimeout(function() {
					div_old.style.cssText += '-webkit-transition: .5s; -webkit-transform: translate3d(0, 0, 0);';
					div_new.style.cssText += '-webkit-transition: .5s; -webkit-transform: translate3d(0, 0, 0);';
				}, 1);
				break;
				
			case 'flip-left':
				// init divs
				div_old.style.cssText += comcss +'-webkit-transform: rotateY(0deg);';
				div_new.style.cssText += comcss +'-webkit-transform: rotateY(-180deg);';
				div_new.innerHTML = HTML;
				// -- need a timing function because otherwise not working
				window.setTimeout(function() {
					div_old.style.cssText += '-webkit-transition: .5s; -webkit-transform: rotateY(180deg);';
					div_new.style.cssText += '-webkit-transition: .5s; -webkit-transform: rotateY(0deg);';
				}, 1);
				break;
				
			case 'flip-right':
				// init divs
				div_old.style.cssText += comcss +'-webkit-transform: rotateY(0deg);';
				div_new.style.cssText += comcss +'-webkit-transform: rotateY(180deg);';
				div_new.innerHTML = HTML;
				// -- need a timing function because otherwise not working
				window.setTimeout(function() {
					div_old.style.cssText += '-webkit-transition: .5s; -webkit-transform: rotateY(-180deg);';
					div_new.style.cssText += '-webkit-transition: .5s; -webkit-transform: rotateY(0deg);';
				}, 1);
				break;
				
			case 'flip-top':
				// init divs
				div_old.style.cssText += comcss +'-webkit-transform: rotateX(0deg);';
				div_new.style.cssText += comcss +'-webkit-transform: rotateX(180deg);';
				div_new.innerHTML = HTML;
				// -- need a timing function because otherwise not working
				window.setTimeout(function() {
					div_old.style.cssText += '-webkit-transition: .5s; -webkit-transform: rotateX(-180deg);';
					div_new.style.cssText += '-webkit-transition: .5s; -webkit-transform: rotateX(0deg);';
				}, 1);
				break;
				
			case 'flip-bottom':
				// init divs
				div_old.style.cssText += comcss +'-webkit-transform: rotateX(0deg);';
				div_new.style.cssText += comcss +'-webkit-transform: rotateX(-180deg);';
				div_new.innerHTML = HTML;
				// -- need a timing function because otherwise not working
				window.setTimeout(function() {
					div_old.style.cssText += '-webkit-transition: .5s; -webkit-transform: rotateX(180deg);';
					div_new.style.cssText += '-webkit-transition: .5s; -webkit-transform: rotateX(0deg);';
				}, 1);
				break;
				
			case 'pop-in':
				// init divs
				div_old.style.cssText += comcss +'-webkit-transform: translate3d(0, 0, 0);';
				div_new.style.cssText += comcss +'-webkit-transform: translate3d(0, 0, 0); -webkit-transform: scale(.8); opacity: 0;';
				div_new.innerHTML = HTML;
				// -- need a timing function because otherwise not working
				window.setTimeout(function() {
					div_old.style.cssText += '-webkit-transition: .5s;';
					div_new.style.cssText += '-webkit-transition: .5s; -webkit-transform: scale(1); opacity: 1;';
				}, 1);
				break;
				
			case 'pop-out':
				// init divs
				div_old.style.cssText += comcss +'-webkit-transform: translate3d(0, 0, 0); -webkit-transform: scale(1); opacity: 1;';
				div_new.style.cssText += comcss +'-webkit-transform: translate3d(0, 0, 0); opacity: 0;';
				div_new.innerHTML = HTML;
				// -- need a timing function because otherwise not working
				window.setTimeout(function() {
					div_old.style.cssText += '-webkit-transition: .5s; -webkit-transform: scale(1.7); opacity: 0;';
					div_new.style.cssText += '-webkit-transition: .5s; opacity: 1;';
				}, 1);
				break;
				
			default:
				div_new.innerHTML = HTML;
				break;
		}
		this.resize();
		this.initScroll();
	}
	
	function jsTouch_initScroll() {
		// make sure iScroll library is loaded
		if (String(window.iScroll) == 'undefined') {
			alert('You need to include iScroll.js library');
			return;
		}
		// make divs scrollable
		if (this._lastDiv) {
			var div = $('#'+ this.name +' > .jsTouch.div1 > .content')[0];
		} else {
			var div = $('#'+ this.name +' > .jsTouch.div2 > .content')[0];
		}
		// destroy previous scroll
		if (this.scroll) { this.scroll.destroy(); this.scroll = null; }
		// init scroll
		this.scroll = new iScroll(div, { desktopCompatibility: true });
	}
	
	function jsTouch_initTabs() {
		// if there are tabs - show/hide them, create onclick function
		$('#'+ this.name +' div.tabs a').each( function (i, el) {			
			var tmp = String(el.href).split('#');
			var id  = tmp[1];
			if ($(el).hasClass('clicked')) { $('#'+id).show(); } else {	$('#'+id).hide(); }
			$(el).click( function () {
				var currObj = jsTouch.getCurrentBox(window.event.currentTarget);
				$('#'+ currObj.name +' a').removeClass('clicked');
				$(window.event.currentTarget).addClass('clicked'); 
				// show/hide tabs
				$('#'+ currObj.name +' div.tabs a').each( function (i, el) {			
					var tmp = String(el.href).split('#');
					var id  = tmp[1];
					if ($(el).hasClass('clicked')) { $('#'+id).show(); } else {	$('#'+id).hide(); }
				});	
				// init scroll
				currObj.resize();
				currObj.initScroll();
			});
		});
	}
	
	function jsTouch_resize() {
		// get width and height of the div
		var width  = this.width;
		var height = this.height;
		if (width == '')  width  = window.innerWidth;
		if (height == '') height = window.innerHeight;
		if (parseInt(width) < 0)  width = window.innerWidth + width;
		if (parseInt(height) < 0) height = window.innerHeight + height;
		// -- apply width (toolbar and tabs)
		var isToolbar = ($('#'+ this.name +' div.toolbar').length > 0 ? true : false);
		var isTabs	  = ($('#'+ this.name +' div.tabs').length > 0 ? true : false);		
		$('#'+ this.name).css('width', width+'px');
		$('#'+ this.name +' div.div1').css('width', width+'px');
		$('#'+ this.name +' div.div2').css('width', width+'px');
		$('#'+ this.name).css('height', height+'px');
		$('#'+ this.name +' div.div1').css('height', height+'px');
		$('#'+ this.name +' div.div2').css('height', height+'px');		
		// -- toolbar and tabs
		$('#'+ this.name +' div.toolbar').css('width', width+'px');
		$('#'+ this.name +' div.tabs').css('width', width+'px');
		// -- set scroll to 0, 0 (in the browser it will hide url bar)
		window.scrollTo(0, 1);		
	}
	
	// -- register in elements array
    if (!window.elements) window.elements = [];
    if (window.elements[this.name]) alert('The element with this name "'+ this.name +'" is already registered.');
    window.elements[this.name] = this;
	
	// -- init all param variables
	if (params != null && typeof(params) == 'object' && String(params) == '[object Object]') { // javascript object
		for (var e in params) { this[e] = params[e]; }
	}		
	
	// -- append 2 divs into the box (needed for transitions)
	var div1 = document.createElement('DIV');
	var div2 = document.createElement('DIV');
	div1.className = 'jsTouch div1';
	div2.className = 'jsTouch div2';
	$('#'+this.name).append(div1);
	$('#'+this.name).append(div2);
	
	// -- resize events
	window.addEventListener('resize', new Function("window.elements['"+ this.name +"'].resize()"));
}