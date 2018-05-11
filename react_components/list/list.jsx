var React = require("react");
class List extends React.Component {

	constructor(props) {
		super(props);
		this.state = {date: new Date()};
	}
	
	componentDidMount() {console.log("!!!");
		this.timerID = setInterval(
			() => this.tick(),
			1000
		);
	}

	componentWillUnmount() {
		clearInterval(this.timerID);
	}

	tick() {
		console.log(1);
		this.setState({
			date: new Date()
		});
	}
  
	render() {
		return (
			<div id="tickable">
				<h1>List of objects here!</h1>
				{
					this.props.data.objects.map((object_name) => {
						return <h2>{object_name}</h2>
					})
				}
				<div>
						<h1>Hello, world!!!</h1>
						<h2>It is {this.state.date.toLocaleTimeString()}.</h2>
				</div>
			</div>
		)
	}
	
}

module.exports = List;