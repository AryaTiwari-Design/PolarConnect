import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import StatusBadge from '../components/StatusBadge'
import { Loading } from '../components/States'
import { listResearch, uploadResearch } from '../services/research'
import { listStations } from '../modules/map/services/stations'
import { CATEGORIES, MAX_UPLOAD_MB } from '../utils/constants'
import { yearOptions } from '../utils/helpers'

const empty = { title: '', authors: '', year: String(new Date().getFullYear()), category: CATEGORIES[0], station: '', expedition: '', topic: '', abstract: '' }

export default function Upload() {
  const [form, setForm] = useState(empty)
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileRef = useRef(null)

  const stations = useFetch(listStations, [])
  const mine = useFetch(() => listResearch({ mine: 'true' }), [])
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const pickFile = (e) => {
    const f = e.target.files[0]
    setError('')
    if (!f) return setFile(null)
    if (f.type !== 'application/pdf') { setFile(null); return setError('Please choose a PDF file.') }
    if (f.size > MAX_UPLOAD_MB * 1024 * 1024) { setFile(null); return setError(`The file is larger than ${MAX_UPLOAD_MB} MB.`) }
    setFile(f)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!file) return setError('Choose a PDF to upload.')
    setBusy(true)
    setError('')
    setSuccess('')
    try {
      const body = new FormData()
      Object.entries(form).forEach(([k, v]) => body.append(k, v))
      body.append('file', file)
      await uploadResearch(body)
      setSuccess(`"${form.title}" was submitted and is waiting for admin review.`)
      setForm(empty)
      setFile(null)
      if (fileRef.current) fileRef.current.value = ''
      mine.reload()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container-page">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Upload a paper</h1>
      <p className="mt-1 text-navy-600">Submitted papers are reviewed by an admin before anyone else can see them.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <form onSubmit={submit} className="panel space-y-4 p-5 sm:p-6">
          <div>
            <label htmlFor="title" className="label">Title</label>
            <input id="title" className="input" required value={form.title} onChange={set('title')} />
          </div>
          <div>
            <label htmlFor="authors" className="label">Authors</label>
            <input id="authors" className="input" placeholder="For example: M. Nair, R. Iyer" value={form.authors} onChange={set('authors')} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="year" className="label">Year</label>
              <select id="year" className="input" value={form.year} onChange={set('year')}>
                {yearOptions().map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="category" className="label">Category</label>
              <select id="category" className="input" value={form.category} onChange={set('category')}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="station" className="label">Station</label>
              <select id="station" className="input" value={form.station} onChange={set('station')}>
                <option value="">None</option>
                {(stations.data?.items || []).map((s) => <option key={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="expedition" className="label">Expedition</label>
              <input id="expedition" className="input" placeholder="For example: 43rd ISEA" value={form.expedition} onChange={set('expedition')} />
            </div>
            <div>
              <label htmlFor="topic" className="label">Topic</label>
              <input id="topic" className="input" placeholder="For example: Sea ice" value={form.topic} onChange={set('topic')} />
            </div>
          </div>
          <div>
            <label htmlFor="abstract" className="label">Short summary</label>
            <textarea id="abstract" rows={4} className="input" value={form.abstract} onChange={set('abstract')} />
          </div>
          <div>
            <label htmlFor="file" className="label">PDF file (up to {MAX_UPLOAD_MB} MB)</label>
            <input id="file" ref={fileRef} type="file" accept="application/pdf" onChange={pickFile}
              className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-glacier-100 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-glacier-700 hover:file:bg-glacier-200" />
            {file && <p className="mt-1 text-xs text-navy-600">Selected: {file.name}</p>}
          </div>

          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">{error}</p>}
          {success && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800" role="status">{success}</p>}
          <button className="btn-primary" disabled={busy}>{busy ? 'Submitting…' : 'Submit for review'}</button>
        </form>

        <aside>
          <h2 className="text-lg font-bold">Your submissions</h2>
          {mine.loading && !mine.data ? <Loading /> : (mine.data?.items || []).length === 0 ? (
            <p className="mt-2 text-sm text-navy-600">Nothing submitted yet.</p>
          ) : (
            <ul className="panel mt-3 divide-y divide-glacier-100">
              {mine.data.items.map((p) => (
                <li key={p.id} className="space-y-1 px-4 py-3">
                  <Link to={`/research/${p.id}`} className="text-sm font-semibold hover:text-glacier-600">{p.title}</Link>
                  <div><StatusBadge status={p.status} /></div>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  )
}
