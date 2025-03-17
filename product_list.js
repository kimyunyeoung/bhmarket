document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('productList');

    if (!productList) {
        console.error('productList 요소를 찾을 수 없습니다.');
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
                img.src = encodeURI(`/static${product.image}`);  // encodeURI 적용
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
                            detailImg.src = encodeURI(`/static${detail.image}`);  // encodeURI 적용
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
