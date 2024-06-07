import React from 'react'
import { Badge, Button, Card, Modal, Table } from 'react-bootstrap'
import { useLocation, Link } from 'react-router-dom'
import EmployeeFilter from './EmployeeFilter.jsx'
import EmployeeAdd from './EmployeeAdd.jsx'

function EmployeeTable(props) {
    // GET THE URL
    const { search } = useLocation()
    // GET THE PARAMETERS FROM THE URL
    const query = new URLSearchParams(search)
    // GET THE EMPLOYED PARAMETER
    const q = query.get('employed')

    const employeeRows = props.employees
        .filter(employee => (q ? String(employee.currentlyEmployed) === q : true))
        .map(employee => 
        <EmployeeRow 
            key={employee._id} 
            employee={employee}
            deleteEmployee={props.deleteEmployee} />)

    return (
        <Card>
            <Card.Header as="h5">All Employees <Badge bg="secondary">{employeeRows.length}</Badge></Card.Header>
            <Card.Body>
                <Card.Text>
                    <Table striped size="sm">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Extension</th>
                                <th>Email</th>
                                <th>Title</th>
                                <th>Date Hired</th>
                                <th>Currently Employed?</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {employeeRows}
                        </tbody>
                    </Table>
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

class EmployeeRow extends React.Component {
    constructor() {
        super()
        this.state = {
            modalVisible: false
        }
        this.toggleModal = this.toggleModal.bind(this)
        this.onDeleteClick = this.onDeleteClick.bind(this)
    }

    toggleModal() {
        this.setState({ 
            modalVisible: !this.state.modalVisible
        })
    }

    onDeleteClick() {
        this.props.deleteEmployee(this.props.employee._id)
        this.setState({ 
            modalVisible: !this.state.modalVisible
        })
    }

    render() {
        return (
            <tr>
                <th><Link to={`/edit/${this.props.employee._id}`}>{this.props.employee.name}</Link></th>
                <th>{this.props.employee.extension}</th>
                <th>{this.props.employee.email}</th>
                <th>{this.props.employee.title}</th>
                <th>{this.props.employee.dateHired.toDateString()}</th>
                <th>{this.props.employee.currentlyEmployed ? 'Yes' : 'No'}</th>
                <th>
                    <Modal show={this.state.modalVisible} onHide={this.toggleModal} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Delete Employee?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to delete {this.props.employee.name}?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" size="sm" onClick={this.toggleModal}>Cancel</Button>
                            <Button variant="success" size="sm" onClick={this.onDeleteClick}>Yes</Button>
                        </Modal.Footer>
                    </Modal>
                    <Button variant="danger" size="sm" onClick={this.toggleModal}>X</Button>
                </th>
            </tr>
        )
    }
}

export default class EmployeeList extends React.Component {
    constructor() {
        super()
        this.state = { employees: [] }
        this.createEmployee = this.createEmployee.bind(this)
        this.deleteEmployee = this.deleteEmployee.bind(this)
    }

    componentDidMount() {
        this.loadData()
    }

    loadData() {
        fetch('/api/employees')
            .then(response => response.json())
            .then(data => {
                data.employees.forEach(employee => {
                    employee.dateHired = new Date(employee.dateHired)
                })
                this.setState({ employees: data.employees})
            })
            .catch(error => {console.log(error)})
    }

    createEmployee(employee) {
        fetch('/api/employees', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(employee)
        })
            .then(response => response.json())
            .then(newEmployee => {
                newEmployee.employee.dateHired = new Date(newEmployee.employee.dateHired)
                const newEmployees = this.state.employees.concat(newEmployee.employee)
                this.setState({ employees: newEmployees })
                console.log('Total count of employees: ', newEmployees.length)
            })
            .catch(error => {console.log(error)})
    }

    deleteEmployee(id) {
        fetch(`/api/employees/${id}`, {method: 'DELETE'})
            .then(response => {
                if (!response.ok) {
                    console.log('Failed to delete employee.')
                } else {
                    this.loadData()
                }
            })
            .catch(error => {console.log(error)})
    }

    render() {
        return (
            <React.Fragment>
                <EmployeeAdd createEmployee={this.createEmployee} />
                <EmployeeFilter />
                <EmployeeTable employees={this.state.employees} deleteEmployee={this.deleteEmployee} />
            </React.Fragment>
        )
    }
}
