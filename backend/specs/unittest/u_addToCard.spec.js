import { expect } from 'chai';
import sinon from 'sinon';
import userModel from '../../models/userModel.js';
import { addToCart } from '../../controllers/cartController.js';

describe('addToCart', () => {
    let req, res, findByIdStub, findByIdAndUpdateStub;

    beforeEach(() => {
        req = {
            body: {
                userId: 'testUserId',
                itemId: 'testItemId',
            },
        };
        res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

        findByIdStub = sinon.stub(userModel, 'findById');
        findByIdAndUpdateStub = sinon.stub(userModel, 'findByIdAndUpdate');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should add a new item to the cart if it does not exist', async () => {
        const mockUser = { 
            cartData: {} 
        };

        findByIdStub.resolves(mockUser);

        await addToCart(req, res);

        expect(findByIdStub.calledOnceWith('testUserId')).to.be.true;
        expect(findByIdAndUpdateStub.calledOnceWith('testUserId', {
            cartData: { testItemId: 1 },
        })).to.be.true;
        expect(res.json.calledWith({
            success: true,
            message: 'Sản phẩm đã được thêm vào giỏ hàng',
        })).to.be.true;
    });

    it('should increment the quantity of an existing item in the cart', async () => {
        const mockUser = {
            cartData: { testItemId: 2 },
        };

        findByIdStub.resolves(mockUser);

        await addToCart(req, res);

        expect(findByIdStub.calledOnceWith('testUserId')).to.be.true;
        expect(findByIdAndUpdateStub.calledOnceWith('testUserId', {
            cartData: { testItemId: 3 },
        })).to.be.true;
        expect(res.json.calledWith({
            success: true,
            message: 'Sản phẩm đã được thêm vào giỏ hàng',
        })).to.be.true;
    });
});
