import Counter from './Counter'
import ExampleApplication from './Example'

var start = new Date().getTime();

setInterval(() => {
  ReactDOM.render(
      <ExampleApplication elapsed={new Date().getTime() - start} />,
    document.getElementById('container')
  );
}, 50);

ReactDOM.render(
    <Counter />,
  document.getElementById('clicker')
)
