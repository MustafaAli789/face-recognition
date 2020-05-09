import React from 'react';

class Rank extends React.Component{

	constructor(props){
		super(props)
		this.state={
			emoji: ''
		}
	}

	componentDidUpdate(prevProps, prevState){
		if (prevProps.entries === this.props.entries && prevProps.name === this.props.name)
			return null
		this.generateEmoji(this.props.entries)
	}

	generateEmoji = entries => {
		fetch(` https://61hcyi7cd8.execute-api.us-east-1.amazonaws.com/dev/rank?rank=${entries}`)
			.then(res=>res.json())
			.then(emoji => {
				this.setState({ emoji: emoji.input })
			})
			.catch(console.log)
		}
	
	componentDidMount(){
		this.generateEmoji(this.props.entries);
	}

	render(){
		return(
			<div>
				<div className='white f3'>
					{`${this.props.name}, your current entry count is...`}
				</div>
				<div className='white f1'>
					{this.props.entries}
				</div>
				<div className='white f3'>
					{`Rank Badge: ${this.state.emoji}`}
				</div>
			</div>		
		);
	}
}
export default Rank;