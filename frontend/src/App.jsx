import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import SpaceBg from './components/SpaceBg';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import QuizList from './pages/QuizList';
import QuizDetail from './pages/QuizDetail';
import QuizTaking from './pages/QuizTaking';
import ResultDetail from './pages/ResultDetail';
import ResultPage from './pages/ResultPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function Guard({ children }) {
  const { isAuth, init } = useAuth();
  if (init) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}><div className="spin" style={{ width:36, height:36, border:'2px solid #6366f1', borderTopColor:'transparent', borderRadius:'50%' }} /></div>;
  return isAuth ? children : <Navigate to="/login" replace />;
}
function Layout({ children, noFooter, noSpace }) {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', position:'relative' }}>
      {!noSpace && <SpaceBg />}
      <Navbar />
      <main style={{ flex:1, position:'relative', zIndex:1 }}>{children}</main>
      {!noFooter && <Footer />}
    </div>
  );
}
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/quizzes" element={<Layout><QuizList /></Layout>} />
      <Route path="/quizzes/:id" element={<Layout><QuizDetail /></Layout>} />
      <Route path="/quiz/:id/play" element={<Guard><Layout noFooter noSpace><QuizTaking /></Layout></Guard>} />
      <Route path="/results" element={<Guard><Layout><ResultPage /></Layout></Guard>} />
      <Route path="/results/:id" element={<Guard><Layout><ResultDetail /></Layout></Guard>} />
      <Route path="/profile" element={<Guard><Layout><Profile /></Layout></Guard>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      <Route path="/login" element={<Layout noFooter><Login /></Layout>} />
      <Route path="/register" element={<Layout noFooter><Register /></Layout>} />
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  );
}
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: { background:'#fff', color:'#1a1a2e', border:'1px solid rgba(99,102,241,0.2)', borderRadius:'14px', fontFamily:'Inter,sans-serif', fontSize:'14px', boxShadow:'0 8px 32px rgba(99,102,241,0.15)' },
          success: { iconTheme: { primary:'#10b981', secondary:'#fff' } },
          error: { iconTheme: { primary:'#ef4444', secondary:'#fff' } },
        }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
