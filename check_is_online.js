const requestify= require('requestify')
const _			= require('./utils')

/**
 * @param {Array} arr
 * @param {String} value
 * @return {Boolean}
 */
function arrayContains(arr, value){
	for(i of arr)
		if(i === value) return true
	return false
}


/**
 * @param {Object} options
 * @param {function} callback
 * @return {Object}
 */
function loadJSON(options, callback){
	let url = options.protocol + '://' + options.host + options.path;
	requestify.request(url, options)
		.then((res) => {
			let body = res.getBody();
			if(body && callback && typeof callback === 'function')
				callback(null, body);
		})
		.fail((res) => {
			if(callback && typeof callback === 'function')
				callback(res, null);
		});
}

/**
 * @param {Object} obj 
 * @return {Array} - contendo as chaves na ordem inversa.
 */
function getReverseKeys(obj) {
	return Object.keys(obj).sort().reverse();
}


/**
 * @param {String} username
 * @param {String} channel
 * @param {function} callback
 */
function check_is_online(username, channel, callback){
	if(arguments.length < 2) throw new Error("Need the channel name and username to check.");

	let opts = {
		method: 'GET'
		,protocol: 'https'
		,host: 'tmi.twitch.tv'
		,path: `/group/user/${channel}/chatters`
		,headers: { 'Content-Type': 'application/json' }
	};

	let cb = (error, data) => {
		if(error || !data || typeof data === 'string' || !data.hasOwnProperty('chatters'))
			if(callback && typeof callback === 'function'){
				callback(null, error);
				return;
			}

		let obj_chatters = data.chatters;
		let chat = getReverseKeys(obj_chatters).find(key => {
			let arr = obj_chatters[key];
			return arrayContains(arr, username);
		});
		chat = (chat!==undefined ? chat.replace(/s$/,'') : '');

		let _extra = {
			 solicitated_at: new Date()
			,from:	username
			,to:	channel
			,online:Boolean(chat)
			,type:	chat
		};

		let arr_viewers  = obj_chatters.viewers;
		let responsedata = Object.assign({}, data);
		delete responsedata['_links'];
		responsedata = Object.assign({ _extra }, { data: responsedata });

		if(callback && typeof callback === 'function')
			callback(responsedata);
	}

	loadJSON(opts, cb);
}


/**
 * Wrapper to 'check_is_online'
 * @param {Object} settings
 * @param {function} callback
 */
function check(settings, callback){
	let { username, channel } = settings;
	check_is_online(username, channel, callback);
}


//////////////
module.exports = check;
//////////////