app.factory("User", function ($resource) {
   //var api = 'http://lor.availabs.org:1338/'
    return $resource(
        "http://lor.availabs.org\\:1337scenario/:id",
        {id: "@id" },
        {
            //custom route
            "templates": {'method': 'GET', 'params': {'where': {'name':null}}},
            'update': { method:'PUT' }
 
        }
    );
});
