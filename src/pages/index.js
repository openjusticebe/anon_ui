import React, {useState} from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import "../styles/style.scss"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { FaBeer } from 'react-icons/fa';

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
            <ReactQuill theme="snow" value={ this.props.value } onChange={ this.props.onChange } style={{height: "50rem", marginBottom: "5rem"}} />
        )
    }
}

class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: 'poulet',
            anon_types: [],
            res_text: {__html: '(Zone résultat)' },
            log_text: {__html: '' },
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.checkAnonType = this.checkAnonType.bind(this);
    }

    handleTextChange(text) {
        this.setState({
            text: text
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        console.log(form.elements);
        console.log(this.state.text);

        const query = {
            '_v' : 1,
            '_timestamp': Math.floor(Date.now() / 1000),
            'algo_list' : this.state.anon_types,
            'format': 'text',
            'encoding': 'utf8',
            'text': this.state.text,
        }

        // Get api response
        fetch(`https://anon-api.openjustice.be/run`, {
            method: 'post',
            body: JSON.stringify(query)
            }).then(response => response.json())
           .then(resultData => {
                console.log('api response', resultData);
                this.setState({res_text: {__html: resultData.text}});
                if (resultData.log && resultData.log.lines)
                    this.setState({log_text: {__html: resultData.log.lines}});
            });
    }

    checkAnonType(event) {
        const el = event.currentTarget;
        if (el.checked) {
            this.setState({
                anon_types:  this.state.anon_types.filter(val => val !== el.id).concat([el.id])
            })
        } else {
            this.setState({
                anon_types: this.state.anon_types.filter(val => val !== el.id)
            })
        }
    }
        

    render() {
        return (
          <Layout>
            <SEO title="Anon Api Test" />
            <div className="row">
                <div className="col-6">
                    Page test d'algorithmes et de techniques d'anonymisation.
                </div>
                <div className="col-6">
                    <ol>
                        <li>Copiez-collez le texte à anonymiser / dépersonaliser ci-dessous</li>
                        <li>Choissisez un ou plusieurs algorithmes dans la liste et appyez sur "Envoi"</li>
                        <li>Le résultat apparaît</li>
                    </ol>
                </div>
            </div>
            <h2>1) Texte à anonymiser</h2>
            <span className="small">Vous pouvez copier-coller depuis une autre source.</span>
            <Editor value={ this.state.text } onChange={ this.handleTextChange }/>
            <h2>2) Options d'anonymisation</h2>
            <Form onSubmit={ this.handleSubmit }>
              <Form.Check type="checkbox" id="test_anon" onChange={ this.checkAnonType } label="Test - renvoi du texte à l'identique" />
              <br />
              <Button variant="primary" type="submit">
                Envoi
              </Button>
            </Form>
            <h2>3) Résultat</h2>
            <div className="log" dangerouslySetInnerHTML={ this.state.log_text} />
            <div className="result" dangerouslySetInnerHTML={ this.state.res_text} />
            <br />
          </Layout>
        )
    }
}

export default IndexPage
