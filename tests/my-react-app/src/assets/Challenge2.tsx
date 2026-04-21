import { createContext, useContext, useReducer } from "react"

interface IState {
    id: string
    name: string
}



type ActionType = 'UPDATE' | 'DELETE'

interface IAction {
    type: ActionType
    payload?: IState
} 

const newAction = (action: ActionType, state?: IState):IAction  => {
        return {type: action, payload: state} as IAction
}

const DEFAULT_STATE: IState = {
    id: '',
    name: '',
}


const MyIStateSlice = (state: IState, action: IAction): IState => {
    switch (action.type) {
        case "DELETE": 
             return {...state, ...DEFAULT_STATE}
        case "UPDATE":
             return {...state, ...action?.payload}
        default: 
            return state
    }
}




interface IContext {
    update: (state: IState) => void
    erase: () => void
    get: IState
}

const DEFAULT_CONTEXT: IContext = {
    update: () =>  { return },
    erase: () =>  { return },
    get: DEFAULT_STATE
}

const myContext = createContext<IContext>(DEFAULT_CONTEXT)

interface IMyContextProps extends React.ComponentProps<'div'>   {
    children: React.ReactNode
}



const MyContext = ({ children}:IMyContextProps) => {
    const [state, dispatch] = useReducer(MyIStateSlice, DEFAULT_STATE)
    
    const handleUpdate = (state: IState) => {
        dispatch(newAction("UPDATE", state))
    }
    const handleDelete = () => {
        dispatch(newAction("DELETE"))
    }

    const contextManager: IContext = {
        get: state,
        update: handleUpdate,
        erase: handleDelete
    }

    return <myContext.Provider value={contextManager} >
            {children}
    </myContext.Provider>
}

const useMyContext = ():IContext => {
    const _ctx = useContext<IContext>(myContext)
    if (!_ctx) {
        console.error(new Error('You must use this hook within the MyContext s contex'))
        return DEFAULT_CONTEXT
    }
    return _ctx
}


export const MyChildren = () => {
    const { get, erase, update } = useMyContext()
    const currentState = get

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation()
        const curretnData =  e.currentTarget.value  
        update({...currentState, name: curretnData})
    }


    const handleOnclick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        erase?.()
    }


    return <div>
            <div><label htmlFor={`${currentState.id}-name`}>{currentState?.id}</label>
            <input id={`${currentState.id}-name`} onChange={handleOnChange} /></div>
        <button onClick={handleOnclick} >delete</button>
        {currentState?.id} { currentState?.name}
    </div>
}

export const MainApp = () => {
    return <MyContext>        
                <MyChildren  />
           </MyContext>
}



///////////////////////

// import { createContext, useContext, useReducer } from "react";

// const CounterContext = createContext(null);

// const initialState = { count: 0 };

// function reducer(state, action) {
//   switch (action.type) {
//     case "inc":
//       return { count: state.count + 1 };
//     case "dec":
//       return { count: state.count - 1 };
//     default:
//       return state;
//   }
// }

// export function CounterProvider({ children }) {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   return (
//     <CounterContext.Provider value={{ state, dispatch }}>
//       {children}
//     </CounterContext.Provider>
//   );
// }

// export function useCounter() {
//   const ctx = useContext(CounterContext);
//   if (!ctx) throw new Error("useCounter must be used inside CounterProvider");
//   return ctx;
// }
