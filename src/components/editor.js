import React from "react";
import 'react-quill/dist/quill.snow.css';

const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(text) {
        this.props.onChange(text);
    }

    render() {
        return (
            <ReactQuill
                theme="snow"
                value={ this.props.value }
                onChange={ this.props.onChange }
                style= { this.props.style }
            />
        )
    }
}

export default Editor
