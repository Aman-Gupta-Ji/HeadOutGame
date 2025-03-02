import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../frontend/src/routes/PrivateRoute';
import LandingPage from '../../frontend/src/pages/LandingPage';
import GamePage from '../../frontend/src/pages/GamePage';
import SharePage from '../../frontend/src/pages/SharePage';
import SignUpPage from '../../frontend/src/pages/SignUpPage';
import LoginPage from '../../frontend/src/pages/SignInPage';
import { AuthProvider } from '../../frontend/src/context/AuthContext';
import Header from '../../frontend/src/components/Header';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Leaderboard from '../../frontend/src/pages/LeaderBoardPage';
import AboutPage from '../../frontend/src/pages/AboutPage';
import ProfilePage from '../../frontend/src/pages/ProfilePage';
import NotFoundPage from '../../frontend/src/pages/NotFoundPage';

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