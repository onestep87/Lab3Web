import sqlite3
import click
import flask

from flask import Flask, jsonify, request
from flask import config
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import backref
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///local_db.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)

class Config(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    num_of_btns = db.Column(db.Integer, nullable = False)

    def __init__(self, num_of_btns):
        self.num_of_btns = num_of_btns

    def __repr__(self):
        return '<Config %r>' % self.id

class Button(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    num_of_rows = db.Column(db.Integer, nullable = False)

    config_id = db.Column(db.Integer, db.ForeignKey('config.id'))
    cfg = db.relationship('Config')

    def __init__(self, config, num_of_rows):
        self.cfg = config
        self.num_of_rows = num_of_rows
        pass


class Field(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable = False)
    
    button_id = db.Column(db.Integer, db.ForeignKey('button.id'))
    btn = db.relationship('Button')

    def __init__(self, content, button):
        self.content = content
        self.btn = button

    def __repr__(self):
        return '<Field %r>' % self.id



@app.route('/config/create/<num_of_btns>', methods=['GET'])
def create_config(num_of_btns):
    config = Config(num_of_btns)
    db.session.add(config)
    db.session.commit()
    return {"id" : config.id}


@app.route('/config/num_btns_by_id/<cfg_id>')
def get_number_by_config(cfg_id):
    # returns number of rows
    config = Config.query.filter_by(id=cfg_id).first()
    
    return {"num_of_btns" : config.num_of_btns}

# insert btn by config and create all the fields
@app.route('/button/insert/<cfg_id>/<num_of_fields>')
def insert_button(cfg_id, num_of_fields):
    cfg = Config.query.filter_by(id=cfg_id).first()
    
    # create button
    btn = Button(cfg, num_of_fields)

    db.session.add(btn)
    db.session.commit()

    # push empty fields as requeires "num_of_fields" var
    ret = []
    for i in range(int(num_of_fields)):
        f = Field('', btn)
        db.session.add(f)
        db.session.commit()
        ret.append(f.id)

    return jsonify({'btn_id': btn.id, 'field_ids' : list(ret)})

# update field by field id
@app.route('/field/update/<field_id>/<content>')
def update_field(field_id, content):
    fld = Field.query.filter_by(id=field_id).first()
    fld.content = str(content)
    db.session.commit()
    return {'updated' : True, 'new_value' : content}



# get config
# returns config id, button ids and all the fields in them
# {
#   cfg_id : 1, btns: 
#   [{btn_id : 1, 
#       fields: 
#           [field_id:1, content: "content1"]}, 
#   ...other buttons]
# }
#

@app.route('/config/get/<cfg_id>')
def get_config(cfg_id):
    btn = Config.query.filter_by(id = cfg_id).first()

    ret = {'cfg_id' : cfg_id, 'num_of_buttons' : btn.num_of_btns,  'btns' : []}

    btns = list(Button.query.filter_by(config_id = cfg_id))
    for btn in btns:
        fields = list(Field.query.filter_by(button_id = btn.id))

        fields_content = []
        for field in fields:
            fields_content.append({'content' : field.content, 'field_id' : field.id})
        ret['btns'].append({'btn_id' : btn.id, 'fields' : fields_content})

    return ret



if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)


"""
@app.route('/field/add/<cfg_id>/<btn_id>/<content>')
def insert_field(cfg_id, content):
    # inserts the row for the special config
    config = Config.query.filter_by(id=cfg_id).first()
    field = Field(content, config)
    db.session.add(field)
    db.session.commit()
    return {"content" : field.content}


@app.route('/config/get_hole/<cfg_id>')
def get_config(cfg_id):
    ret = {'cfg_id' : cfg_id, 'fields' : []}
    c = Config.query.filter_by(id = cfg_id).first()

    fields = Field.query.filter_by(cfg = c).all()
    for field in fields:
        ret['fields'].append(field.content)
    return ret

db.create_all()
app.run(debug=True)
"""