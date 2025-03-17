document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('productList');

    if (!productList) {
        console.error('productList 요소를 찾을 수 없습니다.');
        return;
    }

    // 영업시간 체크 함수
    function isBusinessOpen() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const day = now.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
        const currentTime = hours * 60 + minutes; // 현재 시간을 분 단위로 변환

        // 평일: 11:00 (660분) ~ 20:00 (1200분)
        const weekdayOpen = 11 * 60; // 660
        const weekdayClose = 20 * 60; // 1200

        // 주말: 11:00 (660분) ~ 18:00 (1080분)
        const weekendOpen = 11 * 60; // 660
        const weekendClose = 18 * 60; // 1080

        // 평일 (월~금: 1~5)
        if (day >= 1 && day <= 5) {
            return currentTime >= weekdayOpen && currentTime < weekdayClose;
        }
        // 주말 (토~일: 6, 0)
        else if (day === 6 || day === 0) {
            return currentTime >= weekendOpen && currentTime < weekendClose;
        }
        return false; // 예외 처리
    }

    // 영업 종료 시 메시지 표시
    if (!isBusinessOpen()) {
        productList.innerHTML = `
            <li class="closed">
                <strong>영업이 종료되었습니다.</strong><br>
                <p>영업시간 안내:</p>
                <p>평일: 11:00 ~ 20:00</p>
                <p>주말: 11:00 ~ 18:00</p>
            </li>
        `;
        return; // 더 이상 진행하지 않음
    }

    // 영업 중일 때 상품 목록 로드
    fetch('/static/data/products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP 오류: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const products = data.products || [];
            if (products.length === 0) {
                productList.innerHTML = '<li>등록된 상품이 없습니다.</li>';
                return;
            }

            products.forEach(product => {
                const listItem = document.createElement('li');
                listItem.textContent = `${product.name} - 가격: ${product.price}원`;

                const img = document.createElement('img');
                img.src = encodeURI(`/static${product.image}`);
                img.alt = product.name;
                img.style.width = '100px';
                img.style.cursor = 'pointer';
                img.onerror = () => console.error(`${product.name} 이미지 로드 실패: ${img.src}`);
                img.onclick = () => {
                    const popup = window.open('', '_blank', 'width=800,height=600');
                    popup.document.write('<h1>상세 이미지</h1>');
                    if (product.detailImages && product.detailImages.length > 0) {
                        product.detailImages.forEach(detail => {
                            const detailImg = popup.document.createElement('img');
                            detailImg.src = encodeURI(`/static${detail.image}`);
                            detailImg.style.width = '100%';
                            popup.document.body.appendChild(detailImg);
                        });
                    }
                };

                listItem.appendChild(img);
                productList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('상품 목록 로드 실패:', error.message);
            productList.innerHTML = `<li>상품 목록을 불러오는 데 실패했습니다: ${error.message}</li>`;
        });
});
