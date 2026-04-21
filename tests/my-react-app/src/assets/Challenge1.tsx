import { useState } from "react"

interface IChalengeProps {
        challengeName: string
}

interface IData {
   id: string
   name: string
}

const DEFAULT_DATA: IData = {
    id: '123',
    name: ''
}


export const Challenge1 = ({challengeName = 'challenge1'}:IChalengeProps) => {
    const [data, setData] = useState<IData>(DEFAULT_DATA)

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation()
        const curretnData =  e.currentTarget.value
        console.log(`input data for`, data.id, curretnData)
        setData({...data, name: curretnData})
    }

    return <div>
            <div>{challengeName}</div>
             <div><label htmlFor={`${data.id}-name`}>{data?.id}</label>
            <input id={`${data.id}-name`} onChange={handleOnChange} /></div>
        <div>the name of id: {data?.id } is: { data?.name}</div>
    </div>
}






////////////////////////// correction1
// export const Challenge1 = () => {
//   const [name, setName] = useState("");

//   const handleChange = (e) => {
//     const value = e.target.value;
//     console.log(value);
//     setName(value);
//   };

//   return (
//     <input value={name} onChange={handleChange} />
//   );
// };