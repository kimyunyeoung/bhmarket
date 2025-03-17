document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('productList');
    const themeToggle = document.getElementById('themeToggle');

    if (!productList) {
        console.error('productList 요소를 찾을 수 없습니다.');
        return;
    }

    // 다크 모드 토글
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        themeToggle.textContent = document.body.classList.contains('dark') ? '라이트 모드' : '다크 모드';
    });

    // 영업시간 체크 함수
    function isBusinessOpen() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const day = now.getDay();
        const currentTime = hours * 60 + minutes;

        const weekdayOpen = 11 * 60;
        const weekdayClose = 20 * 60;
        const weekendOpen = 11 * 60;
        const weekendClose = 18 * 60;

        if (day >= 1 && day <= 5) {
            return currentTime >= weekdayOpen && currentTime < weekdayClose;
        } else if (day === 6 || day === 0) {
            return currentTime >= weekendOpen && currentTime < weekendClose;
        }
        return false;
    }

    if (!isBusinessOpen()) {
        productList.innerHTML = `
            <li class="closed">
                <strong>영업이 종료되었습니다.</strong><br>
                <p>영업시간 안내:</p>
                <p>평일: 11:00 ~ 20:00</p>
                <p>주말: 11:00 ~ 18:00</p>
            </li>
        `;
        return;
    }

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
                img.onerror = () => console.error(`${product.name} 이미지 로드 실패: ${img.src}`);
                img.onclick = () => {
                    const popup = window.open('', '_blank', 'width=800,height=600');
                    popup.document.write('<h1>상세 이미지</h1><style>body { background: #f0f2f5; text-align: center; }</style>');
                    if (product.detailImages && product.detailImages.length > 0) {
                        product.detailImages.forEach(detail => {
                            const detailImg = popup.document.createElement('img');
                            detailImg.src = encodeURI(`/static${detail.image}`);
                            detailImg.style.width = '80%';
                            detailImg.style.margin = '10px auto';
                            detailImg.style.display = 'block';
                            popup.document.body.appendChild(detailImg);
                        });
                    }
                };

                listItem.insertBefore(img, listItem.firstChild); // 이미지를 텍스트 위로
                productList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('상품 목록 로드 실패:', error.message);
            productList.innerHTML = `<li>상품 목록을 불러오는 데 실패했습니다: ${error.message}</li>`;
        });
});
