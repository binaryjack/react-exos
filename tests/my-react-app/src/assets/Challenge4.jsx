
import { useState } from 'react'
const  userInitialState = ()=>  ({ firstName : '', lastName: ''})
export const FullNameForm = () => {
  const [user, setUser] = useState(userInitialState);

  const fullName  = `${user?.firstName} ${user?.lastName}` 
  
  const handleReset = () => setUser(userInitialState())

    const handleChange = (field, value) => {
     setUser(prev => ({...prev, [field]:value}))
  };

    return <div>
        <div>  {fullName} </div>
        <div>
            <label htmlFor="firstNameInput"  >first name</label>
            <input id="firstNameInput" value={user.firstName} onChange={(e)=> handleChange("firstName", e.target.value)} />
        </div>
        <div>
            <label htmlFor="lastNameInput" >last name</label>
            <input id="lastNameInput" value={user.lastName} onChange={(e) => handleChange("lastName", e.target.value)} />
        </div>
        <button onClick={handleReset} >Reset</button>
            
       </div>
  
};