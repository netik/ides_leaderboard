class ExampleApplication extends React.Component {
  render() {
    const elapsed = Math.round(this.props.elapsed  / 100);
    const seconds = elapsed / 10 + (elapsed % 10 ? '' : '.0' );
    const message =
        `React has been successfully running for ${seconds} seconds.`;

    return <p>{message}</p>;
  }
}

export default ExampleApplication
