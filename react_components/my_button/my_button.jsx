var React = require("react");
var MyButton = React.createClass({
    
	getInitialState: function() {
		return {items: this.props.items, disabled: true}
	},

	// Once the component has been mounted, we can enable the button
	componentDidMount: function() {
		console.log('MOUNTED!!!');
		this.setState({disabled: false})
	},

	// Then we just update the state whenever its clicked by adding a new item to
	// the list - but you could imagine this being updated with the results of
	// AJAX calls, etc
	handleClick: function() {
		this.setState({
		  items: this.state.items.concat('Item ' + this.state.items.length)
		})
	},

	// For ease of illustration, we just use the React JS methods directly
	// (no JSX compilation needed)
	// Note that we allow the button to be disabled initially, and then enable it
	// when everything has loaded
	render: function() {
		return (
			<div id="my-button">
				<button onClick={this.handleClick} disabled={this.state.disabled}>Add Item</button>
				<ul>{this.state.items.map(function(item) {
					return <li>{item}</li>
				})}</ul>
			</div>
		)
	},
});

module.exports = MyButton;