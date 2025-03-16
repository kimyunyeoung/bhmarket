document.addEventListener('DOMContentLoaded', () => {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productList = document.getElementById('productList');
    
    products.forEach(product => {
        const listItem = document.createElement('li');
        listItem.textContent = `${product.name} - 가격: ${product.price}원`;
        
        const img = document.createElement('img');
        img.src = product.image; // Base64로 저장된 이미지
        img.alt = product.name;
        img.style.width = '100px'; // 이미지 크기 조정
        img.style.cursor = 'pointer'; // 클릭 가능 표시
        img.onclick = () => {
            // 상세 이미지 팝업
            const detailImages = product.detailImages;
            const popup = window.open('', '_blank', 'width=600,height=400');
            popup.document.write('<h1>상세 이미지</h1>');
            detailImages.forEach(detailImage => {
                const detailImg = popup.document.createElement('img');
                detailImg.src = detailImage;
                detailImg.style.width = '100%'; // 팝업 내에서 이미지 크기 조정
                popup.document.body.appendChild(detailImg);
            });
        };

        listItem.appendChild(img);
        productList.appendChild(listItem);
    });
});