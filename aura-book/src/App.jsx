import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import BookingPage from './pages/BookingPage';
import AppointmentsPage from './pages/AppointmentsPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<BookingPage />} />
          <Route path="/my-appointments" element={<AppointmentsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;