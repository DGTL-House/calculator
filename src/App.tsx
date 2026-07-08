import { useEffect, useRef, useState } from 'react'
import { Footer } from './components/Footer'
import { LoadingStep } from './components/LoadingStep'
import { NicheStep } from './components/NicheStep'
import { ResultsStep } from './components/ResultsStep'
import { NICHES } from './model/data'
import type { Payment, Period, Step, TariffKey } from './model/types'

export default function App() {
  const [step, setStep] = useState<Step>('niche')
  const [niche, setNiche] = useState<number | null>(null)
  const [tariff, setTariff] = useState<TariffKey>('growth')
  const [payment, setPayment] = useState<Payment>('monthly')
  const [period, setPeriod] = useState<Period>('total')
  const [loadIdx, setLoadIdx] = useState(0)

  const timers = useRef<{ interval?: ReturnType<typeof setInterval>; timeout?: ReturnType<typeof setTimeout> }>({})

  useEffect(() => {
    const t = timers.current
    return () => {
      clearInterval(t.interval)
      clearTimeout(t.timeout)
    }
  }, [])

  const startLoading = () => {
    if (niche == null) return
    clearInterval(timers.current.interval)
    clearTimeout(timers.current.timeout)
    setStep('loading')
    setLoadIdx(0)
    timers.current.interval = setInterval(() => {
      setLoadIdx((idx) => {
        const next = idx + 1
        if (next >= 3) clearInterval(timers.current.interval)
        return Math.min(next, 3)
      })
    }, 750)
    timers.current.timeout = setTimeout(() => setStep('results'), 3200)
  }

  return (
    <div style={{ background: 'var(--cream-50)', minHeight: '100vh' }}>
      {step === 'niche' && <NicheStep niche={niche} onSelectNiche={setNiche} onContinue={startLoading} />}
      {step === 'loading' && (
        <LoadingStep nicheName={niche != null ? NICHES[niche].title : 'your cause'} loadIdx={loadIdx} />
      )}
      {step === 'results' && niche != null && (
        <ResultsStep
          niche={niche}
          tariff={tariff}
          onTariff={setTariff}
          payment={payment}
          onPayment={setPayment}
          period={period}
          onPeriod={setPeriod}
        />
      )}
      <Footer />
    </div>
  )
}
