import { expect } from 'chai';
import sinon from 'sinon';
import cloudinary from 'cloudinary';
import productModel from '../../models/productModel.js';
import { addProduct } from '../../controllers/productController.js';

describe('addProduct with mocked Cloudinary', () => {
    let req, res, saveStub, uploadStub;

    beforeEach(() => {
        req = {
            body: {
                name: 'Test Product',
                description: 'This is a test product',
                price: '200',
                category: 'Test Category',
                bestseller: 'false',
                quantity: '20',
            },
            files: {
                image1: [{ path: 'path/to/image1.jpg' }],
                image2: [{ path: 'path/to/image2.jpg' }],
            },
        };
        res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

        uploadStub = sinon.stub(cloudinary.uploader, 'upload');
        uploadStub
            .onFirstCall()
            .resolves({ secure_url: 'https://mocked.cloudinary.com/image1.jpg', public_id: 'mocked_image1' });
        uploadStub
            .onSecondCall()
            .resolves({ secure_url: 'https://mocked.cloudinary.com/image2.jpg', public_id: 'mocked_image2' });

        saveStub = sinon.stub(productModel.prototype, 'save').resolves();
    });

    afterEach(() => {
        uploadStub.restore();
        saveStub.restore();
    });

    it('should upload mocked images to Cloudinary and save product', async () => {
        await addProduct(req, res);
    
        expect(uploadStub.calledTwice).to.be.true;
        expect(uploadStub.firstCall.args[0]).to.equal('path/to/image1.jpg');
        expect(uploadStub.secondCall.args[0]).to.equal('path/to/image2.jpg');

        const expectedProductData = {
            name: 'Test Product',
            description: 'This is a test product',
            price: 200,
            category: 'Test Category',
            bestseller: false,
            images: [
                { url: 'https://mocked.cloudinary.com/image1.jpg', public_id: 'mocked_image1' },
                { url: 'https://mocked.cloudinary.com/image2.jpg', public_id: 'mocked_image2' },
            ],
            date: sinon.match.number,
            quantity: 20,
        };
    
        expect(saveStub.calledOnce).to.be.true;
        expect(saveStub.firstCall.thisValue.name).to.equal(expectedProductData.name);

        const actualImages = saveStub.firstCall.thisValue.images.map(img => ({
            url: img.url,
            public_id: img.public_id
        }));
    
        expect(actualImages).to.deep.equal(expectedProductData.images);
        expect(res.json.calledWith({ success: true, message: 'Thêm sản phẩm thành công!' })).to.be.true;
    });
    

    it('should fail when no images are provided', async () => {
        req.files = {};
    
        await addProduct(req, res);
    
        expect(res.json.calledOnce).to.be.true;
        expect(res.json.firstCall.args[0]).to.deep.equal({
            success: false,
            message: "Không có hình ảnh nào để tải lên!"
        });
    
        expect(uploadStub.notCalled).to.be.true;
        expect(saveStub.notCalled).to.be.true;
    });
    
});
