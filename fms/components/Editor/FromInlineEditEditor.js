import React, { Component } from 'react';
import { Editor } from '@tinymce/tinymce-react';

class MyEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorData: this.props.content,
    };
  }

  handleEditorDataChange = (content) => {
    this.setState({
      editorData: content,
    });

    this.props.onContentChange(content);
  };

  render() {

    return (
      <div>    
        <Editor
        apiKey={`${process.env.NEXT_PUBLIC_EDITOR_API_KEY}`}
        value={this.state.editorData}
        init={{
          height: 400,
          menubar: false,
          statusbar: false,
          plugins: ["textcolor", "code","preview","image","lists"],
          toolbar: 'undo redo | bold italic  fontsize ' +
          ' forecolor code preview image| alignleft aligncenter alignright alignjustify| bullist numlist outdent indent ',
        fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
          content_style: 'body { font-family:Satoshi,sans-serif; font-size:14pt}'
        }}
        onEditorChange={this.handleEditorDataChange}
      />  
      </div>
    );
  }
}

export default MyEditor;
