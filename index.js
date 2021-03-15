// index.js

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser'); // body-parser module을 bodyparser 변수에 담는다
var methodOverride = require('method-override'); //method-override module을 methodOverride 변수에 담는다.
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
app.use(methodOverride('_method'));
// _method의 query로 들어오는 값으로 HTTP method를 바꾼다.
// 예를 들어 id?_method=delete를 받으면 _method의 값인 delete를 읽어 해당 request의 HTTP method를 delete로 바꾼다.

// Routes
app.use('/', require('./routes/home')); // app.use('route',콜백_함수)는 해당 route에 요청이 오는 경우에만 콜백함수를 호출한다.
app.use('/contacts', require('./routes/contacts'));



// // DB schema
// // mongoose.Schema 함수로 DB에서 사용할 Schema를 설정한다. 데이터베이스에 정보를 어떠한 형식으로 저장할 지를 지정해주는 부분이다.
// var contactSchema = mongoose.Schema({
//   // name은 반드시 입력되어야 하며(required), 값이 중복되면 안된다(unique)는 추가설정이 있다.
//   name:{type:String, required:true, unique:true},
//   email:{type:String},
//   phone:{type:String}
//   //위에서는 String만 사용했지만, 필요에 따라 Number, Date, Boolean 등 다양한 타입들을 설정할 수 있다.
// });
//
// //mongoose.model 함수를 사용하여 contact schema의 model을 생성한다.
// //mongoose.model 함수의 첫번째 parameter는 mongoDB에서 사용되는 콜렉션의 이름이며, 두번째는 mongoose.Schema로 생성된 오브젝트이다.
// //DB에 있는 contact라는 데이터 콜렉션을 현재 코드의 Contact라는 변수에 연결해 주는 역할을 한다.
// var Contact = mongoose.model('contact', contactSchema);
// //생성된 Contact Object는 mongoDB의 contact collection의 model이며 DB에 접근하여 data를 변경할 수 있는 함수들을 가지고 있다.
// // DB에 contact라는 콜렉션이 미리 존재하지 않더라도 Mongoose가 없는 콜렉션을 알아서 생성한다.

// // Routes
// // Home // "/"에 get 요청이 오는 경우 : /contacts로 redirect하는 코드
// app.get('/', function(req, res){
//   res.redirect('/contacts');
// });
// // Contacts - Index // "/contacts"에 get 요청이 오는 경우 : 에러가 있다면 에러를 json형태로 웹브라우저에 표시하고, 에러가 없다면 검색 결과를 받아
// // views/contacts/index.ejs를 render(페이지를 다이나믹하게 제작)한다.
// app.get('/contacts', function(req, res){
//   Contact.find({}, function(err, contacts){
//     if(err) return res.json(err);
//     res.render('contacts/index', {contacts:contacts});
//   });
// });
// // Contacts - New
// // "/contacts/new"에 get 요청이 오는 경우 : 새로운 주소록을 만드는 form이 있는 views/contacts/new.ejs를 render 한다.
// app.get('/contacts/new', function(req, res){
//   res.render('contacts/new');
// });
// // Contacts - create
// // "/contacts"에 post 요청이 오는 경우 : "/contacts/new"에서 폼을 전달받는 경
// app.post('/contacts', function(req, res){
//   Contact.create(req.body, function(err, contact){
//     if(err) return res.json(err);
//     res.redirect('/contacts');
//   });
// });
//
// // Contacts - show
// // "/contacts/:id"에 get 요청이 오는 경우 해당 id를 가진 정보를 DB에서 찾아 views/contacts/show.ejs를 반환한다.
// app.get('/contacts/:id', function(req, res){
//   Contact.findOne({_id:req.params.id}, function(err, contact){
//     if(err) return res.json(err);
//     res.render('contacts/show', {contact:contact});
//   });
// });
// // Contacts - edit
// // "contacts:/id/edit"에 요청이 오는 경우
// //Model.findOnde이 다시 사용되어 검색 결과를 받아 views/contacts/edit.ejs를 render한다.
// app.get('/contacts/:id/edit', function(req, res){
//   Contact.findOne({_id:req.params.id}, function(err, contact){
//     if(err) return res.json(err);
//     res.render('contacts/edit', {contact:contact});
//   });
// });
// // Contacts - update
// // "contacts/:id"에 put요청이 오는 경우 DB에서 해당 model의 document를 하나 찾아 그 data를 수정한다.
// app.put('/contacts/:id', function(req, res){
//   Contact.findOneAndUpdate({_id:req.params.id}, req.body, function(err, contact){
//     if(err) return res.json(err);
//     res.redirect('/contacts/'+req.params.id);
//   });
// });
// // Contacts - destroy
// // DB에서 해당 model의 document를 하나 찾아 삭제한다.
// app.delete('/contacts/:id', function(req, res){
//   Contact.deleteOne({_id:req.params.id}, function(err){
//     if(err) return res.json(err);
//     res.redirect('/contacts');
//   });
// });

// Port setting
var port = 3000;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});
