import { usePacStore } from '../store/usePacStore'

export function ExportCsv() {
  const { result } = usePacStore()

  function download() {
    const headers = ['Mese', 'Versato', 'Totale versato', 'Valore stimato netto']
    const rows = result.points.map((p) => [p.dateLabel, p.contribution, p.totalContributed, p.estimatedValueNet])
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => (typeof v === 'string' ? v : String(Math.round(v * 100) / 100))).join(';'))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pac-simulazione.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button type="button" className="btn btn-ghost" onClick={download}>Esporta CSV</button>
  )
}


