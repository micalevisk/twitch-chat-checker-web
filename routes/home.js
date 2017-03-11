const express			= require('express');
const check_is_online	= require('../check_is_online');
const _					= require('../utils');

let router = express.Router();


/**
 * /
 * GET	- load home page
 */
router.get('/', (req, res) => {
	res.render('home/index', {
		title: 'Twitch Chat Checker'
	});
});


/**
 * /:username/is_online_on/:channel
 * GET	- verifica se o usuário de nick 'username' está online no canal 'channel'
 */
router.get('/:username/on/:channel', (req, res, next) => {
	const querys = req.query;
	const params = req.params;

	let username = params.username;
	let channel  = params.channel;

	check_is_online({username, channel}, (data, err) => {
		if(err || !data){
			res.status(500).send({ message: 'Erro ao solicitar.' });
			return;
		}
		
		let resdata = Object.assign({}, data);
		let response = Object.assign({}, resdata);
		response = _.applyFieldsFilter(response, querys);

		res.status(200).send(response);
	});

});


/**
 * >>>>>>>> TODO <<<<<<<<<<
 * /checkall/:username?channels=...
 * GET	- retorna um array contendo as informações '_extra' de cada (CSV)
 */
/*
router.get('/checkall/:username', (req, res, next) => {
	const params = req.params;
	const querys = req.query;

	let username = params.username;
	let arr_channels = _.split_csv(querys.channels);

	if(arr_channels.isEmpty()){
		res.status(400).send({ message: "Needs non-empty 'channels' string query." });
		return;
	}

	next();
});
*/





//////////////
module.exports = router;
//////////////