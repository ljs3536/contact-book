// index.js

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser'); // body-parser module을 bodyparser 변수에 담는다
var app = express();

// DB setting
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//node.js에서 기본으로 제공되는 process.env 오브젝트는 환경변수들을 가지고 있는 객체.
//환경변수를 MONGO_DB라는 이름으로 저장하였기 때문에 node.js 코드상에서 process.env.MONGO_DB로 해당 값을 불러올 수 있다.
mongoose.connect(process.env.MONGO_DB);

//mongoose의 db object를 가져와 db변수에 넣는 과정이다.
var db = mongoose.connection;

// db가 성공적으로 연결될경우 DB Connected 출력
// db연결은 앱이 실행되면 단 한번만 일어나는 이벤트이다. 그러므로 db.once 함수를 사용했고,
//error는 db접속 시 뿐만 아니라, 다양한 경우에 발생할 수 있기 때문에 db.on 함수를 사용한다.
db.once('open', function(){
  console.log('DB connected');
});

//db 연결 중 에러가 있는 경우 "DB ERROR :" 와 에러를 출력한다.
db.on('error', function(err){
  console.log('DB ERROR : ', err);
});

// Other settings
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json()); // json형식의 데이터를 받는다는 설정
app.use(bodyParser.urlencoded({extended:true})); // urlencoded data를 extended 알고리즘을 사용해서 분석한다는 설정

// DB schema
// mongoose.Schema 함수로 DB에서 사용할 Schema를 설정한다. 데이터베이스에 정보를 어떠한 형식으로 저장할 지를 지정해주는 부분이다.
var contactSchema = mongoose.Schema({
  // name은 반드시 입력되어야 하며(required), 값이 중복되면 안된다(unique)는 추가설정이 있다.
  name:{type:String, required:true, unique:true},
  email:{type:String},
  phone:{type:String}
  //위에서는 String만 사용했지만, 필요에 따라 Number, Date, Boolean 등 다양한 타입들을 설정할 수 있다.
});

//mongoose.model 함수를 사용하여 contact schema의 model을 생성한다.
//mongoose.model 함수의 첫번째 parameter는 mongoDB에서 사용되는 콜렉션의 이름이며, 두번째는 mongoose.Schema로 생성된 오브젝트이다.
//DB에 있는 contact라는 데이터 콜렉션을 현재 코드의 Contact라는 변수에 연결해 주는 역할을 한다.
var Contact = mongoose.model('contact', contactSchema);
//생성된 Contact Object는 mongoDB의 contact collection의 model이며 DB에 접근하여 data를 변경할 수 있는 함수들을 가지고 있다.
// DB에 contact라는 콜렉션이 미리 존재하지 않더라도 Mongoose가 없는 콜렉션을 알아서 생성한다.

// Routes
// Home // "/"에 get 요청이 오는 경우 : /contacts로 redirect하는 코드
app.get('/', function(req, res){
  res.redirect('/contacts');
});
// Contacts - Index // "/contacts"에 get 요청이 오는 경우 : 에러가 있다면 에러를 json형태로 웹브라우저에 표시하고, 에러가 없다면 검색 결과를 받아
// views/contacts/index.ejs를 render(페이지를 다이나믹하게 제작)한다.
app.get('/contacts', function(req, res){
  Contact.find({}, function(err, contacts){
    if(err) return res.json(err);
    res.render('contacts/index', {contacts:contacts});
  });
});
// Contacts - New
// "/contacts/new"에 get 요청이 오는 경우 : 새로운 주소록을 만드는 form이 있는 views/contacts/new.ejs를 render 한다.
app.get('/contacts/new', function(req, res){
  res.render('contacts/new');
});
// Contacts - create
// "/contacts"에 post 요청이 오는 경우 : "/contacts/new"에서 폼을 전달받는 경우
app.post('/contacts', function(req, res){
  Contact.create(req.body, function(err, contact){
    if(err) return res.json(err);
    res.redirect('/contacts');
  });
});

// Port setting
var port = 3000;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});
