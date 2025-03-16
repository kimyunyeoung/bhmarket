const products = JSON.parse(localStorage.getItem('products')) || [];

document.getElementById('productForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productImage = document.getElementById('productImage').files[0];
    const detailFiles = document.getElementById('productDetailImages').files;

    if (products.find(p => p.name === productName)) {
        alert('이미 등록된 상품입니다.');
        return;
    }

    const readFile = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
        });
    };

    const image = await readFile(productImage);
    const detailImages = await Promise.all(Array.from(detailFiles).map(readFile));

    products.push({ name: productName, price: parseInt(productPrice), image, detailImages });
    localStorage.setItem('products', JSON.stringify(products));
    document.getElementById('productForm').reset();
    alert('상품이 등록되었습니다!');
    renderProducts();
});

function renderProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    products.forEach((product, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${product.name} - 가격: ${product.price}원`;

        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;
        img.style.width = '100px';
        img.style.cursor = 'pointer';
        img.onclick = () => {
            const popup = window.open('', '_blank', 'width=600,height=400');
            popup.document.write('<h1>상세 이미지</h1>');
            product.detailImages.forEach(detailImage => {
                const detailImg = popup.document.createElement('img');
                detailImg.src = detailImage;
                detailImg.style.width = '100%';
                popup.document.body.appendChild(detailImg);
            });
        };

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '삭제';
        deleteButton.onclick = () => {
            products.splice(index, 1);
            localStorage.setItem('products', JSON.stringify(products));
            renderProducts();
        };

        listItem.appendChild(img);
        listItem.appendChild(deleteButton);
        productList.appendChild(listItem);
    });
}

document.addEventListener('DOMContentLoaded', renderProducts);