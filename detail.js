document.addEventListener('DOMContentLoaded', () => {
    const productNameEl = document.getElementById('productName');
    const productPriceEl = document.getElementById('productPrice');
    const detailImagesEl = document.getElementById('detailImages');
    const reservationForm = document.getElementById('reservationForm');
    const formMessage = document.getElementById('formMessage');
    const reserveButton = document.getElementById('reserveButton');
    const contactInput = document.getElementById('contact');

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

    // 연락처 자동 하이픈 추가
    contactInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 3 && value.length <= 7) {
            value = `${value.slice(0, 3)}-${value.slice(3)}`;
        } else if (value.length > 7) {
            value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
        }
        e.target.value = value;
    });

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
        const contact = contactInput.value.trim();

        // 유효성 검사
        if (!reserverName) {
            formMessage.textContent = '예약자 성함을 입력해주세요.';
            formMessage.classList.remove('hidden');
            formMessage.classList.add('error');
            return;
        }
        if (!quantity || quantity < 1) {
            formMessage.textContent = '예약 갯수를 1 이상으로 입력해주세요.';
            formMessage.classList.remove('hidden');
            formMessage.classList.add('error');
            return;
        }
        if (!contact || !isValidContact(contact)) {
            formMessage.textContent = '연락처를 010-1234-5678 형식으로 입력해주세요.';
            formMessage.classList.remove('hidden');
            formMessage.classList.add('error');
            return;
        }

        // 로딩 상태 표시
        reserveButton.disabled = true;
        reserveButton.textContent = '처리 중...';

        // Google Apps Script URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbz4_xxJfKHyj__omcR17vHCB1VEITuB9a0d-ARa_2kn4hW929uLASAbp-pDDEv-zn1_/exec';

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
            mode: 'no-cors',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(() => {
            formMessage.textContent = '예약이 성공적으로 완료되었습니다!';
            formMessage.classList.remove('hidden', 'error');
            reservationForm.reset();
            setTimeout(() => {
                formMessage.style.opacity = '0';
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 300); // 페이드아웃 후 이동
            }, 5000); // 5초 후 메시지 사라짐
        })
        .catch(error => {
            console.error('예약 실패:', error);
            formMessage.textContent = `예약에 실패했습니다: ${error.message}`;
            formMessage.classList.remove('hidden');
            formMessage.classList.add('error');
            setTimeout(() => formMessage.classList.add('hidden'), 3000); // 실패 메시지도 3초 후 사라짐
        })
        .finally(() => {
            reserveButton.disabled = false;
            reserveButton.textContent = '예약하기';
        });
    });
});
