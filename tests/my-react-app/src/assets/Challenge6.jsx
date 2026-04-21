
// Implement a component that:
// Has a checkbox: “Show details”
//  When checked, displays a controlled <input> for details
//  When unchecked:
//  The input disappears
//  The details state resets to an empty string
//  Displays the current details value below the checkbox
// Ensures:
//  No uncontrolled → controlled warnings
//  No stale state
//  No leftover values after hiding the input
//  No unnecessary re-renders
import { useState } from 'react'

export function DetailsToggle() {
  // your code here
  const  [details, setDetails] = useState('')
  const [toggleDetails, setToggleDetails] = useState(false)

    const handleToggleDetails = (toggle) => {
    const checked = toggle.target.checked
    setToggleDetails(checked)
    if (!checked) setDetails('')
 } 
    
const handleUpdateDetail  = (e) => {
    setDetails(e.target.value)
} 
    
  return <div> 
        check box
      <div>
          <label
              htmlFor="showHideDetails">Show details </label>  
          <input 
              id="showHideDetails"
              type="checkbox"            
              checked={toggleDetails}
              onChange={handleToggleDetails} />
      </div>
      <div>{details}</div>

      <div>
          {toggleDetails ?
              <>
                <label
                htmlFor="detailInput">Details </label>  
                  <input 
                     id="detailInput"                      
                      type="text"
                      value={details}
                      onChange={handleUpdateDetail} />
            </>
            :
            <></>}
         </div>

 
    </div>
}
