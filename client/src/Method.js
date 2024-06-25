import { useState, useEffect } from 'react';

const Method = ({ children, currentMethod, thisMethod }) => {
  const [used, setUsed] = useState('init')

  useEffect(()=>{
    if (used === 'init') {
      if (currentMethod === thisMethod) {
        setUsed('once')
      }
    }
    if (used === 'once') {
      console.log('true')
      setUsed('done')
    }
  })

  const methodClasses = `method ${used !== 'done' ? 'fade-in' : ''}`

  return (
    <>
      {used !== 'init' &&
        <div className={`${methodClasses} ${currentMethod === thisMethod ? 'active' : ''}`}>
          {children}
        </div>
      }
    </>
  )
}

export default Method