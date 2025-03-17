fetch('/data/products.json')
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
        // 나머지 코드 동일
    })
    .catch(error => {
        console.error('상품 목록 로드 실패:', error.message);
        productList.innerHTML = `<li>상품 목록을 불러오는 데 실패했습니다: ${error.message}</li>`;
    });
