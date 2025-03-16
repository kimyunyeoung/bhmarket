const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // 포트 번호를 환경 변수로 설정

// 미들웨어 설정
app.use(bodyParser.json());
app.use(express.static('public')); // 정적 파일 제공

// 상품 등록 및 목록 조회 라우팅
const productRoutes = require('./routes');
app.use('/api', productRoutes);

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
}, (err) => {
    console.error('서버 시작 실패:', err);
});