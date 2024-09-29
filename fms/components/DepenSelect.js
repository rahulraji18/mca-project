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
function SelectOptions({ options=[],className,name,id,select,onChange,value,required=false,isMulti=false,addNew=false,initValue="",isclear=true}) {

  const [selectedValues, setSelectedValues] = useState(value?value:[]);
  const Multiselect = addNew ? CreatableSelect : Select;
  const [option, setOption] = useState(options?options:[]);
  useEffect(() => {
    if (initValue !== "") {
      const companyNameOption = {
        value: value?value:initValue,
        label: initValue,
      };

      if (!option.some(opt => opt.value === companyNameOption.value)) {
        setOption([...option, companyNameOption]);
      }
    }
  }, [initValue]);
  
useEffect(() => {
  // console.log(option)
}, [option])

  const handleCreate = (inputValue) => {

    const newOption = { value: inputValue, label: inputValue };
    if(isMulti)
    {
      const updatedOptions = [...option, newOption];
    setOption(updatedOptions);
    const updatedValue = [...selectedValues, newOption];
    setSelectedValues(updatedValue)
    onChange(updatedValue, name);

    }
    else{
      setOption([...option, newOption]);
      onChange(newOption, name);
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
        <span className='ri-add-circle-fill'></span> Add <strong>&lsquo;{inputValue}&lsquo;</strong> to {name} options
        
       </a>);
    }
  };
  
  return (
<>
    
{isMulti ? (
  <Multiselect
    name={name}
    isMulti={isMulti}
    id={id}
    value={selectedValues}
    onChange={(selectedOptions) => {
      setSelectedValues(selectedOptions);
      onChange(selectedOptions, name);
    }}
    options={option?option:[]}
    required={required}
    inputClassName={className}
    onCreateOption={addNew ? handleCreate : undefined}
    getOptionValue={(option) => option.value}
    getOptionLabel={(option) => option.label} // Render the label here
    styles={customStyles}
    formatCreateLabel={formatCreateLabel}
    isClearable={isclear}

  />
) : (
  <Multiselect
    name={name}
    id={id}
    value={option && option.find((opt) => (opt.value) === value)}
    onChange={(selectedOption) => onChange(selectedOption, name)}
    options={option?option:[]}
    required={required}
    inputClassName={className}
    onCreateOption={addNew ? handleCreate : undefined}
    styles={customStyles}
    formatCreateLabel={formatCreateLabel}
    isClearable={isclear}

  />
)}

  </>
  );
  }

export default SelectOptions;