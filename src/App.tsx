import DataProvider from "./contexts/DataProvider";
import Home from "./pages/Home";

function App() {
  return (
    <DataProvider>
      <Home />
    </DataProvider>
  );
}

export default App;
