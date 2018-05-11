var React = require("react");
var ReactDOM = require("react-dom");
var ReactDOMServer = require('react-dom/server');


	module.exports = (data, onLogicProcessed) => {

	var rootElement =
	  React.createElement('div', {}, 
		React.createElement('h1', {}, "Contacts"),
		React.createElement('ul', {},
		  React.createElement('li', {},
			React.createElement('h2', {}, "James Nelson"),
			React.createElement('a', {href: 'mailto:james@jamesknelson.com'}, 'james@jamesknelson.com')
		  ),
		  React.createElement('li', {},
			React.createElement('h2', {}, "Joe Citizen"),
			React.createElement('a', {href: 'mailto:joe@example.com'}, 'joe@example.com')
		  )
		)
	  )

	data.html = ReactDOMServer.renderToStaticMarkup(rootElement);
	
	onLogicProcessed(data);
	
	return data;
}