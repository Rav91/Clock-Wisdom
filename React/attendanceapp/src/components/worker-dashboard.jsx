import React, {useState, useEffect} from 'react';
import Logout from "./logout";
import Calendar from 'react-calendar';
import './styles.css';

const WorkerDashboard = props => {
    const [worker, setWorker] = useState({})
    const [day_off, setMonthlyDayOff] = useState([])
    const [query, setQuery] = useState('')
    const [date, onChange] = useState(new Date());
    useEffect(() => {
        fetch('worker_profile/' + props.match.params.name.toLowerCase())
            .then(response => response.json())
            .then(worker => setWorker(worker))
        fetch('monthlydayoff/' + props.match.params.name.toLowerCase())
            .then(response => response.json())
            .then(day_off => setMonthlyDayOff(day_off))
    }, [props.match.params.name])
    let schedule_day_off = () => {
        fetch('scheduledayoff', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: worker.name,
                department: worker.department,
                dayoff: query,
                date: date.toLocaleString().split(',')[0].replaceAll('/', '-'),
            })
        })
        window.location.href = '/worker/' + worker.name
    }
    let clockIn = name => {
        fetch('clock_in/' + name)
        window.location.href = '/worker/' + props.match.params.name
    }
    let clockOut = name => {
        fetch('clock_out/' + name)
        window.location.href = '/worker/' + props.match.params.name
    }
    let lunchstart = name => {
        fetch('lunch_start/' + name)
        window.location.href = '/worker/' + props.match.params.name
    }
    let lunchend = name => {
        fetch('lunch_end/' + name)
        window.location.href = '/worker/' + props.match.params.name
    }
    let dayoff = name => {
        fetch('dayoff/' + name + '/' + query)
        window.location.href = '/worker/' + props.match.params.name
    }
    let cancelDayoff = name => {
        fetch('reset_dayoff/' + name)
        window.location.href = '/worker/' + props.match.params.name
    }
    let salary = (name, department) => {
        fetch('salary/' + name)
        fetch('add_workday/' + name + '/' + department)
        window.location.href = '/worker/' + props.match.params.name
    }
    let resetTime = name => {
        fetch('reset_time/' + name)
        window.location.href = '/worker/' + props.match.params.name
    }
    let handleDelete = id => {
        fetch('deletedayoff/' + id)
            .then(() => window.location.href = '/worker/' + props.match.params.name)
    }
    let displayDiv = () => document.querySelectorAll('.request')[0].style.display = 'block'
    let handleChange = event => setQuery(event.target.value)
    let displayCalender = () => {
        document.querySelector('.react-calender').style.display = 'block'
        document.querySelectorAll('.request')[1].style.display = 'block'
        document.querySelector('.day_off').style.display = 'none'
    }
    let displayTable = () => {
        document.querySelector('.day_off').style.display = 'block'
        document.querySelector('.react-calender').style.display = 'none'
        document.querySelectorAll('.request')[1].style.display = 'none'
    }
    return (
        <div className="workerDash">
            <React.Fragment>
                {worker.name ?
                    <div>
                        <h1> Welcome {worker.name.toUpperCase()}!</h1><br/>
                        <div className='d-flex'>
                            <div>
                                <Logout/>
                            </div>
                            <div>
                                <div><Calendar className='react-calender' value={date} onChange={onChange}/></div>
                                <div className='day_off'>
                                    <table className="table table-sm table-hover table-bordered">
                                        <thead>
                                        <tr>
                                            <th className='small font-weight-bold'>Date</th>
                                            <th className='small font-weight-bold'>Status</th>
                                            <th className='small font-weight-bold'></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {day_off.map(d => <tr key={d.id}>
                                            <td className='small'>{d.date}</td>
                                            {d.dayoff_approved ?
                                                <td className='small text-success'>Approved</td>
                                                :
                                                d.dayoff_reject ?
                                                    <td className='small text-danger'>Rejected</td> : d.dayoff ?
                                                    <td className='small text-warning'>Pending</td> :
                                                    null
                                            }
                                            <td className='small text-danger' onClick={() => handleDelete(d.id)}
                                                style={{cursor: 'pointer'}}>Delete
                                            </td>
                                        </tr>)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <br/><br/>
                        <input type="button" onClick={() => resetTime(worker.name)} className='btn btn-sm btn-warning'
                            value="Reset Time"/>
                        <input type="button" onClick={() => cancelDayoff(worker.name)}
                            className='btn btn-sm btn-warning ml-2'
                            value="Reset Day Off"/>
                        <input type="button" onClick={displayCalender}
                            className='btn btn-sm btn-secondary ml-2'
                            value="Schedule Day Off"/>
                        <input type="button" onClick={displayTable}
                            className='btn btn-sm btn-secondary ml-2'
                            value="Day off Status"/>
                        <br/><br/><br/>
                        <div className='request'>
                            <input type="text" onChange={handleChange} placeholder='Day off reason?'/>
                            <button onClick={() => dayoff(worker.name, query)}
                                    className='btn btn-danger btn-sm ml-2'>Request
                            </button>
                        </div>
                        <div className='request'>
                            <input type="text" onChange={handleChange} placeholder='Day off reason?'/>
                            <button onClick={schedule_day_off}
                                    className='btn btn-danger btn-sm ml-2'>Request
                            </button>
                        </div>
                        <table className="table table-bordered">
                            <thead>
                            <tr>
                                <th className='small font-weight-bold'>Name</th>
                                <th className='small font-weight-bold'>Department</th>
                                <th className='small font-weight-bold'>Salary/Hour</th>
                                <th className='small font-weight-bold'>Salary</th>
                                <th className='small font-weight-bold'>Clock In</th>
                                <th className='small font-weight-bold'>Clock Out</th>
                                <th className='small font-weight-bold'>Lunch Start</th>
                                <th className='small font-weight-bold'>Lunch End</th>
                                <th className='small font-weight-bold'>Day off</th>
                                <th className='small font-weight-bold'>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{worker.name.toUpperCase()}</td>
                                <td>{worker.department.toUpperCase()}</td>
                                <td>${worker.salary_hour}</td>
                                {worker.salary ?
                                    <td>${worker.salary.toFixed(2)}</td>
                                    :
                                    worker.lunchend ?
                                        <td>
                                            <button onClick={() => salary(worker.name, worker.department)}
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
                                                    <button onClick={() => salary(worker.name, worker.department)}
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
                                                        <button className='btn btn-sm btn-secondary'
                                                                disabled={true}>Calculate
                                                        </button>
                                                    </td>
                                }
                                {worker.clockin ?
                                    <td className='small'>{worker.clockin}</td>
                                    :
                                    worker.dayoff_approved ?
                                        <td>
                                            <button disabled={true}
                                                    className='btn btn-success btn-sm'>ClockIn
                                            </button>
                                        </td>
                                        :
                                        worker.dayoff_denyed ?
                                            <td>
                                                <button onClick={() => clockIn(worker.name)}
                                                        className='btn btn-success btn-sm'>ClockIn
                                                </button>
                                            </td>
                                            : <td>
                                                <button onClick={() => clockIn(worker.name)}
                                                        className='btn btn-success btn-sm'>ClockIn
                                                </button>
                                            </td>
                                }
                                {worker.clockout ?
                                    <td className='small'>{worker.clockout}</td>
                                    :
                                    worker.clockin ?
                                        <td>
                                            <button onClick={() => clockOut(worker.name)}
                                                    className='btn btn-danger btn-sm'>ClockOut
                                            </button>
                                        </td>
                                        :
                                        <td>
                                            <button disabled={true} onClick={() => clockOut(worker.name)}
                                                    className='btn btn-danger btn-sm'>ClockOut
                                            </button>
                                        </td>
                                }
                                {worker.lunchstart ?
                                    <td className='small'>{worker.lunchstart}</td>
                                    :
                                    worker.clockout ?
                                        <td>
                                            <button disabled={true}
                                                    className='btn btn-warning btn-sm'>Lunch Start
                                            </button>
                                        </td>
                                        : worker.clockin ?
                                        <td>
                                            <button onClick={() => lunchstart(worker.name)}
                                                    className='btn btn-warning btn-sm'>Lunch Start
                                            </button>
                                        </td>
                                        :
                                        <td>
                                            <button disabled={true}
                                                    className='btn btn-warning btn-sm'>Lunch Start
                                            </button>
                                        </td>

                                }
                                {worker.lunchend ?
                                    <td className='small'>{worker.lunchend}</td>
                                    :
                                    worker.lunchstart ?
                                        <td>
                                            <button onClick={() => lunchend(worker.name)}
                                                    className='btn btn-primary btn-sm'>Lunch End
                                            </button>
                                        </td> :
                                        <td>
                                            <button disabled={true} onClick={() => lunchend(worker.name)}
                                                    className='btn btn-primary btn-sm'>Lunch End
                                            </button>
                                        </td>
                                }
                                {worker.dayoff ?
                                    <td>
                                        <button className='btn btn-danger btn-sm' disabled={true}>Requested</button>
                                    </td>
                                    :
                                    worker.clockin ? <td>
                                            <button disabled={true}
                                                    className='btn btn-danger btn-sm'>Request
                                            </button>
                                        </td> :
                                        <td>
                                            <button onClick={displayDiv}
                                                    className='btn btn-danger btn-sm'>Request
                                            </button>
                                        </td>
                                }
                                {worker.dayoff_approved ?
                                    <td className='text-success'>Approved</td>
                                    :
                                    worker.dayoff_rejected ? <td className='text-danger'>Rejected</td> : worker.dayoff ?
                                        <td className='text-warning'>Pending</td> :
                                        null
                                }
                            </tr>
                            </tbody>
                        </table>
                    </div> :
                    <h1>Details not found for worker {props.match.params.name.toUpperCase()}!</h1>}
            </React.Fragment>
        </div>
    );
};


export default WorkerDashboard;
