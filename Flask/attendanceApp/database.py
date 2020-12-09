from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, Boolean, Float

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///workers.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)


# Table for storing Workers detail
class WorkerDetails(db.Model):
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False)
    salary_hour = Column(Integer, nullable=True)
    salary = Column(Float, nullable=True)
    salary_paid = Column(Boolean, nullable=True)
    clockin = Column(String(100), nullable=True)
    clockout = Column(String(100), nullable=True)
    lunchstart = Column(String(100), nullable=True)
    lunchend = Column(String(100), nullable=True)
    dayoff = Column(String(100), nullable=True)
    dayoff_approved = Column(Boolean, nullable=True)
    dayoff_denyed = Column(Boolean, nullable=True)

    # Representation of database entry
    def __repr__(self):
        return self.name


# Table for storing Weekly detail
class WorkersWeeklyDetails(db.Model):
    id = Column(Integer, primary_key=True)
    date = Column(String(100), nullable=True)
    name = Column(String(100), nullable=True)
    department = Column(String(100), nullable=True)
    salary_hour = Column(Integer, nullable=True)
    salary = Column(Float, nullable=True)
    salary_paid = Column(Boolean, nullable=True)
    time = Column(Float, nullable=True)
    dayoff_approved = Column(Boolean, nullable=True)
    dayoff_reject = Column(Boolean, nullable=True)

    def __repr__(self):
        return self.name


# Table for storing ScheduleDayoff
class ScheduleDayOff(db.Model):
    id = Column(Integer, primary_key=True)
    date = Column(String(100), nullable=True)
    name = Column(String(100), nullable=True)
    department = Column(String(100), nullable=True)
    dayoff = Column(String(100), nullable=True)
    dayoff_approved = Column(Boolean, nullable=True)
    dayoff_reject = Column(Boolean, nullable=True)

    def __repr__(self):
        return self.name


# Table for storing Work/Dayoff
class WorkorDayoff(db.Model):
    id = Column(Integer, primary_key=True)
    date = Column(String(100), nullable=True)
    name = Column(String(100), nullable=True)
    department = Column(String(100), nullable=True)
    workingday = Column(Boolean, nullable=True)
    dayoff = Column(Boolean, nullable=True)

    def __repr__(self):
        return self.name

# for creating database with the defined Model.
# db.create_all()
# adding a worker to database
# worker = WorkerDetails(name='Ibad', department='abc', salary=500, clockin=str(datetime.now()))
# db.session.add(worker)
# db.session.commit()
# fetching all records
# workers = WorkerDetails.query.all()
# for w in workers:
#     print(w.id)
#     print(w.name)
#     print(w.department)
#     print(w.salary)
#     print(w.clockin)
#     print(w.dayoff_denyed)
