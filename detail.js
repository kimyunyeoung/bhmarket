document.addEventListener('DOMContentLoaded', () => {
    const productNameEl = document.getElementById('productName');
    const productPriceEl = document.getElementById('productPrice');
    const detailImagesEl = document.getElementById('detailImages');
    const reservationForm = document.getElementById('reservationForm');
    const formMessage = document.getElementById('formMessage');
    const reserveButton = document.getElementById('reserveButton');

    // URL 파라미터에서 상품 정보 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const name = decodeURIComponent(urlParams.get('name') || '');
    const price = urlParams.get('price') || '';
    const images = decodeURIComponent(urlParams.get('images') || '').split(',');

    // 상품 정보 표시
    productNameEl.textContent = name;
    productPriceEl.textContent = `가격: ${price}원`;

    // 상세 이미지 표시
    if (images.length > 0 && images[0] !== '') {
        images.forEach(imageSrc => {
            const img = document.createElement('img');
            img.src = encodeURI(`/static${imageSrc}`);
            img.alt = name;
            img.onerror = () => console.error(`상세 이미지 로드 실패: ${img.src}`);
            detailImagesEl.appendChild(img);
        });
    } else {
        detailImagesEl.innerHTML = '<p>상세 이미지가 없습니다.</p>';
    }

    // 연락처 유효성 검사 함수
    function isValidContact(contact) {
        const regex = /^010-\d{4}-\d{4}$/;
        return regex.test(contact);
    }

    // 예약 폼 제출 처리
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const reserverName = document.getElementById('reserverName').value.trim();
        const quantity = document.getElementById('quantity').value;
        const contact = document.getElementById('contact').value.trim();

        // 유효성 검사
        if (!reserverName) {
            formMessage.textContent = '예약자 성함을 입력해주세요.';
            formMessage.classList.remove('hidden');
            formMessage.style.color = '#e74c3c';
            return;
        }
        if (!quantity || quantity < 1) {
            formMessage.textContent = '예약 갯수를 1 이상으로 입력해주세요.';
            formMessage.classList.remove('hidden');
            formMessage.style.color = '#e74c3c';
            return;
        }
        if (!contact || !isValidContact(contact)) {
            formMessage.textContent = '연락처를 010-1234-5678 형식으로 입력해주세요.';
            formMessage.classList.remove('hidden');
            formMessage.style.color = '#e74c3c';
            return;
        }

        // 로딩 상태 표시
        reserveButton.disabled = true;
        reserveButton.textContent = '처리 중...';

        // Google Apps Script URL (배포 후 삽입)
        const scriptURL = 'https://script.google.com/macros/s/AKfycbxJ_bPDrnTJbiL89WQfBWlw6nrDD1-8i7s2AG2jxAeNGkqcaFgFvLpRPqxAaGqVvhoC/exec'; // 여기에 실제 URL 입력

        const data = {
            productName: name,
            productPrice: price,
            reserverName: reserverName,
            quantity: quantity,
            contact: contact,
            timestamp: new Date().toLocaleString()
        };

        fetch(scriptURL, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow' // 리디렉션 처리
        })
        .then(response => response.json()) // JSON 응답 파싱
        .then(result => {
            if (result.result === 'success') {
                formMessage.textContent = '예약이 성공적으로 완료되었습니다!';
                formMessage.classList.remove('hidden');
                formMessage.style.color = '#2ecc71';
                reservationForm.reset();
            } else {
                throw new Error(result.message || '서버 오류');
            }
        })
        .catch(error => {
            console.error('예약 실패:', error);
            formMessage.textContent = '예약에 실패했습니다: ' + error.message;
            formMessage.classList.remove('hidden');
            formMessage.style.color = '#e74c3c';
        })
        .finally(() => {
            reserveButton.disabled = false;
            reserveButton.textContent = '예약하기';
            setTimeout(() => formMessage.classList.add('hidden'), 3000);
        });
    });
});
