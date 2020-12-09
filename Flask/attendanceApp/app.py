import time
from datetime import datetime
from database import app, db, WorkerDetails, WorkersWeeklyDetails, ScheduleDayOff, WorkorDayoff
from flask import jsonify, request


# http://127.0.0.1:5000/fetch_all returns all the workers added in db.
# anything written inside @app.route() redirects to the endpoint.
@app.route('/fetch_all')
def fetch_all():
    workers = WorkerDetails.query.all()
    data = []
    for w in workers:
        data.append(
            {'id': w.id, 'name': w.name, 'department': w.department, 'salary_hour': w.salary_hour,
             'salary': w.salary, 'salary_paid': w.salary_paid,
             'clockin': w.clockin,
             'clockout': w.clockout, 'lunchstart': w.lunchstart,
             'lunchend': w.lunchend, 'dayoff': w.dayoff,
             'total_time': '',
             'dayoff_approved': w.dayoff_approved,
             'dayoff_rejected': w.dayoff_denyed})
    return jsonify(data)


# If we only use fetch_all/<department> then it is called in react as /:department
# Returns all workers for a specific department
@app.route('/manager/fetch_all/<department>')
def fetch_all_department(department):
    workers = WorkerDetails.query.filter_by(department=department).all()
    data = []
    for w in workers:
        data.append(
            {'id': w.id, 'name': w.name, 'department': w.department, 'salary_hour': w.salary_hour,
             'salary': w.salary, 'salary_paid': w.salary_paid,
             'clockin': w.clockin,
             'clockout': w.clockout, 'lunchstart': w.lunchstart,
             'lunchend': w.lunchend, 'dayoff': w.dayoff,
             'total_time': '',
             'dayoff_approved': w.dayoff_approved,
             'dayoff_rejected': w.dayoff_denyed})
    return jsonify(data)


# Add a worker
@app.route('/add/add_worker', methods=['POST'])
def add_worker():
    data = {}
    if request.method == 'POST':
        data = {
            'name': request.json['name'].lower(),
            'department': request.json['department'].lower(),
            'salary_hour': request.json['salary'].lower(),
        }
        worker = WorkerDetails(name=data['name'], department=data['department'], salary_hour=data['salary_hour'])
        db.session.add(worker)
        db.session.commit()
    return jsonify(data)


# Delete a worker and this is done from manager's end.
@app.route('/manager/delete/<int:id>')
def delete_user(id):
    worker = WorkerDetails.query.get(id)
    db.session.delete(worker)
    db.session.commit()
    message = {'message': 'Deleted!'}
    return jsonify(message)


# Delete a worker's record from weekly database
@app.route('/manager/deleterecord/<int:id>')
def delete_user_record(id):
    worker = WorkersWeeklyDetails.query.get(id)
    db.session.delete(worker)
    db.session.commit()
    message = {'message': 'Deleted!'}
    return jsonify(message)


# Calculate the amount of salary made from worker's end.
@app.route('/worker/salary/<name>')
def salary_by_worker(name):
    totalTime = ''
    salary = ''
    worker = WorkerDetails.query.filter_by(name=name).first()
    if worker.clockin and worker.clockout and worker.lunchstart and worker.lunchend:
        clocktime = datetime.strptime(worker.clockout, '%Y-%m-%d %H:%M:%S') - datetime.strptime(worker.clockin,
                                                                                                '%Y-%m-%d %H:%M:%S')
        lunchtime = datetime.strptime(worker.lunchend, '%Y-%m-%d %H:%M:%S') - datetime.strptime(worker.lunchstart,
                                                                                                '%Y-%m-%d %H:%M:%S')
        totalTime = float((clocktime - lunchtime).total_seconds()) * 0.000277778
        salary = totalTime * worker.salary_hour
        worker.salary = salary
        db.session.commit()
    elif worker.clockin and worker.clockout:
        clocktime = datetime.strptime(worker.clockout, '%Y-%m-%d %H:%M:%S') - datetime.strptime(worker.clockin,
                                                                                                '%Y-%m-%d %H:%M:%S')
        totalTime = float((clocktime).total_seconds()) * 0.000277778
        salary = totalTime * worker.salary_hour
        worker.salary = salary
        db.session.commit()
    weekly_details = WorkersWeeklyDetails(date=str(datetime.date(datetime.now())), name=worker.name,
                                          department=worker.department,
                                          salary_hour=worker.salary_hour, salary=salary,
                                          salary_paid=worker.salary_paid, time=totalTime)
    db.session.add(weekly_details)
    db.session.commit()
    return jsonify({'message': 'Salary added.'})


