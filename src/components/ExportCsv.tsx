import { usePacStore } from '../store/usePacStore'
import { Icon } from './Icon'
import { useState } from 'react'

export function ExportCsv() {
  const { result } = usePacStore()
  const [isExporting, setIsExporting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  async function download() {
    setIsExporting(true)
    
    // Generate enhanced CSV data
    const headers = [
      'Mese', 
      'Versato', 
      'Totale versato', 
      'Valore stimato netto', 
      'Guadagno netto',
      'Rendimento %',
      'Potere d\'acquisto',
      'Guadagno reale',
      'Rendimento reale %'
    ]
    
    const rows = result.points.map((p) => {
      const gain = p.estimatedValueNet - p.totalContributed
      const gainPercent = p.totalContributed > 0 ? (gain / p.totalContributed) * 100 : 0
      const inflationGain = p.estimatedValueInflationAdjusted - p.totalContributed
      const inflationGainPercent = p.totalContributed > 0 ? (inflationGain / p.totalContributed) * 100 : 0
      
      return [
        p.dateLabel, 
        p.contribution, 
        p.totalContributed, 
        p.estimatedValueNet,
        gain,
        gainPercent,
        p.estimatedValueInflationAdjusted,
        inflationGain,
        inflationGainPercent
      ]
    })
    
    const csv = [headers, ...rows]
      .map((r) => r.map((v, index) => {
        if (typeof v === 'string') return v
        // Per la percentuale (ultima colonna), mostra 2 decimali
        if (index === r.length - 1) return String(Math.round(v * 100) / 100)
        // Per gli altri numeri, arrotonda ai centesimi
        return String(Math.round(v * 100) / 100)
      }).join(';'))
      .join('\n')
    
    // Create and download file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pac-simulazione-completa.csv'
    a.click()
    URL.revokeObjectURL(url)
    
    // Show success state
    setIsExporting(false)
    setIsSuccess(true)
    setTimeout(() => setIsSuccess(false), 2000)
  }

  return (
    <button 
      type="button" 
      className="btn btn-primary"
      onClick={download}
      disabled={isExporting}
    >
      {isExporting ? (
        <>
          <Icon name="spinner" size="sm" />
          <span>Esportazione...</span>
        </>
      ) : isSuccess ? (
        <>
          <Icon name="check" size="sm" />
          <span>Esportato!</span>
        </>
      ) : (
        <>
          <Icon name="download" size="sm" />
          <span>Esporta CSV</span>
        </>
      )}
    </button>
  )
}