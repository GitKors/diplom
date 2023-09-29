import { BrowserRouter as Router} from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import Main from "./components/Main.tsx";
import LoginPage from "./components/LoginPage.tsx"; 
import { AuthProvider } from '../src/contexts/AuthContext';
import SearchForm from './components/SearchForm.tsx';
import ResultsPage from './components/ResultsPage.tsx';
import { useContext } from 'react';
import { AuthContext } from '../src/contexts/AuthContext';


function App() {
  const { state } = useContext(AuthContext);

  if (!state) {
    return null; 
  }

  const { isAuthorized } = state;


  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Main />} />
          <Route path="/searchform" element={<SearchForm />} />
          <Route path="/resultpage" element={<ResultsPage />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
