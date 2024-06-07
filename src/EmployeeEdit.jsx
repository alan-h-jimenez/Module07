import React from "react"
import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap'

export default class EmployeeEdit extends React.Component {
    constructor() {
        super()
        this.state = { 
            employee: [],
            alertVisible: false,
            alertColor: 'success',
            alertMessage: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        this.loadData()
    }

    loadData() {
        const id = window.location.pathname.split('/')[2]

        fetch(`/api/employees/${id}`)
            .then(response => response.json())
            .then(data => {
                data.employee.dateHired = new Date(data.employee.dateHired)
                this.setState({ employee: data.employee })
            })
            .catch(err => {console.log(err)})
    }

    handleSubmit(e) {
        e.preventDefault()
        
        const form = document.forms.employeeUpdate
        const employee = {
            name: form.name.value,
            extension: form.extension.value,
            email: form.email.value,
            title: form.title.value,
            currentlyEmployed: form.currentlyEmployed.checked
        }

        let url = `/api/employees/${form.id.value}`
console.log(url)
console.log(employee)

        fetch(url, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json; charset=UTF-8'},
            body: JSON.stringify(employee)
        })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    alertVisible: true,
                    alertMessage: data.msg
                })
            })
            .catch(err => {console.log(err)})
    }

    render() {
        return (
            <Card>
            <Card.Header as="h5">Edit {this.state.employee.name}</Card.Header>
            <Card.Body>
                <Card.Text>
                    <Container fluid>
                        <form name="employeeUpdate" onSubmit={this.handleSubmit}>
                            <Row>
                                <Col md={2}>ID:</Col>
                                <Col md="auto"><input type="text" name="id" readOnly="readOnly" defaultValue={this.state.employee._id} /></Col>
                            </Row>
                            <Row>
                                <Col md={2}>Name:</Col>
                                <Col md="auto"><input type="text" name="name" defaultValue={this.state.employee.name} /></Col>
                            </Row>
                            <Row>
                                <Col md={2}>Extension:</Col>
                                <Col md="auto"><input type="text" name="extension" defaultValue={this.state.employee.extension} maxLength={4} /></Col>
                            </Row>
                            <Row>
                                <Col md={2}>Email:</Col>
                                <Col md="auto"><input type="text" name="email" defaultValue={this.state.employee.email} /></Col>
                            </Row>
                            <Row>
                                <Col md={2}>Title:</Col>
                                <Col md="auto"><input type="text" name="title" defaultValue={this.state.employee.title} /></Col>
                            </Row>
                            <Row>
                                <Col md={2}>Date Hired:</Col>
                                <Col md="auto"><input type="text" name="dateHired" readOnly="readOnly" defaultValue={this.state.employee.dateHired} /></Col>
                            </Row>
                            <Row>
                                <Col md={2}>Currently Employed?</Col>
                                <Col md="auto"><input type="checkbox" name="currentlyEmployed" defaultChecked={this.state.employee.currentlyEmployed} /></Col>
                                <Button type="submit" variant="primary" size="sm" className="my-3">Update Employee</Button>
                                <Alert variant={this.state.alertColor} show={this.state.alertVisible} onClose={() => this.setState({ alertVisible: false })} dismissible>{this.state.alertMessage}</Alert>
                            </Row>
                        </form>
                    </Container>
                </Card.Text>
            </Card.Body>
        </Card>            
        )
    }
}