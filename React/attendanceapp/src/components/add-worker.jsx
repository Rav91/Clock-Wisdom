import React, {useState, useEffect} from 'react';

const AddWorker = props => {
    const [name, setName] = useState('')
    const [salary, setSalary] = useState('')
    useEffect(() => {
        document.querySelector('.btn.btn-primary').disabled = !(name !== '' && salary !== '');
    })
    let handleName = event => setName(event.target.value)
    let handleSalary = event => setSalary(event.target.value)
    let addWorker = () => {
        fetch('add_worker', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                department: props.match.params.name,
                salary: salary,
            })
        })
        window.location.href = '/manager/' + props.match.params.name
    }
    return (
        <div className="addingWorker">
            <h1>Add Worker</h1><br/><br/>
            <input type="text" value={name} onChange={handleName}
                   placeholder="Worker's name"/><br/><br/>
            <input type="text" readOnly={true} value={props.match.params.name.toUpperCase()}/><br/><br/>
            <input type="text" placeholder="Worker's salary/hour" value={salary}
                   onChange={handleSalary}
            /><br/><br/>
            <input onClick={addWorker} className='btn btn-primary' type="button" value="Add"/>
        </div>

    );
};

export default AddWorker;
