import "./App.css";
import HealthCheck from "./components/HealthCheck";
import Home from "./components/Home";

function App() {
  return (
    <div className="App">
      <h1>CareerFlow</h1>
      <Home />
      <HealthCheck />
    </div>
  );
}

export default App;
