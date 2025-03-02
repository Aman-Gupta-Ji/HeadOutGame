import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import LandingPage from './pages/LandingPage';
import GamePage from './pages/GamePage';
import SharePage from './pages/SharePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/SignInPage';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Leaderboard from './pages/LeaderBoardPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        {/* ToastContainer with Headout theme */}
        <ToastContainer 
          position="top-center" 
          autoClose={3000}
          theme="colored"
          toastClassName="bg-headout-purple text-white"
        />
        
        <Header />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<LoginPage />} />
            <Route path='/leaderboard' element={<Leaderboard/>} />
            <Route path="/about" element={<AboutPage />} />
            
            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/play" element={<GamePage />} />
              <Route path="/share" element={<SharePage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            
            {/* 404 Route - must be at the end */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}