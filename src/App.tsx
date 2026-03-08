import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DataflowPage from './pages/DataflowPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dataflow" element={<DataflowPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
