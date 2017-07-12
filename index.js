var soap = require('soap');
var express = require('express');
var bodyParser = require('body-parser');

var myService = {
    MyService: {
        MyPort: {
			GetLastTradePrice: function(args, cb, soapHeader) {console.log(args)
				if (soapHeader)
					return { price: soapHeader.SomeToken };
				if (args.tickerSymbol === 'trigger error') {
					throw new Error('triggered server error');
				} else if (args.tickerSymbol === 'Async') {
					return cb({ price: 19.56 });
				} else if (args.tickerSymbol === 'SOAP Fault v1.2') {
					throw {
						Fault: {
							Code: {
								Value: "soap:Sender",
								Subcode: { value: "rpc:BadArguments" }
							},
							Reason: { Text: "Processing Error" }
						}
					};
				} else if (args.tickerSymbol === 'SOAP Fault v1.1') {
				throw {
					Fault: {
						faultcode: "soap:Client.BadArguments",
						faultstring: "Error while processing arguments"
					}
				};
				} else {
					return { price: 19.56 };
				}
			},
			SetTradePrice: function(args, cb, soapHeader) {},

			IsValidPrice: function(args, cb, soapHeader, req) {
				lastReqAddress = req.connection.remoteAddress;

				var validationError = {
					Fault: {
						Code: {
							Value: "soap:Sender",
							Subcode: { value: "rpc:BadArguments" }
						},
						Reason: { Text: "Processing Error" },
						statusCode: 500
					}
				};

				var isValidPrice = function() {
					var price = args.price;console.log(args)
					if(isNaN(price) || (price === ' ')) {
						return cb(validationError);
					}

					price = parseInt(price, 10);
					var validPrice = (price > 0 && price < Math.pow(10, 5));
					return cb(null, { valid: validPrice });
				};

				setTimeout(isValidPrice, 10);
			},
			Test: function(args, cb, soapHeader){
				return cb(null, [1,2,3,4,5,6])
			}
        }
    }
};

  var xml = require('fs').readFileSync('myservice.wsdl', 'utf8');

/*  //http server example
  var server = http.createServer(function(request,response) {
      response.end('404: Not Found: ' + request.url);
  });

  server.listen(8000);
  soap.listen(server, '/wsdl', myService, xml);*/

  //express server example
  var app = express();
  //body parser middleware are supported (optional)
  app.use(bodyParser.raw({type: function(){return true;}, limit: '5mb'}));
  app.listen(8001, function(){
      //Note: /wsdl route will be handled by soap module
      //and all other routes & middleware will continue to work
      soap.listen(app, '/wsdl', myService, xml);
  });