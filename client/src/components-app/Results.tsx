import { PropsWithChildren, useEffect, useState } from 'react';
import {MethodResults, ResultsStatus} from '../types';

interface Props {
  results: MethodResults;
  totalReset: () => void;
}

const Results: React.FC<PropsWithChildren<Props>> = (props: Props) => {
  const [theseResults, setTheseResults] = useState<Props>(props)
  const {results, totalReset} = theseResults
  const {finalWaypoints, individualLinks} = results 
  const isEmpty = Object.keys(results).length > 0

  useEffect(()=>{
    setTheseResults(props)
  },[props])

  const [selected, setSelected] = useState<ResultsStatus>('list')

  return (
    <div className={`results ${isEmpty ? '' : 'active'} fadeIn`}>
      <h2>4. Get there!</h2>
      <div className='button--select'>
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
      <div className={`result-option ${selected === 'waypoints' ? 'active' : ''}`}>
        <p>This creates a link that routes you to up to 10 closest locations as a circuit. You may need to rearrange the order for an optimal route. </p>
        <a href={finalWaypoints} className='waypoints' target='_blank' rel="noreferrer">{'Open In Maps >'}</a>
      </div>
      <div className={`result-option ${selected === 'list' ? 'active' : ''}`}>
        <p>A list of up to the top 10 closest locations.</p>
        <div className='links'>
          { 
            individualLinks.length > 0 && individualLinks.map( link => 
              <div className='individual-link'>
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
