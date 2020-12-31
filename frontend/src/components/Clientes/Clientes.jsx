import React, {Component, useState} from 'react'
import Main from '../Main'
import axios from 'axios'
import Button from '../Button'
import Formulario from './Formulario'
import Collapse from 'react-bootstrap/Collapse'

const headerProps = {
    icon: "users",
    titulo: "Clientes",
    subtitulo: "Cadastrar, alterar e excluir clientes"
}

const baseUrl = 'http://localhost:3001/clientes'

const initialState = {
    cliente: { nome:'', telefone:'', valor_divida:''},
    list: []
}

export default class Clientes extends Component {


    state = {...initialState}


    componentDidMount(){
        axios(baseUrl).then(response => {
            this.setState({ list: response.data })
        })
    }

    // FUNÇÕES DO FORMULÁRIO
    save(){
        const cliente = this.state.cliente
        if(cliente.nome && cliente.telefone && cliente.valor_divida) {
            const method = cliente.id ? 'put' : 'post'
            const url = cliente.id ? `${baseUrl}/${cliente.id}` : baseUrl

            axios[method](url, cliente).then( response => {
                const list = this.getUpdatedList(response.data)
                this.setState({ cliente : initialState.cliente, list })
            })
        } else {
            alert("Você deve preencher todos os campos! ")
        }
    }

    getUpdatedList(cliente, add = true){
        const list = this.state.list.filter(c => c.id != cliente.id)
        if(add) list.unshift(cliente)
        return list
    }

    clear(){
        this.setState({ cliente: initialState.cliente })
    }

    updateField(event){
        const cliente = { ...this.state.cliente}
        cliente[event.target.name] = event.target.value
        this.setState({ cliente })
    }

    load(cliente){
        this.setState({ cliente })
    }

    remove(cliente){
        axios.delete(`${baseUrl}/${cliente.id}`).then(resp => {
            const list = this.getUpdatedList(cliente, false)
            this.setState({ list })
        })
    }

    // LISTA DE CLIENTES
    renderTable(){
        return (         
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th> Id </th>
                        <th> Nome </th>
                        <th> Telefone </th>
                        <th> Dívida </th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {
        return this.state.list.map(cliente => {
            return (
                <tr key={cliente.id}>
                    <td>{cliente.id}</td>
                    <td>{cliente.nome}</td>
                    <td>{cliente.telefone}</td>
                    <td>{cliente.valor_divida}</td>
                    <td>
                        <Button color="warning" callback = {() => this.load(cliente)}>
                            <i className="fa fa-pencil"></i>
                        </Button>
                        <Button color="primary" bootstrap="ml-2">
                            Pagar
                        </Button>
                        <Button color="danger" bootstrap="ml-2" callback = {() => this.remove(cliente)}>
                            <i className="fa fa-trash"></i>
                        </Button>
                        
                    </td>
                </tr>
            )
        })
    }

    render() {
        return <Main {...headerProps}>
            <Formulario 
            updateField = {e => this.updateField(e)}
            clear  = {() => this.clear()}
            save = {() => this.save()}
            valueNome = {this.state.cliente.nome}  
            valueTelefone = {this.state.cliente.telefone} 
            valueDivida = {this.state.cliente.valor_divida}/>
            {this.renderTable()}
        </Main>
    }
}