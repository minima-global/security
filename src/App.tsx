import "./App.css";
import Dashboard from "./pages/Dashboard";
import AppProvider from "./AppContext";

function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}

export default App;
