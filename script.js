document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;

    // 상품 등록 API 호출
    fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: productName, price: productPrice }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('네트워크 응답이 정상이 아닙니다.');
        }
        return response.json();
    })
    .then(data => {
        alert('상품이 등록되었습니다.');
        // 상품 목록 업데이트
    })
    .catch(error => console.error('Error:', error));
});