import React from "react";
// import { Link } from "gatsby";

import Layout from "../components/layout";
// import Image from "../components/image";
import SEO from "../components/seo";
import "../styles/style.scss";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import 'react-quill/dist/quill.snow.css';

// import { FaBeer } from 'react-icons/fa';

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
            <ReactQuill theme="snow" value={ this.props.value } onChange={ this.props.onChange } style={{height: "25rem", marginBottom: "5rem"}} />
        )
    }
}

class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "Thorgan Hazard était titulaire tandis qu'Axel Witsel prenait place sur le banc. En l'absence du buteur norvégien Erling Haaland, Thorgan Hazard était aligné en attaque. Le Diable Rouge plantait le premier but de la rencontre à la 54e minute, en exploitant un service d'Emre Can pour inscrire son 7e but.",
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

        const query = {
            '_v' : 1,
            '_timestamp': Math.floor(Date.now() / 1000),
            'algo_list' : this.state.anon_types,
            'format': 'text',
            'encoding': 'utf8',
            'text': this.state.text,
        }

        // Get api response
        // fetch(`https://anon-api.openjustice.be/run`, {
        fetch(`${process.env.GATSBY_API_URL}/run`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(query),
            }).then(response => response.json())
           .then(resultData => {
                this.setState({res_text: {__html: resultData.text}});
                if ('error' in resultData.log)
                    this.setState({log_text: {__html: resultData.log.error}});
                else if ('lines' in resultData.log)
                    this.setState({log_text: {__html: this.logDisplay(resultData.log.lines)}});
            });
    }

    logDisplay(loglines) {
        return loglines.join("\n<br />");
    }

    checkAnonType(event) {
        const el = event.currentTarget;
        if (el.checked) {
            let params = '{}';
            if (el.id === 'anon_etaamb') {
                params = JSON.stringify({'lang': 'french'});
            }
            this.setState({
                anon_types:  this.state.anon_types.filter(val => val.id !== el.id).concat([{'id': el.id, 'params': params}])
            })
        } else {
            this.setState({
                anon_types: this.state.anon_types.filter(val => val.id !== el.id)
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
                        <li>Le résultat s'affiche</li>
                    </ol>
                </div>
            </div>
            <h2>1) Texte à anonymiser</h2>
            <span className="small">Vous pouvez copier-coller depuis une autre source.</span>
            <Editor value={ this.state.text } onChange={ this.handleTextChange }/>
            <h2>2) Options d'anonymisation</h2>
            <Form onSubmit={ this.handleSubmit }>
              <Form.Check type="checkbox" id="anon_test" onChange={ this.checkAnonType } label="Test - renvoi du texte à l'identique" />
              <Form.Check type="checkbox" id="anon_etaamb" onChange={ this.checkAnonType } label="Anon_etaamb - module d'anonymisation d'etaamb.be" />
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
