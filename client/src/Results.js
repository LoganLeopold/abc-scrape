import { useEffect, useState } from 'react'

const Results = (props) => {
  console.log(props)
  const [theseResults, setTheseResults] = useState(props)
  const {results, totalReset} = theseResults
  const {finalWaypoints, individualLinks} = results 
  const isEmpty = Object.keys(results).length > 0

  useEffect(()=>{
    setTheseResults(props)
  },[props])

  const [selected, setSelected] = useState('list')

  return (
    <div class={`results ${isEmpty ? '' : 'active'}`}>
      <h2>4. Get there!</h2>
      <div className='button--select fadeIn'>
        <button 
          className={`${selected === 'list' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            setSelected('list')
          }}
        >
          Single Destinations
        </button>
        <button 
          className={`${selected === 'waypoints' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            setSelected('waypoints')
          }}
        >
          Circuit Link
        </button>
      </div>
      <p className={`${selected === 'waypoints' ? 'active' : ''}`}>This creates a link that routes you to all 10 closest locations as a circuit. You may need to rearrange the order for an optimal route. </p>
      <div className={`result-option ${selected === 'waypoints' ? 'active' : ''}`}>
        <a href={finalWaypoints} target='_blank' rel="noreferrer">{'Open In Maps >'}</a>
      </div>
      <p className={`${selected === 'list' ? 'active' : ''}`}>A list of the top 10 closest locations.</p>
      <div className={`result-option ${selected === 'list' ? 'active' : ''}`}>
        <div className='links'>
          { 
            individualLinks.length > 0 && individualLinks.map( link => 
              <div class='individual-link'>
                <p>{link.address}</p>
                <a href={link.link} target='_blank'>Open in Google</a>
              </div>
            )
          }
        </div>
      </div>
      <button className='reset' onClick={() => totalReset()}>{'<< Start Over'}</button>
    </div>
  )
}

export default Results