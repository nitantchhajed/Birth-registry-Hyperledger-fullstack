import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/main.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BirthCertificate from './pages/BirthCertificate';
import BirthCertificatePreview from './pages/BirthCertificatePreview';
function App() {
  return (
    // <BrowserRouter basename='/birth-certificate'>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<BirthCertificate />} />
        <Route path='/preview/:id' element={<BirthCertificatePreview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
