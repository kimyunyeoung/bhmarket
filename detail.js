document.addEventListener('DOMContentLoaded', () => {
    const productNameEl = document.getElementById('productName');
    const productPriceEl = document.getElementById('productPrice');
    const detailImagesEl = document.getElementById('detailImages');
    const reservationForm = document.getElementById('reservationForm');
    const formMessage = document.getElementById('formMessage');
    const reserveButton = document.getElementById('reserveButton');
    const contactInput = document.getElementById('contact');
    const pickupTimeSelect = document.getElementById('pickupTime');

    // URL 파라미터에서 상품 정보 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const name = decodeURIComponent(urlParams.get('name') || '');
    const price = decodeURIComponent(urlParams.get('price') || '');
    const imagesParam = decodeURIComponent(urlParams.get('images') || '');
    const images = imagesParam ? imagesParam.split(',') : [];

    // 상품 정보 표시
    productNameEl.textContent = name || '상품명 없음';
    productPriceEl.textContent = price ? `가격: ${price}원` : '가격 정보 없음';

    // 상세 이미지 표시
    if (images.length > 0 && images[0] !== '') {
        images.forEach((imageSrc, index) => {
            const img = document.createElement('img');
            img.src = encodeURI(`/static${imageSrc.trim()}`); // 공백 제거
            img.alt = `${name} - 이미지 ${index + 1}`;
            img.onerror = () => {
                console.error(`상세 이미지 로드 실패: ${img.src}`);
                img.src = '/static/images/placeholder.jpg'; // 대체 이미지 (필요 시 추가)
                img.alt = '이미지 로드 실패';
            };
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
        const pickupTime = pickupTimeSelect.value;

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
        if (!pickupTime) {
            formMessage.textContent = '픽업 시간을 선택해주세요.';
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
            pickupTime: pickupTime,
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
                }, 300);
            }, 5000);
        })
        .catch(error => {
            console.error('예약 실패:', error);
            formMessage.textContent = `예약에 실패했습니다: ${error.message}`;
            formMessage.classList.remove('hidden');
            formMessage.classList.add('error');
            setTimeout(() => formMessage.classList.add('hidden'), 3000);
        })
        .finally(() => {
            reserveButton.disabled = false;
            reserveButton.textContent = '예약하기';
        });
    });
});
