import { useLanguage } from '../context/LanguageContext'

const updates = [
  {
    title: {
      en: 'India continues Antarctic operations through Maitri and Bharati',
      hi: 'भारत Maitri और Bharati से अंटार्कटिक अभियान जारी रखता है',
    },
    source: 'NCPOR',
    date: '2026',
    href: 'https://www.ncps.ncpor.res.in/expedition/index.php',
    summary: {
      en: 'NCPOR lists India’s Antarctic expedition programme and active station presence in Antarctica.',
      hi: 'NCPOR भारत के अंटार्कटिक अभियान और सक्रिय स्टेशन उपस्थिति की जानकारी देता है।',
    },
  },
  {
    title: {
      en: 'Indian polar data portal highlights Antarctica programme resources',
      hi: 'भारतीय पोलर डेटा पोर्टल अंटार्कटिक कार्यक्रम संसाधन दिखाता है',
    },
    source: 'NCPOR / NPDC',
    date: '2026',
    href: 'https://pdc.ncpor.res.in/npdc/antarctica_home.action',
    summary: {
      en: 'The NPDC Antarctica portal gives access to Indian Antarctic programme information and data resources.',
      hi: 'NPDC अंटार्कटिका पोर्टल भारतीय अंटार्कटिक कार्यक्रम और डेटा संसाधनों तक पहुंच देता है।',
    },
  },
  {
    title: {
      en: 'India’s Antarctic station history: Dakshin Gangotri to Maitri and Bharati',
      hi: 'भारत के अंटार्कटिक स्टेशनों का इतिहास: Dakshin Gangotri से Maitri और Bharati तक',
    },
    source: 'PIB',
    date: 'Reference',
    href: 'https://www.pib.gov.in/newsite/PrintRelease.aspx?lang=2&reg=48&relid=123510',
    summary: {
      en: 'PIB records the timeline of India’s Antarctic stations and expedition milestones.',
      hi: 'PIB भारत के अंटार्कटिक स्टेशनों और अभियानों की समयरेखा बताता है।',
    },
  },
]

export default function LatestNews() {
  const { language, t } = useLanguage()

  return (
    <section className="latest-news" aria-labelledby="latest-news-title">
      <div>
        <p className="eyebrow">{t('latestNews')}</p>
        <h2 id="latest-news-title">{t('latestNews')}</h2>
        <p>{t('latestNewsText')}</p>
      </div>
      <div className="news-grid">
        {updates.map((item) => (
          <article key={item.href} className="news-card">
            <span>{item.source} · {item.date}</span>
            <h3>{item.title[language]}</h3>
            <p>{item.summary[language]}</p>
            <a href={item.href} target="_blank" rel="noreferrer">{t('readUpdate')}</a>
          </article>
        ))}
      </div>
    </section>
  )
}
