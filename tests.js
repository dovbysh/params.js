$(document).ready(function(){

  var cheapcadaversURL = "http://www.cheapcadavers.com/?rick=moranis&bumblebee=tuna&hash[some_key]=someValue";
    var stubLocation = {
    href:     cheapcadaversURL,
    search:   "?rick=moranis&bumblebee=tuna&hash[some_key]=someValue",
    protocol: "http:",
    host:     "www.cheapcadavers.com",
    pathname: "/"
  };

  test("Can be instantiated with an optional _location argument", function(){
    expect(2);
    ok(new Params(stubLocation), "We expect it not to error with a location.");
    ok(new Params(), "We expect it not to error without a location.");
  });

  var params = new Params(stubLocation);

  test("href() should return the private Params href", function(){
    expect(1);
    equals(params.href(), cheapcadaversURL);
  });

  module("Reading Params");

  test("Knows about existing params on init.", function(){
    expect(3);
    equals(params.get('rick'), 'moranis');
    equals(params.get('bumblebee'), 'tuna');
    equals(params.get('hash[some_key]'), 'someValue');
  });

  test("Returns undefined for undefined keys.", function(){
    expect(1);
    equals(params.get('sandwich'), undefined);
  });

  module("Setting Params");

  test("Can set() a key that's a string or number, and returns the value that's being set.", function(){
    expect(4);
    equals(params.set('porkchop', 'sandwiches'), 'sandwiches');
    equals(params.get('porkchop'), 'sandwiches');
    equals(params.set(341, 'baloney'), 'baloney');
    equals(params.get(341), 'baloney');
  });

  var paramsWithObject = new Params(stubLocation);
  test("Returns an object if it took one.", function(){
    expect(5);
    var blort = {
      smoo: 123,
      lamb: 'da',
      123:  'asdf'
    };
    equals(paramsWithObject.set(blort), blort);
    equals(paramsWithObject.get('smoo'), 123);
    equals(paramsWithObject.get('lamb'), 'da');
    equals(paramsWithObject.get(123), 'asdf');
    equals(paramsWithObject.get('123'), 'asdf');
  });

  test("Can set a single param pair, and get it back out.", function(){
    expect(2);
    var target = params.set('lazer', 'gunz');
    equals(params.get('lazer'), target);
    notEqual(params.get('lazer'), undefined);
  });

  module('Building search()');
  var building = new Params(stubLocation);

  test("search() should return just the params.", function(){
    expect(1);
    building.set('sky', 'blue');
    equals(building.search(), stubLocation.search + '&sky=blue');
  });

  module('Building href');

  test("href() should return an href with the updated params.", function(){
    expect(1);
    building.set('sky', 'blue');
    equals(building.href(), stubLocation.href + '&sky=blue');
  });

  module('Reducing URL Params');

  test("unset() should return value of key being removed.", function(){
    expect(1);
    equals(building.unset('sky'), 'blue');
  });

  test("href() should not include a key that has been removed.", function(){
    expect(4);
    equals(building.href(), stubLocation.href);

    building.unset('rick');
    equals(building.href(), "http://www.cheapcadavers.com/?bumblebee=tuna&hash[some_key]=someValue");

    building.unset('hash[some_key]');
    equals(building.href(), "http://www.cheapcadavers.com/?bumblebee=tuna");

    building.unset('bumblebee');
    equals(building.href(), "http://www.cheapcadavers.com/");
  });

  module('Errors!');
  test("Should throw an error with an unsupported data type.", function(){
    expect(2);
    raises(function(){
      building.set(function(){}, 'blort');
    });
    raises(function(){
      building.set(false, 'blort');
    });
  });

});