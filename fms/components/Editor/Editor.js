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
        name={this.state.name}
        apiKey={`${process.env.NEXT_PUBLIC_EDITOR_API_KEY}`}
        value={this.state.editorData}
        init={{
          height: 400,
          menubar: false,
          plugins: ["code","preview"],
          toolbar: 'undo redo | bold italic' +
          'alignleft aligncenter alignright alignjustify ',
          content_style: 'body { font-family:Satoshi,sans-serif; font-size:14pt}'
        }}
        onEditorChange={this.handleEditorDataChange}
      />
       
      </div>
    );
  }
}

export default MyEditor;
