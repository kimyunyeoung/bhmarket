// 로컬 스토리지에서 상품 목록 가져오기
const products = JSON.parse(localStorage.getItem('products')) || [];

// 폼 제출 이벤트 리스너 등록
document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 기본 폼 제출 방지

    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productImage = document.getElementById('productImage').files[0];
    const productDetailImages = document.getElementById('productDetailImages').files;

    // 중복 등록 방지: 상품명이 같은 경우 알림
    const existingProduct = products.find(product => product.name === productName);
    if (existingProduct) {
        alert('이미 등록된 상품입니다.');
        return; // 중복 등록 방지
    }

    // 대표 이미지 파일을 Base64로 변환
    const reader = new FileReader();
    reader.onloadend = () => {
        const detailImagesArray = Array.from(productDetailImages).map(file => {
            const detailReader = new FileReader();
            detailReader.readAsDataURL(file);
            return new Promise((resolve) => {
                detailReader.onloadend = () => resolve(detailReader.result);
            });
        });

        Promise.all(detailImagesArray).then(detailImages => {
            // 새 상품 추가
            products.push({
                name: productName,
                price: parseInt(productPrice),
                image: reader.result,
                detailImages: detailImages
            });
            
            // 로컬 스토리지에 저장
            localStorage.setItem('products', JSON.stringify(products));

            // 입력 필드 초기화
            document.getElementById('productName').value = '';
            document.getElementById('productPrice').value = '';
            document.getElementById('productImage').value = '';
            document.getElementById('productDetailImages').value = '';

            alert('상품이 등록되었습니다!');

            // 목록 업데이트
            renderProducts();
        });
    };
    reader.readAsDataURL(productImage); // 이미지를 Base64로 변환
});

// 상품 목록을 렌더링하는 함수
function renderProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // 기존 목록 제거

    products.forEach((product, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${product.name} - 가격: ${product.price}원`;

        // 대표 이미지 추가
        const img = document.createElement('img');
        img.src = product.image; // Base64로 저장된 대표 이미지
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

        // 삭제 버튼 생성
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '삭제';
        deleteButton.onclick = () => {
            // 상품 삭제
            products.splice(index, 1); // 배열에서 상품 삭제
            localStorage.setItem('products', JSON.stringify(products)); // 로컬 스토리지 업데이트
            renderProducts(); // 목록 다시 렌더링
        };

        listItem.appendChild(img);
        listItem.appendChild(deleteButton);
        productList.appendChild(listItem);
    });
}

// 페이지 로드 시 상품 목록 렌더링
document.addEventListener('DOMContentLoaded', renderProducts);