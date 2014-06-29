/**
 * Comment
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  attributes: {
		mapId : 'integer',
		stationId : 'integer',
		userId : 'integer',
		username : 'string',
		type : 'string',
		body : 'text',
		primary : 'string'
  }
};
