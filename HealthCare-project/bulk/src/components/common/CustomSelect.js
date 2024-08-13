import Select from 'react-select';

import React, { useEffect } from 'react'

export default function CustomSelect(props) {
    
    const [defaultValueObj, setDefaultValueObj] = React.useState(props.defaultValue)

    useEffect(()=> {
        if(props.defaultValue.value){
            setDefaultValueObj(props.defaultValue);
        }
    },[props.defaultValue])
    return(
        <React.Fragment>
            <Select className="selectbox1"
                onChange={(e) => props.onChange(props.type, e.value)}
                value={{value: defaultValueObj.value, label: defaultValueObj.label}}
                options={props.options}
            />
        </React.Fragment>
    )
}