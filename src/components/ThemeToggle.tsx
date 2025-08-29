import { useEffect, useState } from 'react'
import { Icon } from './Icon'

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(() => 
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const [isToggling, setIsToggling] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => setDark(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  function toggle() {
    setIsToggling(true)
    setTimeout(() => {
      setDark((d) => !d)
      document.documentElement.classList.toggle('dark')
      setIsToggling(false)
    }, 150)
  }

  return (
    <button 
      type="button" 
      className="btn btn-ghost"
      onClick={toggle}
      title={`Switch to ${dark ? 'light' : 'dark'} mode`}
      disabled={isToggling}
    >
      {isToggling ? (
        <Icon name="spinner" size="sm" />
      ) : (
        <>
          <Icon name={dark ? 'moon' : 'sun'} size="sm" />
          <span className="hidden sm:inline">{dark ? 'Dark' : 'Light'}</span>
        </>
      )}
    </button>
  )
}