# Calculate the amount of salary made from manager's end.
@app.route('/manager/salary/<int:id>')
def salary_by_manager(id):
    totalTime = ''
    salary = ''
    worker = WorkerDetails.query.get(id)
    if worker.clockin and worker.clockout and worker.lunchstart and worker.lunchend:
        clocktime = datetime.strptime(worker.clockout, '%Y-%m-%d %H:%M:%S') - datetime.strptime(worker.clockin,
                                                                                                '%Y-%m-%d %H:%M:%S')
        lunchtime = datetime.strptime(worker.lunchend, '%Y-%m-%d %H:%M:%S') - datetime.strptime(worker.lunchstart,
                                                                                                '%Y-%m-%d %H:%M:%S')
        totalTime = float((clocktime - lunchtime).total_seconds()) * 0.000277778
        salary = totalTime * worker.salary_hour
        worker.salary = salary
        db.session.commit()
    elif worker.clockin and worker.clockout:
        clocktime = datetime.strptime(worker.clockout, '%Y-%m-%d %H:%M:%S') - datetime.strptime(worker.clockin,
                                                                                                '%Y-%m-%d %H:%M:%S')
        totalTime = float((clocktime).total_seconds()) * 0.000277778
        salary = totalTime * worker.salary_hour
        worker.salary = salary
        db.session.commit()
    weekly_details = WorkersWeeklyDetails(date=str(datetime.date(datetime.now())), name=worker.name,
                                          department=worker.department,
                                          salary_hour=worker.salary_hour, salary=salary,
                                          salary_paid=worker.salary_paid, time=totalTime)
    db.session.add(weekly_details)
    db.session.commit()
    return jsonify({'message': 'Salary added.'})


# Make payment
@app.route('/manager/update_salary/<int:id>')
def pay_salary(id):
    worker = WorkersWeeklyDetails.query.get(id)
    # works when passed in a query string parameter
    # salary = request.args.get('salary')
    # worker.salary = salary
    # db.session.commit()
    worker.salary_paid = True
    db.session.commit()
    return jsonify({'message': 'Salary Paid.'})


# Reset Payment
@app.route('/manager/reset_salary/<int:id>')
def unpay_salary(id):
    worker = WorkerDetails.query.get(id)
    worker.salary = None
    worker.salary_paid = False
    db.session.commit()
    return jsonify({'message': 'Salary Reseted.'})


# Fetch a worker by name
@app.route('/worker/worker_profile/<name>')
def worker_profile(name):
    worker = WorkerDetails.query.filter_by(name=name.lower()).first()
    return jsonify({'id': worker.id, 'name': worker.name, 'department': worker.department,
                    'salary_hour': worker.salary_hour,
                    'salary': worker.salary,
                    'salary_paid': worker.salary_paid,
                    'dayoff': worker.dayoff, 'clockin': worker.clockin,
                    'clockout': worker.clockout,
                    'lunchstart': worker.lunchstart, 'lunchend': worker.lunchend,
                    'dayoff_approved': worker.dayoff_approved,
                    'dayoff_rejected': worker.dayoff_denyed,
                    })


# Clock in
@app.route('/worker/clock_in/<name>')
def clock_in(name):
    worker = WorkerDetails.query.filter_by(name=name).first()
    worker.clockin = str(datetime.now()).split('.')[0]
    db.session.commit()
    return jsonify({'message': 'Start time added.'})


