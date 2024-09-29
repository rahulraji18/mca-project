import React, { useEffect, useState } from 'react'
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'

import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
// import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.min.css'; // Import the CSS for the plugin
// import FilePondPluginFilePoster from 'filepond-plugin-file-poster';

registerPlugin(FilePondPluginFileValidateType,FilePondPluginImagePreview)

function ImageUpload({acceptedFileTypes,maxFiles,onFilesUpdate,name,file=[]}) {
   
  const [files, setFiles] = useState(file);
  const [yes, setYes] = useState(false);




  const handleFilesUpdate = (fileItems) => {

    const filteredFiles = fileItems.filter((fileItem) =>
    acceptedFileTypes.includes(fileItem.file.type)
    );
   
    const uploadedFiles = filteredFiles.map((fileItem) => {
        if (fileItem.source === 'local') {
          return new File([fileItem.file], 'uploaded-image.png', {
            type: fileItem.file.type,
          });
        } else {
          return fileItem.file;
        }
      });
    if (uploadedFiles.length >0) {
    setFiles(uploadedFiles);
      onFilesUpdate(uploadedFiles);
      setYes(false);
    }
   
  };
  
  return (
    <>
     <FilePond
     files={files}
        
  allowImagePreview={true}
    name={name}
    maxFiles={maxFiles}
    allowMultiple={false}
    labelIdle="Drag & Drop your files or <span class='filepond--label-action'>Browse</span>"
    onupdatefiles={handleFilesUpdate}
    allowFileTypeValidation={true}
    acceptedFileTypes={['image/png', 'image/jpeg','image/jpg']}
    //allowFilePoster={true}
    />

    </>
  )
}
export default ImageUpload