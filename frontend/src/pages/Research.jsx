import { useState } from 'react'
import { Link } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import { EmptyState, ErrorState, Loading } from '../components/States'
import ResearchCard from '../components/ResearchCard'
import { listResearch } from '../services/research'
import { CATEGORIES } from '../utils/constants'
import { useLanguage } from '../context/LanguageContext'

export default function Research() {
  const [category, setCategory] = useState('')
  const { t } = useLanguage()
  const { data, loading, error, reload } = useFetch(() => listResearch({ category }), [category])

  return (
    <div className="container-page">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">{t('researchLibraryTitle')}</h1>
          <p className="mt-1 text-navy-600">{t('researchLibraryIntro')}</p>
        </div>
        <Link to="/search" className="btn-secondary">{t('advancedSearch')}</Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {['', ...CATEGORIES].map((c) => (
          <button
            key={c || 'all'}
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
              category === c ? 'border-glacier-600 bg-glacier-600 text-white' : 'border-glacier-200 bg-white text-navy-800 hover:border-glacier-400'}`}
          >
            {c || t('allTopics')}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? <Loading label={t('loadingPapers')} /> : error ? <ErrorState message={error} onRetry={reload} /> : data.items.length === 0 ? (
          <EmptyState icon="📄" title={t('noTopicPapers')} text={t('noTopicPapersText')} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((p) => <ResearchCard key={p.id} paper={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
