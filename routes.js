// 상품 목록 조회
router.get('/products', (req, res) => {
    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: '파일을 읽는 중 오류 발생' });
        }
        res.json(JSON.parse(data));
    });
});

// 상품 등록
router.post('/products', (req, res) => {
    const newProduct = req.body;
    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: '파일을 읽는 중 오류 발생: ' + err.message });
        }
        const products = JSON.parse(data);
        products.push(newProduct);
        fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: '파일을 저장하는 중 오류 발생: ' + err.message });
            }
            res.status(201).json(newProduct);
        });
    });
});