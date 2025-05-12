import React, { useState } from 'react'

const testing = () => {
    const[color,setColor]=useState('');
    const[text,setText]=useState('');
    const handleColorChange=(e)=>{
        setColor(e.target.value);
    }

  return (
    <div>
        <div>
        <textarea 
          style={{background:color}}        
        />
        </div>
        <div>
        <input
        type='text'
        placeholder='Type color'
        value={color}
        onChange={handleColorChange}

        />
        </div>
    </div>
  )
}

export default testing