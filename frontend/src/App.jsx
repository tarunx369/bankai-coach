import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProgressProvider } from './context/ProgressContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Lesson from './pages/Lesson';
import MockTest from './pages/MockTest';
import ResultAnalysis from './pages/ResultAnalysis';
import Progress from './pages/Progress';
import Revision from './pages/Revision';
import Flashcards from './pages/Flashcards';
import DoubtSolver from './pages/DoubtSolver';
import CurrentAffairs from './pages/CurrentAffairs';
import Search from './pages/Search';
import Notes from './pages/Notes';
import Settings from './pages/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProgressProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/lesson/:lessonId" element={<Lesson />} />
                <Route path="/test/:lessonId" element={<MockTest />} />
                <Route path="/result/:lessonId" element={<ResultAnalysis />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/revision" element={<Revision />} />
                <Route path="/flashcards" element={<Flashcards />} />
                <Route path="/doubt" element={<DoubtSolver />} />
                <Route path="/current-affairs" element={<CurrentAffairs />} />
                <Route path="/search" element={<Search />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
