document.addEventListener('DOMContentLoaded', () => {
    const productNameEl = document.getElementById('productName');
    const productPriceEl = document.getElementById('productPrice');
    const detailImagesEl = document.getElementById('detailImages');
    const reservationForm = document.getElementById('reservationForm');
    const formMessage = document.getElementById('formMessage');

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

    // 예약 폼 제출 처리
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const reserverName = document.getElementById('reserverName').value;
        const quantity = document.getElementById('quantity').value;
        const contact = document.getElementById('contact').value;

        // Google Apps Script URL (아래에서 설정 필요)
        const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_URL'; // 생성 후 삽입

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
            }
        })
        .then(response => {
            if (response.ok) {
                formMessage.textContent = '예약이 성공적으로 완료되었습니다!';
                formMessage.classList.remove('hidden');
                formMessage.style.color = '#2ecc71';
                reservationForm.reset();
                setTimeout(() => formMessage.classList.add('hidden'), 3000);
            } else {
                throw new Error('서버 응답 오류');
            }
        })
        .catch(error => {
            console.error('예약 실패:', error);
            formMessage.textContent = '예약에 실패했습니다. 다시 시도해주세요.';
            formMessage.classList.remove('hidden');
            formMessage.style.color = '#e74c3c';
        });
    });
});
