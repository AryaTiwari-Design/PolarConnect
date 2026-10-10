import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { ROLES } from './utils/constants'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Research from './pages/Research'
import ResearchDetail from './pages/ResearchDetail'
import Search from './pages/Search'
import Chat from './pages/Chat'
import Admin from './pages/Admin'
import Upload from './pages/Upload'
import NotFound from './pages/NotFound'

import StationsMap from './modules/map/components/StationsMap'
import Academy from './modules/education/components/Academy'
import LessonPage from './modules/education/components/LessonPage'

const guard = (el, roles) => <ProtectedRoute roles={roles}>{el}</ProtectedRoute>

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={guard(<Dashboard />)} />
        <Route path="/research" element={guard(<Research />)} />
        <Route path="/research/upload" element={guard(<Upload />, [ROLES.RESEARCHER, ROLES.ADMIN])} />
        <Route path="/research/:id" element={guard(<ResearchDetail />)} />
        <Route path="/search" element={guard(<Search />)} />
        <Route path="/chat" element={guard(<Chat />)} />
        <Route path="/map" element={guard(<StationsMap />)} />
        <Route path="/academy" element={guard(<Academy />)} />
        <Route path="/academy/:id" element={guard(<LessonPage />)} />
        <Route path="/admin" element={guard(<Admin />, [ROLES.ADMIN])} />

        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
