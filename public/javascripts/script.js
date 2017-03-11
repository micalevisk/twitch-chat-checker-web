/**
 * (c) 2017 - Developed by Micael Levi (AKA KempzBR on http://www.twitch.tv)
 * v0.11-3
 */

String.prototype.isEmpty= function(){return !this.trim()};
Array.prototype.isEmpty = function(){return !this.length};

let BTN_SUBMIT, canais;
const SELECTORS_ID = {
	 divAlerttool:	"#alerttool"
	,divMainform:	"#mainform"
	,inputUsername:	"#username"
	,textAreaCanais:"#canais"
	,buttonSubmit:	"#btnsubmit"
};


window.addEventListener ("load", setup, false);
function setup(){
	BTN_SUBMIT = querySelector(SELECTORS_ID.buttonSubmit);
	canais = [];

	querySelector(SELECTORS_ID.buttonSubmit).onclick = checkUser;


	;(function initShortcuts(){
		shortcut.add("alt+1", function(){ querySelector(SELECTORS_ID.inputUsername).focus() });
		shortcut.add("alt+2", function(){ querySelector(SELECTORS_ID.textAreaCanais).focus()   });
		shortcut.add("alt+3", function(){ if(!BTN_SUBMIT.disabled) querySelector(SELECTORS_ID.buttonSubmit).click() });

	})();
}


function adjust_textarea(h){
	h.style.height = "20px";
	h.style.height = (h.scrollHeight)+"px";
}


/**
 * Cria um elemento com as informações formatadas.
 * @param {Boolean} online 
 * @param {String} canal
 * @param {String} usuario 
 * @param {Number} count
 */
function alertarSobreCanal(online, canal, usuario, count){
	if(arguments.length === 1){
		canal = online;
		inserirAlerta('warning', `o canal <strong>${canal}</strong> não existe!`);
		return;
	}

	let tagstatus = 'success';
	let status = 'online';
	if(!online){
		tagstatus = 'error';
		status = 'offline';
	}
	inserirAlerta(tagstatus, `#${usuario} está <i>${status}</i> no canal <strong>${canal}</strong> (${count})`);


	// ===================================================== //
	function inserirAlerta(tipo, mensagem, parent){
		parent = parent || querySelector(SELECTORS_ID.divMainform);

		let alertbar = querySelector(SELECTORS_ID.divAlerttool);
		if(!alertbar){
			alertbar = document.createElement("div");
			alertbar.id = SELECTORS_ID.divAlerttool.slice(1);
			parent.insertBefore(alertbar, parent.firstChild);
		}
		else alertbar = alertbar;

		let alertMessage = document.createElement("div");
		alertMessage.className = tipo;
		alertMessage.innerHTML = mensagem;

		alertbar.insertBefore(alertMessage, alertbar.firstChild);
	}
}


/**
 * MAIN function
 */
function checkUser(){
	let username = querySelector(SELECTORS_ID.inputUsername).value.trim().toLowerCase();
	canais = querySelector(SELECTORS_ID.textAreaCanais).value.trim().split('\n').filter(arrayFilterNotEmpty).map(arrayMapToLowerCase);

	if(!username.isEmpty() && !canais.isEmpty()){
		removerAlertas();
		canais = canais.filter(arrayFilterUnique);

		toogle_btn_submit();
		canais.forEach(function(canal, i){
			getJSON(`/${username}/on/${canal}`, finishedLoadJSON, function(err){
				alertarSobreCanal(canal);
				canais.shift();
				toogle_btn_submit();
			});
		});
	}

	// ===================================================== //
	function arrayFilterNotEmpty(value){ return value.trim() }
	function arrayMapToLowerCase(value){ return value.trim().toLowerCase() }
	function arrayFilterUnique(v,i,self){return self.indexOf(v) === i }

	function removerAlertas(){
		let alertbar = querySelector(SELECTORS_ID.divAlerttool);
		if(alertbar) alertbar.remove();
	}

	function toogle_btn_submit(){
		let disabled = BTN_SUBMIT.disabled;

		if(canais.isEmpty()){
			BTN_SUBMIT.disabled = false;
			BTN_SUBMIT.value = 'Verificar'
		}
		else{
			BTN_SUBMIT.disabled = true;
			BTN_SUBMIT.value = 'Verificando ...'
		}
	}

	function finishedLoadJSON(res) {
		alertarSobreCanal(res._extra.online, res._extra.to, username, res.data.chatter_count);
		canais.shift();
		toogle_btn_submit();
	}
}


// <-----------------------------------------------------------> //
/**
 * @param {String} path 
 * @param {function} cb_success	- fn(data)
 * @param {function} cb_error	- fn(err)
 */
function getJSON(path, cb_success, cb_error){
	if((cb_success && typeof cb_success !== 'function') || cb_error && typeof cb_error !== 'function')
		throw new TypeError('The callback(s) must be an function');

	let request = new XMLHttpRequest();
	request.open('GET', path, true);

	request.onload = function(){
		if((request.status >= 200) && (request.status < 400))
			cb_success(JSON.parse(request.responseText), null);
		else 
			cb_error(new Error('We reached our target server, but it returned an error.',request.status));
	};

	request.onerror = function() {
		cb_error(new Error('There was a connection error of some sort.',request));
	};

	request.send();
}

function querySelector(selector){
	return document.querySelector(selector);
}



/*********************************************************************/
//- (c) https://developers.google.com/youtube/iframe_api_reference
//- https://siteorigin.com/thread/can-i-mute-the-audio-of-a-youtube-video-when-configured-to-autoplay/
const YOUTUBE_VIDEO_ID = 'Wfrl_tyfaBk';
const tag = document.createElement('script');
const firstScriptTag = document.getElementsByTagName('script')[0];
let player, done = false;
tag.src = "https://www.youtube.com/iframe_api";
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
function onYouTubeIframeAPIReady() {

	player = new YT.Player('_youtubeplayer', {
		 height: '0'
		,width: '0'
		,videoId: YOUTUBE_VIDEO_ID
		,playerVars: { 'autoplay': 1, 'controls': 0, 'allowfulscreen': 0 }
		,events: {
			 'onReady': onPlayerReady
			,'onStateChange': onPlayerStateChange
		}
	});

	function onPlayerReady(event) {
		player.mute();
		event.target.mute();
		event.target.playVideo();
	}

	function onPlayerStateChange(event) {
		if(event.data == YT.PlayerState.PLAYING && !done){
			setTimeout(stopVideo, 1000*4);
			done = true;
		}

		function stopVideo(){
			player.stopVideo();
		}
	}

}
/*********************************************************************/
