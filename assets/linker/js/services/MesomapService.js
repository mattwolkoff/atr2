app.factory("Mesomap", function ($resource) {
   //var api = 'http://lor.availabs.org:1338/'
    return $resource(
        "http://localhost\\:1337/mesomap/:id",
        {id: "@id" },
        {
          //custom routes
          'update': { method:'PUT' }
        }
    );
});