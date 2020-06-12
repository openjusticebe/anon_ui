import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
// import Image from "../components/image";
import SEO from "../components/seo";
import "../styles/style.scss";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import 'react-quill/dist/quill.snow.css';

// import { FaBeer } from 'react-icons/fa';

const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

const TextExample = `
<p>
Mr Coucke, qui a annoncé jeudi son retrait de la présidence du RSC Anderlecht, a transformé ses prêts au club en capital afin d'assainir le club sur le plan financier et en augmenter son capital de 50 millions d'euros.
</p>
<p>
Un procédé qui pose question vis-a-vis du Fair-play financier mis en place par l'UEFA en mai 2010. "Si ce montant-là est nécessaire pour couvrir les pertes du club, Anderlecht pourrait contrevenir aux règles du Fair-play financier", a expliqué l'économiste du sport Thomas Peeters au quotidien néerlandophone Het Laatste Nieuws jeudi. "Ces 50 millions ne doivent pas être considérés comme des 'revenus' et ne doivent pas être utilisés pour respecter la règle du seuil de rentabilité qui fait partie des règles du Fair-play financier de l'UEFA. Le fait que ce montant provienne directement des actionnaires interdit au club d'utiliser cet argent pour payer le salaire des joueurs ou pour effectuer des transferts. En revanche, l'UEFA permet d'investir ce montant dans des opérations pour les jeunes ou de co-financer la construction d'un nouveau stade".
</p>
<p>
Le CEO d'Anderlecht, Karel Van Eetvelt, ne se dit "pas inquiet": "C'est une observation qui a tout son sens dans des circonstances normales, mais ce ne sont pas des circonstances normales. L'UEFA, la FIFA et la Pro League ont annoncé que les règles entourant le Fair-play financier pour la saison prochaine seraient assouplies à cause de la crise du coronavirus. Nous ne sommes donc pas inquiets".
</p>
`

export const query = graphql`
{
    api {
        algorithms {
            id
            params
            available
            description
            url
        }
    }
}
`

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

const AlgoFormList = ({ onChange, list}) => (
    <div>
        {list.map(algo => 
            <div className="mb-4">
                <h5 className="mb-0">{ algo.id }</h5>
                <div>
                    { algo.description }
                    { algo.url !== "" 
                        ? <span> - <a href={ algo.url }>en savoir plus</a></span>
                        : ''
                    }
                </div>
                <Form.Check 
                    ype="checkbox"
                    id={ algo.id }
                    onChange={ onChange }
                    label="Appliquer cet algorithme"
                    disabled={ ! algo.available }
                />
            </div>
        )}
    </div>
);

class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: TextExample,
            anon_types: [],
            res_text: {__html: '(Zone résultat)' },
            log_text: {__html: '' },
        };
        this.algos = props.data.api.algorithms;
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
            <div className="container">
                <div className="row">
                    <div className="col-8">
                        Page d'expérimentaton et de démonstration d'algorithmes et de techniques d'anonymisation.
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12">
                        <h2>1) Texte à anonymiser</h2>
                        <span className="small">Vous pouvez copier-coller depuis une autre source.</span>
                        <Editor value={ this.state.text } onChange={ this.handleTextChange }/>
                    </div>
                    <div className="col-12 mb-5">
                        <h2>2) Algorithmes d'anonymisation</h2>
                        <Form onSubmit={ this.handleSubmit }>

                          <AlgoFormList onChange = { this.checkAnonType } list = { this.algos } />
                          { /*
                          <Form.Check type="checkbox" id="anon_test" onChange={ this.checkAnonType } label="Test - renvoi du texte à l'identique" />
                          <Form.Check type="checkbox" id="anon_etaamb" onChange={ this.checkAnonType } label="Anon_etaamb - module d'anonymisation d'etaamb.be" />
                          <Form.Check type="checkbox" id="anon_trazor" onChange={ this.checkAnonType } label="Anon_trazor - module de pseudonymisation" />
                          */ }
                          <br />
                          <Button variant="primary" type="submit">
                            Envoi
                          </Button>
                        </Form>

                        <h2>3) Résultat</h2>
                        <div className="log" dangerouslySetInnerHTML={ this.state.log_text} />
                        <div className="result" dangerouslySetInnerHTML={ this.state.res_text} />
                    </div>
                </div>
          </div>
          </Layout>
        )
    }
}

export default IndexPage
