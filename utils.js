const applyFilter = require('loopback-filters'); // https://www.npmjs.com/package/loopback-filters
// ------------------------------------------------------------------------------------------------------------------- //
String.prototype.isEmpty = function(){ return !this.trim(); };
Array.prototype.isEmpty = function(){return this.length == 0};
function hasValidPropertie(obj, property){ return obj.hasOwnProperty(property) && !obj[property].isEmpty(); };
function filterProperties(obj, fields=[]){ return applyFilter([obj], { fields })[0]; };
/**
 * @param {Object} original - default response
 * @param {Object} querys - request query
 */
function applyFieldsFilter(original, querys){
	let changed = Object.assign({}, original);
	if(hasValidPropertie(querys, 'fields')){
		let fields = querys.fields.split(',');
		changed = filterProperties(original, fields);
	}	
	return changed;
}

/**
 * @param {String} str 
 * @return {Array}
 */
function split_csv(str){
	if(!str) return [];
	return str.trim().split(',').filter(e => e.trim());
}

/**
 * Concatenar arrays (valores) de um objeto.
 * @param {Object} obj 
 * @return {Array}
 */
function concatArrays(obj){
	let final = []
	for(let prop in obj)
		final = final.concat(obj[prop])
	return final;
}
// ------------------------------------------------------------------------------------------------------------------- //

module.exports = {
	applyFieldsFilter
	,split_csv
	,concatArrays
};