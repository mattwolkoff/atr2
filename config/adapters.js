/**
 * Global adapter config
 * 
 * The `adapters` configuration object lets you create different global "saved settings"
 * that you can mix and match in your models.  The `default` option indicates which 
 * "saved setting" should be used if a model doesn't have an adapter specified.
 *
 * Keep in mind that options you define directly in your model definitions
 * will override these settings.
 *
 * For more information on adapter configuration, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.adapters = {

  // If you leave the adapter config unspecified 
  // in a model definition, 'default' will be used.
  'default': 'postgres',

  // Persistent adapter for DEVELOPMENT ONLY
  // (data is preserved when the server shuts down)
  disk: {
    module: 'sails-disk'
  },

  postgres:{
    module: 'sails-postgresql',
    host: 'lor.availabs.org',
    user: 'postgres',
    password: 'transit',
    database:'mesonet',
    port: 5432,
    pool: true
  },
    postgres_postgis:{
    module: 'sails-postgresql',
    host: 'lor.availabs.org',
    user: 'postgres',
    password: 'transit',
    database:'ny_parcels',
    port: 5432,
    pool: true
  }
};

