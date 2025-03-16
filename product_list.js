document.addEventListener('DOMContentLoaded', () => {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productList = document.getElementById('productList');

    // 요소가 존재하는지 확인
    if (!productList) {
        console.error('productList 요소를 찾을 수 없습니다.');
        return;
    }

    // 상품이 없으면 메시지 표시
    if (products.length === 0) {
        productList.innerHTML = '<li>등록된 상품이 없습니다.</li>';
        return;
    }

    // 상품 렌더링
    products.forEach((product, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${product.name} - 가격: ${product.price}원`;

        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;
        img.style.width = '100px';
        img.style.cursor = 'pointer';
        img.onerror = () => console.error(`${product.name} 이미지 로드 실패`); // 이미지 오류 확인
        img.onclick = () => {
            const popup = window.open('', '_blank', 'width=800,height=600');
            popup.document.write('<h1>상세 이미지</h1>');
            product.detailImages.forEach(detailImage => {
                const detailImg = popup.document.createElement('img');
                detailImg.src = detailImage;
                detailImg.style.width = '100%';
                popup.document.body.appendChild(detailImg);
            });
        };

        listItem.appendChild(img);
        productList.appendChild(listItem);
    });
});