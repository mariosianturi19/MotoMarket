import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; // Import Layout baru
import Home from './pages/Home';
import DetailMotor from './pages/DetailMotor';
import Brands from './pages/Brands';
import Motorcycles from './pages/Motorcycles';
import Reviews from './pages/Reviews';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Bungkus Routes dengan Layout */}
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/motor/:id" element={<DetailMotor />} />
            <Route path="/manage/brands" element={<Brands />} />
            <Route path="/manage/motorcycles" element={<Motorcycles />} />
            <Route path="/manage/reviews" element={<Reviews />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;