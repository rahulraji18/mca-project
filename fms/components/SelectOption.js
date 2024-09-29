/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px dotted gray',
    color: state.isSelected ? 'white' : 'black', 
  }),
  createOption: (styles) => ({
    ...styles,
    color: 'green', 
  }),
};
function SelectOptions({ apiUrl,className,name,id,select,onChange,value,required=false,isMulti=false,label="",addNew=false,initValue="",index="",isclear=true,isDisabled=false}) {

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedValues, setSelectedValues] = useState(value?value:[]);
  const Multiselect = addNew ? CreatableSelect : Select;

  // console.log(initValue)
  useEffect(() => {

   
  
    const token = localStorage.getItem('token');
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    setLoading(false);
    setLoading(true);
    fetch(apiUrl, requestOptions)
      .then((response) => {
        if (!response.ok) {
          setLoading(false);
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // Process the data here
        setLoading(false);
        // console.log(data.data)
        if(data.status)
        {
          
            const initialOptions = data.data.map((option) => ({
              value: option.id,
              label: option.name,
            }));
            if(initValue!="")
            {
              const initValues = Array.isArray(initValue) ? initValue : [initValue];
              const companyNameOption = {
                value: value?value:initValue,
                label: initValue,
              };

              if (!initialOptions.some(option => option.value === companyNameOption.value)) {
                initialOptions.push(companyNameOption);
              }
            }

            setOptions(initialOptions);

           
          
        }
       
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error fetching data:', error);
        // Handle the error here
      });
    
   
  }, [apiUrl]);

  const handleCreate = (inputValue) => {

    const newOption = { value: inputValue, label: inputValue };
    if(isMulti)
    {
      const updatedOptions = [...options, newOption];
    setOptions(updatedOptions);
    const updatedValue = [...selectedValues, newOption];
    setSelectedValues(updatedValue)
    onChange(updatedValue, name,index);

    }
    else{
      setOptions([...options, newOption]);
      onChange(newOption, name,index);
    }
  
  };
  const formatCreateLabel = (inputValue) => {
    if (inputValue.trim() === '') {
      return 'Add';
    } else {
      return (
        <a className='text-primary' href='#'  onClick={(e) => {
          e.preventDefault(); 
        }}>
        <span className='ri-add-circle-fill'></span> Add <strong>&lsquo;{inputValue}&lsquo;</strong> to {label?label:name} options
        
       </a>);
    }
  };
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
<>
    
    <>
    {isMulti?
      <Multiselect
      name={name}
      isMulti={isMulti}
      id={id}
      value={selectedValues}
      onChange={(selectedOptions) => {
        setSelectedValues(selectedOptions);
        onChange(selectedOptions, name,index);
      }}
      options={options?options:[]}
      required={required}
      inputClassName={className}
      onCreateOption={addNew?handleCreate:undefined}
      getOptionValue={(option) => option.value} 
      getOptionLabel={(option) => option.label}
      styles={customStyles}
      formatCreateLabel={formatCreateLabel} 
      isClearable={isclear}
      isDisabled={isDisabled}
      index={index}
    />

        
        :
        
          <Multiselect
          name={name}
          id={id}
          value={options && options.find((option) => option.value === value)}
          onChange={(selectedOption)=>onChange(selectedOption,name,index)}
          options={options?options:[]}
          required={required}
          inputClassName={className}
          onCreateOption={addNew?handleCreate:undefined}
          styles={customStyles}
          formatCreateLabel={formatCreateLabel} 
          isClearable={isclear}
          isDisabled={isDisabled}
          index={index}


        />
        }
    
      
    </>
   
  </>
  );
  }

export default SelectOptions;