# Clock out
@app.route('/worker/clock_out/<name>')
def clock_out(name):
    worker = WorkerDetails.query.filter_by(name=name).first()
    worker.clockout = str(datetime.now()).split('.')[0]
    db.session.commit()
    return jsonify({'message': 'End time added.'})


# Lunch Start
@app.route('/worker/lunch_start/<name>')
def lunchstart(name):
    worker = WorkerDetails.query.filter_by(name=name).first()
    worker.lunchstart = str(datetime.now()).split('.')[0]
    db.session.commit()
    return jsonify({'message': 'Start time added.'})


# Lunch End
@app.route('/worker/lunch_end/<name>')
def lunchend(name):
    worker = WorkerDetails.query.filter_by(name=name).first()
    worker.lunchend = str(datetime.now()).split('.')[0]
    db.session.commit()
    return jsonify({'message': 'Start time added.'})


# Request Dayoff
@app.route('/worker/dayoff/<name>/<query>')
def dayoff(name, query):
    worker = WorkerDetails.query.filter_by(name=name).first()
    worker.dayoff = query
    db.session.commit()
    return jsonify({'message': 'Day of requested.'})


# Approve Dayoff
@app.route('/manager/approvedayoff/<int:id>')
def approvedayoff(id):
    worker = WorkerDetails.query.get(id)
    worker.dayoff_approved = True
    db.session.commit()
    weekly_details = WorkersWeeklyDetails(date=str(datetime.date(datetime.now())), name=worker.name,
                                          department=worker.department,
                                          salary_hour=worker.salary_hour,
                                          salary_paid=worker.salary_paid, dayoff_approved=True)
    db.session.add(weekly_details)
    db.session.commit()
    return jsonify({'message': 'Request approved.'})


# Deny Dayoff
@app.route('/manager/denydayoff/<int:id>')
def denydayoff(id):
    worker = WorkerDetails.query.get(id)
    worker.dayoff_denyed = True
    db.session.commit()
    return jsonify({'message': 'Request rejected.'})


# Cancel dayoff from worker's end
@app.route('/worker/reset_dayoff/<name>')
def reset_dayoff(name):
    worker = WorkerDetails.query.filter_by(name=name).first()
    worker.dayoff = None
    worker.dayoff_approved = False
    worker.dayoff_denyed = False
    db.session.commit()
    return jsonify({'message': 'Dayoff reseted.'})


# Reset time from worker's end
@app.route('/worker/reset_time/<name>')
def reset_time(name):
    worker = WorkerDetails.query.filter_by(name=name).first()
    worker.salary = None
    worker.salary_paid = False
    worker.clockin = None
    worker.clockout = None
    worker.lunchstart = None
    worker.lunchend = None
    db.session.commit()
    return jsonify({'message': 'Time reseted.'})


# Fetch all weekly data
@app.route('/manager/weekly_details/<name>')
def weekly_details(name):
    weekly_details = WorkersWeeklyDetails.query.filter_by(department=name).all()
    data = []
    for w in weekly_details:
        data.append(
            {'id': w.id, 'date': w.date, 'name': w.name, 'department': w.department, 'salary_hour': w.salary_hour,
             'salary': w.salary,
             'salary_paid': w.salary_paid, 'time': w.time, 'dayoff_approved': w.dayoff_approved,
             'dayoff_reject': w.dayoff_reject})
    return jsonify(data)


# Schedule day off
@app.route('/worker/scheduledayoff', methods=['POST'])
def scheduledayoff():
    data = {}
    if request.method == 'POST':
        data = {
            'name': request.json['name'].lower(),
            'department': request.json['department'].lower(),
            'dayoff': request.json['dayoff'].lower(),
            'date': request.json['date']
        }
        worker = ScheduleDayOff(name=data['name'], department=data['department'], dayoff=data['dayoff'],
                                date=data['date'])
        db.session.add(worker)
        db.session.commit()
    return jsonify(data)


