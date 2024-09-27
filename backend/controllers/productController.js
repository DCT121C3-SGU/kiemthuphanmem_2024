

// function for add product
const addProduct = async(req, res) => {
    try {
        console.log(req.files); // Log the entire req.files object

        const { name, description, price, category, sizes, bestseller } = req.body;

        if (!req.files || !req.files.image1 || !req.files.image2 || !req.files.image3 || !req.files.image4) {
            return res.json({ success: false, message: 'Files not uploaded correctly' });
        }

        const image1 = req.files.image1[0];
        const image2 = req.files.image2[0];
        const image3 = req.files.image3[0];
        const image4 = req.files.image4[0];

        console.log(name, description, price, category, sizes, bestseller);
        console.log(image1, image2, image3, image4);
        res.json({});
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


// function for list product
const listProduct = async(req, res) => {

}

// function for remove product
const removeProduct = async(req, res) => {

}

// function for single product
const singleProduct = async(req, res) => {

}

export { listProduct, addProduct, removeProduct, singleProduct }

