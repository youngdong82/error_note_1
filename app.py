# 서버 구조
from bson import ObjectId
from flask import Flask, render_template, request, jsonify, redirect, url_for
from pymongo import MongoClient # DB 관련
import certifi # DB 보완문제 해결
# 암호화
import jwt
import hashlib

# 환경변수
from dotenv import dotenv_values

# 시간 관련 라이브러리
from datetime import datetime, timedelta

# 환경변수
config = dotenv_values(".env")
SECRET_KEY = config['JWT_SECRET_KEY']
MONGO_ID = config['MONGO_ID']
MONGO_PW = config['MONGO_PW']

# 서버 시작
app = Flask(__name__)
# DB 연결
ca = certifi.where()
client = MongoClient(f'mongodb+srv://{MONGO_ID}:{MONGO_PW}@cluster0.sj0x8tf.mongodb.net/?retryWrites=true&w=majority',tlsCAFile=ca)
db = client.error_note

# --------------------------------------- 페이지 렌더링
# 첫 페이지 by youngdong
@app.route('/')
def render_index():
    token_receive = request.cookies.get('mytoken')
    if token_receive:
        try:
            payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
            user_info = db.users.find_one({"username": payload["id"]})
            return render_template('index.html', user_info=user_info)
        except jwt.ExpiredSignatureError:
            return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
        except jwt.exceptions.DecodeError:
            return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))
    else:
        return redirect('/login')

# 회원가입 페이지 by youngdong
@app.route('/register')
def render_register():
    msg = request.args.get("msg")
    return render_template('register.html', msg=msg)

# 로그인 페이지 by youngdong
@app.route('/login')
def render_login():
    token_receive = request.cookies.get('mytoken')
    if token_receive == None :
        return render_template('login.html')
    else:
        return redirect('/')


# 에러_템플릿 작성 페이지 by siwon
@app.route('/write')
def detail():
    error = list(db.errors.find({}, {'_id': False}))
    return render_template("write.html", error=error)
    
    
# 에러_템플릿 디테일 by siwon + youngdong
@app.route('/error_detail/<error_id>')
def error_detail(error_id):
    return render_template("error_detail.html")

# --------------------------------------- 액션
# 로그인하기 by youngdong
@app.route('/sign_in', methods=['POST'])
def do_login():
    # 로그인
    jsonData = request.json;
    loginId_receive = jsonData['loginId_give']
    loginPw_receive = jsonData['loginPw_give']

    pw_hash = hashlib.sha256(loginPw_receive.encode('utf-8')).hexdigest()
    result = db.users.find_one({'userId': loginId_receive, 'pw': pw_hash})

    if result is not None:
        createdAt = datetime.utcnow() + timedelta(seconds=60 * 60 * 24)  # 로그인 24시간 유지
        payload = {
            'id': loginId_receive,
            'createdAt': str(createdAt)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256').decode('utf8')

        return jsonify({'result': 'success', 'token': token})
    # # 찾지 못하면
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})

# 회원가입하기/회원 정보 저장하기 by youngdong
@app.route('/sign_up/save', methods=['POST'])
def do_sign_up():
    jsonData = request.json
    userId_receive = jsonData['userId_give']
    pw_receive = jsonData['pw_give']
    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()
    doc = {
        "userId": userId_receive,
        "pw": pw_hash,
    }
    db.users.insert_one(doc)
    return jsonify({'result': 'success'})

# 아이디 중복여부 확인하기 by youngdong
@app.route('/sign_up/check_dup', methods=['POST'])
def check_dup():
    jsonData = request.json
    userId_receive = jsonData['userId_give']
    exists = bool(db.users.find_one({"userId": userId_receive}))
    return jsonify({'result': 'success', 'exists': exists})

# 에러_템플릿 디테일 받아오기 by siwon
@app.route("/errors", methods=["GET"])
def error_get():
    messages = []
    errors_list = list(db.error.find())
    for error in errors_list:
        messages.append(error['message'])
    return jsonify({'messages': messages})

# 에러_템플릿 작성하기 by siwon
@app.route("/error_post", methods=["POST"])
def error_post():
    token_receive = request.cookies.get('mytoken')
    try:
        token_data = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_id = token_data['id']
        jsonData = request.json
        created_at = jsonData['createdAt']
        message_receive = jsonData['message_give']
        language_receive = jsonData['language_give']
        situation_receive = jsonData['situation_give']
        solution_receive = jsonData['solution_give']
        note_receive = jsonData['note_give']
        link_receive = jsonData['link_give']

        doc = {
            'user_id': user_id,
            'created_at': created_at,
            'message': message_receive,
            'language': language_receive,
            'state': situation_receive,
            'solution': solution_receive,
            'note': note_receive,
            'link': link_receive
        }
        db.error.insert_one(doc)
        return jsonify({'result': 'success', 'msg': '작성 완료!'})
    except(jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect('/')

# 전체 에러_템플릿 받아오기
@app.route("/get_posts", methods=['GET'])
def get_posts():
    token_receive = request.cookies.get('mytoken')
    user_state = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])['id']
    try:
        # 포스팅 목록 받아오기
        my = request.args['my']
        if my == 'true':
            posts = list(db.error.find({"user_id": user_state},{"link": False, "note": False, "state": False}))
        elif my == 'false':
            posts = list(db.error.find({},{"link": False, "note": False, "state": False}))
        for post in posts:
            post["_id"] = str(post["_id"])
        return jsonify({"result": "success", "msg": "포스팅을 가져왔습니다.", "posts": posts, "user_state": user_state})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))
    except :
        return jsonify({"result": "fail", "msg": "실패" })

# 에러_디테일 보기
@app.route("/get_post/<error_id>", methods=['GET'])
def get_post_error_id(error_id):
    try:
        detail = db.error.find_one({'_id': ObjectId(error_id) }, {'_id': False})
        return jsonify({"result": "success", "msg": "포스팅을 가져왔습니다.", "detail": detail})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))
    except :
        return jsonify({"result": "fail", "msg": "실패" })


# 포트
if __name__ == '__main__':
    app.run('0.0.0.0', port=5500, debug=True)