import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './Navbar'
import { USE_MOCK } from '../services/api'

export default function Layout() {
  const { pathname } = useLocation()
  useEffect(() => {
  window.scrollTo(0, 0)
}, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      {USE_MOCK && (
        <div className="bg-ember-400 px-4 py-1.5 text-center text-xs font-semibold text-navy-900">
          Demo mode: you are seeing sample data. Set VITE_USE_MOCK=false to use the real backend.
        </div>
      )}
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      <footer className="border-t border-glacier-200 bg-white px-4 py-6 text-center text-xs text-navy-600">
        PolarConnect · Built for Smart India Hackathon (Problem Statement 26063) · Ministry of Earth Sciences · NCPOR
      </footer>
    </div>
  )
}
