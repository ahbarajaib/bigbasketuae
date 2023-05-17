import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Completion(props) {
  const navigate = useNavigate()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigate(-2)
    }, 15000)

    return () => clearTimeout(timeoutId)
  }, [navigate])

  return <h1>Thank you! 🎉</h1>
}

export default Completion
