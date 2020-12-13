# Clock Wisdom

## Overview

Many field workers do not have an efficient way to keep track of their working time. This application allows employees to clock in, clock out, request/schedule days off and view their working hours and how much they've made so far. A manager can use this application to add and keep track of workers salary information.

## Getting Started

1. Clone the repoistory
2. Open a new terminal navigate Flask/attendanceApp
3. On the terminal type 'pip install -r requirements.txt' or 'pip3 install -r requirements.txt' to install the requirements for Flask.
4. Type 'app.py' or 'python app.py' or 'python3 app.py' in the same terminal and press enter to start the flask.
5. Now navigate to React/attendanceapp in a new terminal.
6. Type 'npm install' in the terminal and press enter to install all the necessary dependencies.
7. Type 'npm start' in the terminal and press enter to launch the web app.

## Requirements

Backend Technologies:
click
Flask
SQLAlchemy
itsdangerous
Jinja2
MarkupSafe
Werkzeug

Frontend Technologies:
React

## Data Model

## Site Map

## Use Stories or Use Cases

1. A user must first log in as either a manager or a worker
2. A manager can add new worker, approve/deny sick days, pay workers, set worker salaries, and view information by daily details, weekly details, and monthly details
3. A worker can clock-in, clock-out, start lunch, end lunch, calculate their salary, request the current day off, schedule day offs and view day off status

## References Used

https://blog.alexdevero.com/react-express-sqlite-app/ (Project structure ideas)

https://stackoverflow.com/questions/13192643/is-it-possible-to-access-an-sqlite-database-from-javascript (Connecting Sqlite from HTML components)

https://flask.palletsprojects.com/en/1.1.x/errorhandling/ (General Flask error handling)

https://stackoverflow.com/questions/21689364/method-not-allowed-flask-error-405/21689599 (Flask Method Not Allowed error)

https://www.fullstackpython.com/flask-json-jsonify-examples.html (Jsonify fullstack tutorial)

https://cloud.google.com/storage/docs/json_api/v1/status-codes (Jsonify error handling)

https://www.programiz.com/python-programming/time (Time module in Python)

https://flask.palletsprojects.com/en/1.1.x/patterns/sqlite3/ (Source to start Sqlite)

https://stackoverflow.com/questions/25371636/how-to-get-sqlite-result-error-codes-in-python (Sqlite error handling)

https://www.sqlitetutorial.net/sqlite-python/delete/ (Deleting data from Sqlite)

https://click.palletsprojects.com/en/7.x/ (Click Python documentation)

https://stackoverflow.com/questions/21692387/jinja2-exception-handling (Jinja2 error handling)

## Authors

- rav91 - Ravid Rahman
- tislam35 - Tohidul Islam
- CChariot - Lihan Zhan
