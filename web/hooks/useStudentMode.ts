'use client'

import { useState, useEffect, useCallback } from 'react'
import { browserStorage } from '@/shared/storage'

export const STUDENT_MODE_STORAGE_KEY = 'deeptutor.ui.studentMode'

export function useStudentMode() {
  const [studentMode, setStudentModeState] = useState<boolean>(true)

  useEffect(() => {
    const stored = browserStorage.readRaw('local', STUDENT_MODE_STORAGE_KEY)
    if (stored !== null) {
      setStudentModeState(stored === '1')
    } else {
      // Default enabled for Shenzhen Junior High student edition
      browserStorage.writeRaw('local', STUDENT_MODE_STORAGE_KEY, '1')
      setStudentModeState(true)
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STUDENT_MODE_STORAGE_KEY && e.newValue !== null) {
        setStudentModeState(e.newValue === '1')
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const setStudentMode = useCallback((enabled: boolean) => {
    setStudentModeState(enabled)
    browserStorage.writeRaw('local', STUDENT_MODE_STORAGE_KEY, enabled ? '1' : '0')
    window.dispatchEvent(new CustomEvent('deeptutor:studentModeChange', { detail: enabled }))
  }, [])

  const toggleStudentMode = useCallback(() => {
    setStudentMode(!studentMode)
  }, [studentMode, setStudentMode])

  useEffect(() => {
    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>
      setStudentModeState(customEvent.detail)
    }
    window.addEventListener('deeptutor:studentModeChange', handleCustomChange)
    return () => window.removeEventListener('deeptutor:studentModeChange', handleCustomChange)
  }, [])

  return { studentMode, setStudentMode, toggleStudentMode }
}