# Fetch all day off requests for workers
@app.route('/worker/monthlydayoff/<name>')
def monthlydayoff(name):
    monthly_dayoff = ScheduleDayOff.query.filter_by(name=name).all()
    data = []
    for w in monthly_dayoff:
        data.append(
            {'id': w.id, 'date': w.date, 'name': w.name, 'department': w.department, 'dayoff': w.dayoff,
             'dayoff_approved': w.dayoff_approved, 'dayoff_reject': w.dayoff_reject}
        )
    return jsonify(data)


# Fetch all day off requests for manager
@app.route('/manager/monthlydayoff/<department>')
def mmonthlydayoff(department):
    monthly_dayoff = ScheduleDayOff.query.filter_by(department=department).all()
    data = []
    for w in monthly_dayoff:
        data.append(
            {'id': w.id, 'date': w.date, 'name': w.name, 'department': w.department, 'dayoff': w.dayoff,
             'dayoff_approved': w.dayoff_approved, 'dayoff_reject': w.dayoff_reject}
        )
    return jsonify(data)


# Approve Dayoff
@app.route('/manager/approvesdayoff/<int:id>')
def approvesdayoff(id):
    worker = ScheduleDayOff.query.get(id)
    worker.dayoff_approved = True
    db.session.commit()
    return jsonify({'message': 'Request approved.'})


# Deny Dayoff
@app.route('/manager/denysdayoff/<int:id>')
def denysdayoff(id):
    worker = ScheduleDayOff.query.get(id)
    worker.dayoff_reject = True
    db.session.commit()
    return jsonify({'message': 'Request rejected.'})


# Delete a worker's record from weekly database
@app.route('/worker/deletedayoff/<int:id>')
def delete_dayoff(id):
    worker = ScheduleDayOff.query.get(id)
    db.session.delete(worker)
    db.session.commit()
    message = {'message': 'Deleted!'}
    return jsonify(message)


# Add day off into Monthly table
@app.route('/manager/add_dayoff/<name>/<department>/<date>')
def add_dayoff(name, department, date):
    worker = WorkorDayoff(name=name, department=department, date=date, dayoff=True)
    db.session.add(worker)
    db.session.commit()
    message = {'message': 'Dayoff added!'}
    return jsonify(message)


# Add working day into Monthly table from manager side
@app.route('/manager/add_workday/<name>/<department>')
def add_workingday_manager(name, department):
    worker = WorkorDayoff(name=name, department=department, date=str(time.strftime("%x")).replace('/', '-'),
                          workingday=True)
    db.session.add(worker)
    db.session.commit()
    message = {'message': 'Working day added!'}
    return jsonify(message)


# Add working day into Monthly table from worker side
@app.route('/worker/add_workday/<name>/<department>')
def add_workingday_worker(name, department):
    worker = WorkorDayoff(name=name, department=department, date=str(time.strftime("%x")).replace('/', '-'),
                          workingday=True)
    db.session.add(worker)
    db.session.commit()
    message = {'message': 'Working day added!'}
    return jsonify(message)


# Fetch all monthly details
@app.route('/manager/monthly_details/<department>')
def monthly_details(department):
    monthly_details = WorkorDayoff.query.filter_by(department=department).all()
    data = []
    for w in monthly_details:
        data.append(
            {'id': w.id, 'date': w.date, 'name': w.name, 'department': w.department, 'workingday': w.workingday,
             'dayoff': w.dayoff})
    return jsonify(data)


# Reset monthky records
@app.route('/manager/delete_monthly_details/<department>')
def delete_monthly_details(department):
    monthly_details = WorkorDayoff.query.filter_by(department=department).all()
    for w in monthly_details:
        db.session.delete(w)
        db.session.commit()
    return jsonify({'message': 'Deleted!'})


if __name__ == '__main__':
    app.run(debug=True)
