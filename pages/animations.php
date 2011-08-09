<div class="toolbar">
	<h1>Animations</h1>
	<a class="button back" onclick="jsTouch.loadPage('pages/home.php', { transition: 'slide-right' });"><span></span>Back</a>
</div>
<div class="content">
	<div style="padding: 0px 10px">
		All animations are done with CSS3 (or WebKit) which allows to utilize hardware acceleration.
	</div>
	<ul class="rounded">
		<li><a onclick="jsTouch.loadPage('pages/animations.php', { transition: 'slide-left' });">Slide Left</a></li>
		<li><a onclick="jsTouch.loadPage('pages/animations.php', { transition: 'slide-right' });">Slide Right</a></li>
		<li><a onclick="jsTouch.loadPage('pages/animations.php', { transition: 'slide-up' });">Slide Up</a></li>
		<li><a onclick="jsTouch.loadPage('pages/animations.php', { transition: 'slide-down' });">Slide Down</a></li>
	</ul>
	<ul class="rounded">
		<li><a onclick="jsTouch.loadPage('pages/animations.php', { transition: 'flip-left' });">Flip Left</a></li>
		<li><a onclick="jsTouch.loadPage('pages/animations.php', { transition: 'flip-right' });">Flip Right</a></li>
		<li><a onclick="jsTouch.loadPage('pages/animations.php', { transition: 'flip-top' });">Flip Top</a></li>
		<li><a onclick="jsTouch.loadPage('pages/animations.php', { transition: 'flip-bottom' });">Flip Bottom</a></li>
	</ul>
	<ul class="rounded">
		<li><a onclick="jsTouch.loadPage('pages/animations.php', { transition: 'pop-in' });">Pop In</a></li>
		<li><a onclick="jsTouch.loadPage('pages/animations.php', { transition: 'pop-out' });">Pop Out</a></li>
	</ul>
	<div style="clear: both; height: 45px"></div>
</div>
