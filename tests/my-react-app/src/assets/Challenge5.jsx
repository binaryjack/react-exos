import { useRef, useState } from 'react'


const newItem = (id, name) => {
    return { id: id, name: name ?? '' }
}

export function Item({item, editItem, remove}){
    return <li>
        <label htmlFor={`${item.id}.item`}>{item.id}</label>
        <input
            id={`${item.id}-item`}
            value={item.name}
            onChange={(e) => editItem(item.id, e.target.value)} />
        <button onClick={()=> remove(item.id)}>-</button>
    </li>
}

export function DynamicList() {
    // your code here
    const id = useRef(0)
    const [items, setItems] = useState([])     

    const handleAddItem = () => {
        id.current += 1
        setItems(prev => [...prev, newItem( id.current)])
    }

    const handleEditItem = (id, name) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, name } :item))
    }
    const handleRemoveItem = (id) => {
        setItems(prev => prev.filter(o => o.id !== id))
    }

    return <div>
        <h1>Dynamic Items list</h1>
        <button onClick={handleAddItem}>+ ({ items.length})</button>
        <ul>
            {items.map((item) => 
                 <Item
                    key={item.id}
                    item={item}
                    editItem={handleEditItem}
                    remove={handleRemoveItem} />
            )}
        </ul>

    </div>
}