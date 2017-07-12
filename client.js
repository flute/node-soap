var soap = require('soap');
var url = 'http://localhost:8001/wsdl?wsdl';
//var url = './myservice.wsdl';
//var args = {name: 'value'};
var args = {price: 28};
soap.createClient(url, function(err, client) {
	client.Test(args, function(err, result) {
		console.log(result);
	});
});