document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/products')
        .then(response => response.json())
        .then(data => {
            const productList = document.getElementById('productList');
            productList.innerHTML = ''; // 기존 목록 제거
            data.forEach(product => {
                const listItem = document.createElement('li');
                listItem.textContent = `${product.name} - 가격: ${product.price}원`;
                productList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error:', error));
});