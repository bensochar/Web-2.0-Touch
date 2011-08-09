<div class="toolbar">
	<h1>Lists</h1>
	<a class="button back" onclick="jsTouch.loadPage('pages/home.php', { transition: 'slide-right' });"><span></span>Back</a>
</div>
<div class="content">
	<div style="padding: 0px 10px">
		There are two kinds of lists: rounded and edgetoedge
	</div>
	<ul class="rounded">
		<li><a onclick="jsTouch.loadPage('pages/list-rounded.php', { transition: 'slide-left' });">Rounded</a></li>
		<li><a onclick="jsTouch.loadPage('pages/list-edgetoedge.php', { transition: 'slide-left' });">Edge to Edge</a></li>
		<li><a onclick="jsTouch.loadPage('pages/list-edgetoedge.php', { transition: 'flip-top', target: 'myTouch2' });">Right Panel</a></li>
	</ul>
	<div style="clear: both; height: 45px"></div>
</div>
