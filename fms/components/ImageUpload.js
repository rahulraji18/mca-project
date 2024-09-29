import React, { useState } from 'react'
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'

import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'

registerPlugin(FilePondPluginFileValidateType,FilePondPluginImagePreview)

function ImageUpload({acceptedFileTypes,maxFiles,onFilesUpdate,name,file=[]}) {
  const [files, setFiles] = useState(file);
  const [yes, setYes] = useState(false);

  const handleFilesUpdate = (fileItems) => {
    // Manually filter files based on accepted file types
    // console.log('kery')
    const filteredFiles = fileItems.filter((fileItem) =>
    acceptedFileTypes.includes(fileItem.file.type)
    );
    const uploadedFiles = filteredFiles.map((fileItem) => fileItem.file);

    // console.log(uploadedFiles)
    // if(!yes)
    // setYes(true);

    if (uploadedFiles) {
    setFiles(uploadedFiles);
      onFilesUpdate(uploadedFiles);
    //   setYes(false);
    }
   
  };
  
  return (
    <>
     <FilePond
    files={files}
    name={name}
    maxFiles={maxFiles}
    allowMultiple={false}
    labelIdle="Drag & Drop your files or <span class='filepond--label-action'>Browse</span>"
    onupdatefiles={handleFilesUpdate}
    allowFileTypeValidation={true}
    acceptedFileTypes={['image/png', 'image/jpeg']}
    />

    </>
  )
}
export default ImageUpload