document.addEventListener('DOMContentLoaded', () => {
    const productNameEl = document.getElementById('productName');
    const productPriceEl = document.getElementById('productPrice');
    const detailImagesEl = document.getElementById('detailImages');

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
});