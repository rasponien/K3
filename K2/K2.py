from flask import Flask, render_template, request, json
import os

app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template('index.html')

@app.route('/textFiltering', methods=['GET'])
def signUpUser():
    filterText = request.args['filterText']
    return readFile(filterText)


def readFile(filterText):
    textList = []
    with app.open_resource('static/files/text.txt') as f:
        for line in f:
            line = line.strip().decode("utf-8").strip()
            if filterText in line:
                textList.append({'keyword' : line})
    f.close()
    return json.dumps(textList)


if __name__ == '__main__':
    app.run()
