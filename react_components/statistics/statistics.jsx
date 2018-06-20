var React = require("react");
import {Bar} from 'react-chartjs-2';
import {Line} from 'react-chartjs-2';

// child components

class Statistics extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};

	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	render() {

		switch(this.props.data.type) {
			
			case "barLine":
			
				return (
					<div>
						<Bar
							data={this.props.data.plugin.data}
							options={this.props.data.plugin.options}
							plugins={this.props.data.plugin.plugins}
						/>
					</div>
				)
		
				break;
				
			case "line":

				var charts;
				if(this.props.data.multiple) {
					charts = Object.keys(this.props.data.data).map((key, index) => {
						return (
							<div>
								<h2>Session Id: {key}</h2>
								<Line data={this.props.data.data[key]} />
							</div>
						);
					});
					
				} else {

					charts = (
						<div>
							<h2>Statistics</h2>
							<Line data={this.props.data.data} />
						</div>
					);
					
				}
				
				return charts;
		
				break;
				
			default:
			
				return (
					<div>No type passed!</div>
				)
		}
	}

}
module.exports = Statistics;
