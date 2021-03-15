//routes/home.js
var express = require('express');
var router = express.Router(); // express.Router()를 사용해서 router함수를 초기화 한다.

//home
router.get('/', fucntion(req, res){ // app.get에서 router.get으로 바뀌 것만 빼면 이전 코드와 동일
  // "/"에 get요청이 오는 경우를 router함수에 설정해 준다.
  res.redirect('/contacts');
});

module.exports = router; // module.exports에 담긴 object(여기서는 router object)가 module이 되어 require시에 사용된다.
