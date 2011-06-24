/******************************************************************************
*
* -- jsTouch   - is a small and clean utility to write nice applications
*                for touch devices (iPhone, iPad, iPod Touch, Android, etc.)
* -- License   - Dual licenses MIT and GPL
* -- Developer - vitmalina@gmail.com
*/

function jsTouch(name, params) {
	// -- variables
	this.name		= name;		// - unique name for the element
	this.width		= ''; 	    // - if empty - then full screen
	this.height		= ''; 	    // - if empty - then full screen
	
	// -- init function
	this.loadPage	= jsTouch_loadPage;
	this.animate	= jsTouch_animate;
	this.initScroll	= jsTouch_initScroll;
	this.resize		= jsTouch_resize;
	
	// -- internal variables
	this._tmpCallBack;
	this._tmpTimer;
	this._lastDiv;
		
	function jsTouch_loadPage(url, params, callBack) {
		// auto add clicked class
		if (window.event) if (window.event.target.tagName == 'A') { $(window.event.target).addClass('clicked'); };
		// -- save some temp variables
		this._tmpCallBack	= callBack;
		// -- get the page
		this._tmpTimer = window.setTimeout(function () {
			$('#'+this.name).append('<div class="progress">Loading...</div>');
		}, 1);
		$.get(url, params, new Function("data", 
			"$('#"+ this.name +" > .progress').remove(); "+
			"var _tmp_trans = 'slide-left'; "+
			"var obj = window.elements['"+ this.name +"']; "+ 
			"clearTimeout(obj._tmpTimer); "+
			"if (typeof(obj) == 'object') { "+
			"	obj.animate(data, '"+ ( typeof(params) == 'object' ? params['transition'] : "") +"'); "+
			"	if (typeof(window.elements["+ this.name +"]._tmpCallBack) == 'function') { "+
			"		window.elements["+ this.name +"]._tmpCallBack(); "+
			"	} "+
			"} ")
		);
	}
	
	function jsTouch_animate(HTML, transition) {
		var width  = this.width;
		var height = this.height;
		if (width == '')  width  = window.innerWidth;
		if (height == '') height = window.innerHeight;
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
		switch (transition) {
			case 'flip-right':
				// init divs
				div_old.style.cssText = 'position: absolute; width: '+ width +'px; height: '+ height +'px; overflow: hidden; -webkit-backface-visibility: hidden; -webkit-transform: rotateY(0deg);';
				div_new.style.cssText = 'position: absolute; width: '+ width +'px; height: '+ height +'px; overflow: hidden; -webkit-backface-visibility: hidden; -webkit-transform: rotateY(180deg);';
				div_new.innerHTML = HTML;
				// -- need a timing function because otherwise not working
				window.setTimeout(function() {
					div_old.style.cssText += '-webkit-transition: .5s; -webkit-transform: rotateY(-180deg);';
					div_new.style.cssText += '-webkit-transition: .5s; -webkit-transform: rotateY(0deg);';
				}, 1);
				break;
				
			case 'flip-left':
				// init divs
				div_old.style.cssText = 'position: absolute; width: '+ width +'px; height: '+ height +'px; overflow: hidden; -webkit-backface-visibility: hidden; -webkit-transform: rotateY(0deg);';
				div_new.style.cssText = 'position: absolute; width: '+ width +'px; height: '+ height +'px; overflow: hidden; -webkit-backface-visibility: hidden; -webkit-transform: rotateY(-180deg);';
				div_new.innerHTML = HTML;
				// -- need a timing function because otherwise not working
				window.setTimeout(function() {
					div_old.style.cssText += '-webkit-transition: .5s; -webkit-transform: rotateY(180deg);';
					div_new.style.cssText += '-webkit-transition: .5s; -webkit-transform: rotateY(0deg);';
				}, 1);
				break;
				
			case 'slide-right':
				// init divs
				div_old.style.cssText = 'position: absolute; width: '+ width +'px; height: '+ height +'px; overflow: hidden; -webkit-transform: translate3d(0px, 0, 0);';
				div_new.style.cssText = 'position: absolute; width: '+ width +'px; height: '+ height +'px; overflow: hidden; -webkit-transform: translate3d(-'+ width +'px, 0, 0);';
				div_new.innerHTML = HTML;
				// -- need a timing function because otherwise not working
				window.setTimeout(function() {
					div_old.style.cssText += '-webkit-transition: .5s; -webkit-transform: translate3d('+ width +'px, 0, 0);';
					div_new.style.cssText += '-webkit-transition: .5s; -webkit-transform: translate3d(0px, 0, 0);';
				}, 1);
				break;
				
			case 'slide-left':
				// init divs
				div_old.style.cssText = 'position: absolute; width: '+ width +'px; height: '+ height +'px; overflow: hidden; -webkit-transform: translate3d(0px, 0, 0);';
				div_new.style.cssText = 'position: absolute; width: '+ width +'px; height: '+ height +'px; overflow: hidden; -webkit-transform: translate3d('+ width +'px, 0, 0);';
				div_new.innerHTML = HTML;
				// -- need a timing function because otherwise not working
				window.setTimeout(function() {
					div_old.style.cssText += '-webkit-transition: .5s; -webkit-transform: translate3d(-'+ width +'px, 0, 0);';
					div_new.style.cssText += '-webkit-transition: .5s; -webkit-transform: translate3d(0px, 0, 0);';
				}, 1);
				break;
				
			default:
				div_old.style.cssText = 'position: absolute; z-index: 0; width: '+ width +'px;; height: '+ height +'px; overflow: hidden; -webkit-backface-visibility: hidden;';
				div_new.style.cssText = 'position: absolute; z-index: 1; width: '+ width +'px;; height: '+ height +'px; overflow: hidden; -webkit-backface-visibility: hidden;';
				div_new.innerHTML = HTML;
				break;
		}
		this.resize();
		this.initScroll();
	}
	
	function jsTouch_initScroll() {
		if (this._lastDiv) {
			var div = $('#'+ this.name +' > .jsTouch.div1 > .content')[0];
		} else {
			var div = $('#'+ this.name +' > .jsTouch.div2 > .content')[0];
		}
		var myScroll = new iScroll(div, { desktopCompatibility: true });
	}
	
	function jsTouch_resize() {
		var width  = this.width;
		var height = this.height;
		if (width == '')  width  = window.innerWidth;
		if (height == '') height = window.innerHeight;
		// -- apply width
		$('#'+ this.name +' div.toolbar').css('width', width+'px');
		$('#'+ this.name)[0].style.cssText += 'width: '+ width +'px; height: '+ height +'px;';
	}
	
	// -- register in elements array
    if (!window.elements) window.elements = [];
    if (window.elements[this.name]) alert('The element with this name "'+ this.name +'" is already registered.');
    window.elements[this.name] = this;
	
	// -- init all param variables
	if (params != null && typeof(params) == 'object' && String(params) == '[object Object]') { // javascript object
		for (var e in params) { this[e] = params[e]; }
	}		
	
	// -- append 2 divs into the box (needed for transition
	var div1 = document.createElement('DIV');
	var div2 = document.createElement('DIV');
	div1.className = 'jsTouch div1';
	div2.className = 'jsTouch div2';
	$('#'+this.name).append(div1);
	$('#'+this.name).append(div2);
	
	// -- resize events
	window.addEventListener('resize', new Function("window.elements['"+ this.name +"'].resize()"));
}