class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0
    }
  }

  handleClick(event) {
    this.setState({
      count: this.state.count + 1
    })
  }

  render() {
    return <button onClick={ (e) => this.handleClick(e) }>Clicked me {this.state.count} times!</button>
  }
}

export default Counter
