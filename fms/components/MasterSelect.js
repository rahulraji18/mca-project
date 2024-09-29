/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
let customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: "1px dotted gray",
    color: state.isSelected ? "white" : "black",
  }),
  createOption: (styles) => ({
    ...styles,
    color: "green",
  }),
};

function MasterSelect({
  skillValue = "",
  apiUrl,
  className,
  name,
  id,
  select,
  onChange,
  value,
  required = false,
  isMulti = false,
  label = "",
  addNew = false,
  initValue = "",
  index = "",
  isclear = true,
  isDisabled = false,
  placeholder = "",
  borderFlag = false,
  indicationFlag = true,
  style,
  classStyleFlag = false,
  any = false,
  divClassName =""
}) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedValues, setSelectedValues] = useState(value ? value : []);
  const Multiselect = addNew ? CreatableSelect : Select;

  if (placeholder && borderFlag) {
    if (!indicationFlag)
      customStyles = {
        ...customStyles,
        control: (base) => ({
          ...base,
          border: 0,
          // This line disable the blue border
          boxShadow: "none",
        }),
        menu: (provided) => ({
          ...provided,
          width: "250px", // Adjust the width as needed
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          order: 1,
          display: "none",
        }),
        indicatorSeparator: (provided) => ({
          ...provided,
          order: 2,
          display: "none",
        }),
      };
    else
      customStyles = {
        ...customStyles,
        control: (base) => ({
          ...base,
          border: 0,
          // This line disable the blue border
          boxShadow: "none",
        }),
        menu: (provided) => ({
          ...provided,
          width: "250px", // Adjust the width as needed
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          order: 1,
        }),
        indicatorSeparator: (provided) => ({
          ...provided,
          order: 2,
        }),
      };
  }
  if (style) {
    customStyles = { ...customStyles, style };
  }
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    setLoading(false);

    if (
      name === "license" ||
      name === "certification" ||
      name === "techSkills" ||
      name === "salary_range" ||
      name === "selection_process" ||
      name === "responsibilities" ||
      name === "education" ||
      name === "preferred_industry" ||
      name === "prefered_employee_type" ||
      name === "education_level" ||
      name === "employment_type" ||
      name === "domain" ||
      name === "seniority" ||
      name === "prefered_mode_of_work" ||
      name === "city" ||
      name === "language" ||
      name == "country" ||
      name === "degree_type" ||
      name === "industry" ||
      name === "sectorDomain" ||
      name === "designation" ||
      name === "skill" ||
      name === "identity" ||
      name == 'basic' ||
      name == 'intermediate' ||
      name == 'advanced' ||
      name == 'expert' ||
      name == 'basic_preferred' ||
      name == 'education_level' ||
      name == 'job_role' || 
      name == 'highest_education'||name === "domain_name"  ||
      name == 'diversity' ||
      name == 'client_name' ||
      name == 'qrt_id' ||
      name=="industry_recognition"   ) {
      setLoading(true);
      fetch(apiUrl, requestOptions)
        .then((response) => {
          if (!response.ok) {
            setLoading(false);
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Process the data here
          setLoading(false);
          if (data.status) {
            if (
              name === "license" ||
              name === "certification" ||
              name === "techSkills" ||
              name === "education" ||
              name === "salary_range" ||
              name === "selection_process" ||
              name === "responsibilities" ||
              name === "preferred_industry" ||
              name === "prefered_employee_type" ||
              name === "education_level" ||
              name === "employment_type" ||
              name === "domain" ||
              name === "domain_name" ||
              name === "seniority" ||
              name === "prefered_mode_of_work" ||
              name === "city" ||
              name === "language" ||
              name == "country" ||
              name === "degree_type" ||
              name === "industry" ||
              name === "sectorDomain" ||
              name === "designation" ||
              name === "skill" ||
              name === "identity" ||
              name == 'basic' ||
              name == 'intermediate' ||
              name == 'advanced' ||
              name == 'expert' ||
              name == 'basic_preferred' ||
              name == 'education_level' ||
              name == 'job_role' ||
              name == 'highest_education'||
              name=="industry_recognition" ||
              name == 'diversity' ||
              name == 'client_name' ||
              name == 'qrt_id'
            ) {
              if (typeof data?.data?.data === "object")
                data.data = data?.data?.data ?? data.data;
              const initialOptions = data.data.map((option) => ({
                value: option.id,
                label: option.name,
              }));
              if (initValue != "") {
                const initValues = Array.isArray(initValue)
                  ? initValue
                  : [initValue];
                const companyNameOption = {
                  value: value ? value : initValue,
                  label: initValue,
                };

                if (
                  !initialOptions.some(
                    (option) => option.value === companyNameOption.value
                  )
                ) {
                  initialOptions.push(companyNameOption);
                }
              }

              setOptions(initialOptions);
            }
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error fetching data:", error);
          // Handle the error here
        });
    } else {
      if (initValue != "") {
        const companyNameOption = {
          value: initValue,
          label: initValue,
        };
        setOptions([companyNameOption]);
      }
    }
  }, [apiUrl]);

  useEffect(() => {
    if (skillValue) {
      const updatedOptions = [...options, skillValue];
      setOptions(updatedOptions);
    }
  }, [skillValue]);

  const handleCreate = (inputValue) => {
    const newOption = { value: inputValue, label: inputValue };
    if (isMulti) {
      const updatedOptions = [...options, newOption];
      setOptions(updatedOptions);
      const updatedValue = [...selectedValues, newOption];
      setSelectedValues(updatedValue);
      onChange(updatedValue, name, index);
    } else {
      setOptions([...options, newOption]);
      onChange(newOption, name, index);
    }
  };
  const formatCreateLabel = (inputValue) => {
    if (inputValue.trim() === "") {
      return "Add";
    } else {
      return (
        <a
          className="text-primary"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleCreate(inputValue);
          }}
        >
          <span className="ri-add-circle-fill"></span> Add{" "}
          <strong>&lsquo;{inputValue}&lsquo;</strong> to {label ? label : name}{" "}
          options
        </a>
      );
    }
  };
  if (loading) {
    return <p>Loading...</p>;
  }
  const selectAllOption = {
    value: !any ? 0 : options?.length ? options.map(option => option.value) : [],
    label: "Any",
  };
  return (
    <>
      {classStyleFlag && (
        <style>
          {`
        .css-1nmdiq5-menu {

        }
        `}
        </style>
      )}
      {/* common-input-select */}
      <div className={`${divClassName}`}>
        {isMulti ? (
          <Multiselect
            name={name}
            isMulti={isMulti}
            id={id}
            // value={selectedValues}
            value={any ? ((value == 0 && selectAllOption?.length) ? [...selectAllOption] : selectedValues) : selectedValues}
            onChange={(selectedOptions) => {
              setSelectedValues(selectedOptions);
              onChange(selectedOptions, name, index);
            }}
            options={any ? options ? [selectAllOption, ...options] : [] : options ? options : []}
            // options={options ? options : []}
            required={required}
            inputClassName={className + " multiple-select01"}
            onCreateOption={addNew ? handleCreate : undefined}
            getOptionValue={(option) => option.value}
            getOptionLabel={(option) => option.label}
            styles={customStyles}
            formatCreateLabel={formatCreateLabel}
            isClearable={isclear}
            isDisabled={isDisabled}
            index={index}
            placeholder={placeholder}
          />
        ) : (
          <Multiselect
            name={name}
            id={id}
            value={any ? (value == 0 ? selectAllOption : options && options.find((option) => option.value == value)): options && options.find((option) => option.value == value)}
            onChange={(selectedOption) => onChange(selectedOption, name, index)}
            options={any ? options ? [selectAllOption, ...options] : [] : options ? options : []}
            required={required}
            inputClassName={className + " multiple-select01"}
            onCreateOption={addNew ? handleCreate : undefined}
            styles={customStyles}
            formatCreateLabel={formatCreateLabel}
            isClearable={isclear}
            isDisabled={isDisabled}
            index={index}
            placeholder={placeholder}
            // menuIsOpen={true}
          />
        )}
      </div>
    </>
  );
}

export default MasterSelect;