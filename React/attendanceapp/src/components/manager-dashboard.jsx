import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import Logout from "./logout";

const ManagerDashboard = props => {
    const [workers, setWorkers] = useState([])
    const [day_off, setMonthlyDayOff] = useState([])
    const [weekly_details, setWeekly] = useState([])
    const [monthly_details, setMonthly] = useState([])
    useEffect(() => {
        fetch('fetch_all/' + props.match.params.name.toLowerCase())
            .then(response => response.json())
            .then(workers => setWorkers(workers))
        fetch('weekly_details/' + props.match.params.name.toLowerCase())
            .then(response => response.json())
            .then(weekly_details => setWeekly(weekly_details))
        fetch('monthlydayoff/' + props.match.params.name.toLowerCase())
            .then(response => response.json())
            .then(day_off => setMonthlyDayOff(day_off))
        fetch('monthly_details/' + props.match.params.name.toLowerCase())
            .then(response => response.json())
            .then(monthly => setMonthly(monthly))
    }, [props.match.params.name])
    let handleDelete = id => {
        fetch('delete/' + id)
            .then(() => window.location.href = '/manager/' + props.match.params.name)
    }
    let handleDeleteWeekly = id => {
        fetch('deleterecord/' + id)
            .then(() => window.location.href = '/manager/' + props.match.params.name)
    }
    let salary = (id, name, department) => {
        fetch('salary/' + id)
        fetch('add_workday/' + name + '/' + department)
        window.location.href = '/manager/' + props.match.params.name
    }
    let updateSalary = id => {
        fetch('update_salary/' + id)
        window.location.href = '/manager/' + props.match.params.name
    }
    let approvedayoff = (id, name, department) => {
        let date = new Date()
        fetch('approvedayoff/' + id)
        fetch('add_dayoff/' + name + '/' + department + '/' + date.toLocaleString().split(',')[0].replaceAll('/', '-'))
        window.location.href = '/manager/' + props.match.params.name
    }
    let approvesdayoff = (id, name, department, date) => {
        fetch('approvesdayoff/' + id)
        fetch('add_dayoff/' + name + '/' + department + '/' + date)
        window.location.href = '/manager/' + props.match.params.name
    }
    let denydayoff = id => {
        fetch('denydayoff/' + id)
        window.location.href = '/manager/' + props.match.params.name
    }
    let denysdayoff = id => {
        fetch('denysdayoff/' + id)
        window.location.href = '/manager/' + props.match.params.name
    }
    let monthlyReset = () => {
        fetch('delete_monthly_details/' + props.match.params.name)
            .then(window.location.href = '/manager/' + props.match.params.name)
    }

    let showDailyReport = () => {
        document.querySelector('#daily').style.display = 'table'
        document.querySelector('#weekly').style.display = 'none'
        document.querySelector('#day_off').style.display = 'none'
        document.querySelector('#monthly').style.display = 'none'
    }
    let showWeeklyReport = () => {
        document.querySelector('#weekly').style.display = 'table'
        document.querySelector('#daily').style.display = 'none'
        document.querySelector('#day_off').style.display = 'none'
        document.querySelector('#monthly').style.display = 'none'
    }
    let showDayOff = () => {
        document.querySelector('#day_off').style.display = 'table'
        document.querySelector('#daily').style.display = 'none'
        document.querySelector('#weekly').style.display = 'none'
        document.querySelector('#monthly').style.display = 'none'
    }
    let showMonthlyReport = () => {
        document.querySelector('#monthly').style.display = 'table'
        document.querySelector('#daily').style.display = 'none'
        document.querySelector('#weekly').style.display = 'none'
        document.querySelector('#day_off').style.display = 'none'
    }
    return (
        <div className="managerDash">
            <React.Fragment>
                <h1>Worker Details ({props.match.params.name.toUpperCase()})</h1><br/><br/>
                <Logout/><br/>
                <Link to={'/add/' + props.match.params.name}>Add Worker</Link>
                <button className='btn btn-sm btn-primary m-2 border-0' onClick={showDailyReport}>Daily Details</button>
                <button className='btn btn-sm btn-success m-2 border-0' onClick={showWeeklyReport}>Weekly Details</button>
                <button className='btn btn-sm btn-success m-2 border-0' onClick={showMonthlyReport}>Monthly Details</button>
                <button className='btn btn-sm btn-dark m-2 border-0' onClick={showDayOff}>Day off Requests
                    <span className='badge text-danger'>{day_off.length}</span>
                </button>
                <table className="table table-bordered" style={{display: 'none'}} id='weekly'>
                    <thead>
                    <tr>
                        <th className='small font-weight-bold'>Date</th>
                        <th className='small font-weight-bold'>Name</th>
                        <th className='small font-weight-bold'>Department</th>
                        <th className='small font-weight-bold'>Salary/Hour</th>
                        <th className='small font-weight-bold'>Salary</th>
                        <th className='small font-weight-bold'>Status</th>
                        <th className='small font-weight-bold'>Time Worked</th>
                        <th className='small font-weight-bold'>Dayoff</th>
                        <th className='small font-weight-bold'>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {weekly_details.map(weekly_detail => (
                        <tr key={weekly_detail.id}>
                            <td>{weekly_detail.date}</td>
                            <td>{weekly_detail.name.toUpperCase()}</td>
                            <td>{weekly_detail.department.toUpperCase()}</td>
                            <td>${weekly_detail.salary_hour}</td>
                            {weekly_detail.salary ?
                                <td>${weekly_detail.salary.toFixed(2)}</td> :
                                <td>N/A</td>
                            }
                            {weekly_detail.salary_paid ?
                                <td className='text-success'>Paid</td>
                                :
                                weekly_detail.dayoff_approved ?
                                    <td>N/A</td> :
                                    <td>
                                        <button className="btn btn-sm btn-danger"
                                                onClick={() => updateSalary(weekly_detail.id)}>Make Payment
                                        </button>
                                    </td>
                            }
                            {weekly_detail.time ?
                                <td>{weekly_detail.time.toFixed(3)} hrs</td> :
                                <td>N/A</td>
                            }
                            {weekly_detail.dayoff_approved ?
                                <td>Day Off</td> :
                                <td>N/A</td>
                            }
                            <td>
                                <button onClick={() => handleDeleteWeekly(weekly_detail.id)}
                                        className='btn btn-sm btn-danger'>Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <table className='table table-bordered' id='daily'>
                    <thead>
                    <tr>
                        <th className='small font-weight-bold'>Name</th>
                        <th className='small font-weight-bold'>Department</th>
                        <th className='small font-weight-bold'>Salary/Hour</th>
                        <th className='small font-weight-bold'>Salary</th>
                        <th className='small font-weight-bold'>Clock In</th>
                        <th className='small font-weight-bold'>Clock Out</th>
                        <th className='small font-weight-bold'>LunchIn</th>
                        <th className='small font-weight-bold'>LunchOut</th>
                        <th className='small font-weight-bold'>Dayoff</th>
                        <th className='small font-weight-bold'>Status</th>
                        <th className='small font-weight-bold'>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {workers.map(worker => (
                        <tr key={worker.id}>
                            <td>{worker.name.toUpperCase()}</td>
                            <td>{worker.department.toUpperCase()}</td>
                            <td>${worker.salary_hour}</td>
                            {worker.salary ?
                                <td>${worker.salary.toFixed(2)}</td>
                                :
                                worker.lunchend ?
                                    <td>
                                        <button onClick={() => salary(worker.id, worker.name, worker.department)}
                                                className='btn btn-sm btn-secondary'>Calculate
                                        </button>
                                    </td>
                                    :
                                    worker.lunchstart ?
                                        <td>
                                            <button className='btn btn-sm btn-secondary' disabled={true}>Calculate
                                            </button>
                                        </td>
                                        :
                                        worker.clockout ?
                                            <td>
                                                <button onClick={() => salary(worker.id, worker.name, worker.department)}
                                                        className='btn btn-sm btn-secondary'>Calculate
                                                </button>
                                            </td>
                                            :
                                            worker.clockin ?
                                                <td>
                                                    <button className='btn btn-sm btn-secondary'
                                                            disabled={true}>Calculate
                                                    </button>
                                                </td>
                                                : <td>
                                                    <button
                                                        disabled={true} className='btn btn-sm btn-secondary'>Calculate
                                                    </button>
                                                </td>
                            }
                            {worker.clockin ? <td className='small'>{worker.clockin}</td> : <td className='small'>N/A</td>}
                            {worker.clockout ? <td className='small'>{worker.clockout}</td> :
                                <td className='small'>N/A</td>}
                            {worker.lunchstart ? <td className='small'>{worker.lunchstart}</td> :
                                <td className='small'>N/A</td>}
                            {worker.lunchend ? <td className='small'>{worker.lunchend}</td> :
                                <td className='small'>N/A</td>}
                            {worker.dayoff ?
                                <td className="text-danger small">{worker.dayoff.toUpperCase()}</td>
                                :
                                <td className='text-success small'>N/A</td>
                            }
                            {worker.dayoff ?
                                worker.dayoff_approved ?
                                    <td>
                                        <button className='btn btn-success btn-sm'
                                                disabled={true}>Approved
                                        </button>
                                    </td>
                                    :
                                    worker.dayoff_rejected ?
                                        <td>
                                            <button className='btn btn-danger btn-sm'
                                                    disabled={true}>Rejected
                                            </button>
                                        </td> :
                                        <td>
                                            <button className='btn btn-sm btn-success'
                                                    onClick={() => approvedayoff(worker.id, worker.name, worker.department)}>Approve
                                            </button>
                                            <button className='btn btn-sm btn-danger ml-2'
                                                    onClick={() => denydayoff(worker.id)}>Deny
                                            </button>
                                        </td>
                                :
                                <td className='small'>N/A</td>
                            }
                            <td>
                                <button onClick={() => handleDelete(worker.id)}
                                        className='btn btn-sm btn-danger'>Delete
                                </button>
                            </td>
                        </tr>)
                    )}
                    </tbody>
                </table>
                <table id='day_off' style={{display: 'none'}} className="table table-hover table-bordered">
                    <thead>
                    <tr>
                        <th className='small font-weight-bold'>Date</th>
                        <th className='small font-weight-bold'>Name</th>
                        <th className='small font-weight-bold'>Day off</th>
                        <th className='small font-weight-bold'>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {day_off.map(d => <tr key={d.id}>
                        <td className='small'>{d.date}</td>
                        <td className='small'>{d.name.toUpperCase()}</td>
                        <td className='small'>{d.dayoff.toUpperCase()}</td>
                        {d.dayoff ?
                            d.dayoff_approved ?
                                <td>
                                    <button className='btn btn-success btn-sm'
                                            disabled={true}>Approved
                                    </button>
                                </td>
                                :
                                d.dayoff_reject ?
                                    <td>
                                        <button className='btn btn-danger btn-sm'
                                                disabled={true}>Rejected
                                        </button>
                                    </td> :
                                    <td>
                                        <button className='btn btn-sm btn-success'
                                                onClick={() => approvesdayoff(d.id, d.name, d.department, d.date)}>Approve
                                        </button>
                                        <button className='btn btn-sm btn-danger ml-2'
                                                onClick={() => denysdayoff(d.id)}>Deny
                                        </button>
                                    </td>
                            :
                            <td className='small'>N/A</td>
                        }
                    </tr>)}
                    </tbody>
                </table>
                <div id='monthly' style={{display: 'none'}}>
                    <button className='btn btn-sm btn-warning' onClick={monthlyReset}>Reset</button>
                    <br/><br/>
                    <table className="table table-hover table-bordered">
                        <thead>
                        <tr>
                            <th className='small font-weight-bold'>Date</th>
                            <th className='small font-weight-bold'>Name</th>
                            <th className='small font-weight-bold'>Department</th>
                            <th className='small font-weight-bold'>Working Day</th>
                            <th className='small font-weight-bold'>Dayoff</th>
                        </tr>
                        </thead>
                        <tbody>
                        {monthly_details.map(m => <tr key={m.id}>
                            <td className='small'>{m.date}</td>
                            <td className='small'>{m.name.toUpperCase()}</td>
                            <td className='small'>{m.department.toUpperCase()}</td>
                            {m.workingday ? <td className='small text-success'>Yes</td> :
                                <td className='small text-danger'>No</td>}
                            {m.dayoff ? <td className='small text-danger'>Yes</td> :
                                <td className='small text-success'>No</td>}
                        </tr>)}
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        </div>
    );
};

export default ManagerDashboard;
