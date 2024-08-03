import cv2
import os
from rembg import remove
from PIL import Image
from werkzeug.utils import secure_filename
from flask import Flask, request, render_template

UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'webp'])

if 'static' not in os.listdir('.'):
    os.mkdir('static')

if 'uploads' not in os.listdir('static/'):
    os.mkdir('static/uploads')

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = "secret key"

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

def remove_background(input_path, output_path):
    input_image = Image.open(input_path)
    output_image = remove(input_image)
    output_image.save(output_path)

@app.route('/homepage.html')
def home():
    return render_template('homepage.html')

@app.route('/page2.html')
def removeBg():
    return render_template('page2.html')

@app.route('/page1.html')
def imageEnhancer():
    return render_template('page1.html')

@app.route('/page3.html')
def textImage():
    return render_template('page3.html')

@app.route('/login.html')
def login():
    return render_template('login.html')




@app.route('/remback', methods=['POST'])
def remback():
    file = request.files['file']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        rembg_img_name = filename.split('.')[0] + "_rembg.png"
        remove_background(UPLOAD_FOLDER + '/' + filename, UPLOAD_FOLDER + '/' + rembg_img_name)
        return render_template('page2.html', org_img_name=filename, rembg_img_name=rembg_img_name)

if __name__ == '__main__':
    app.run(debug=True)
