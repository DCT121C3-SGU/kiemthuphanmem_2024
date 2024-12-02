import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcrypt';
import userModel from '../../models/userModel.js';
import { loginUser } from '../../controllers/userController.js';

describe('loginUser', () => {
    let req, res, findOneStub, bcryptCompareStub;

    beforeEach(() => {
        process.env.JWT_SECRET = 'test_secret_key';

        req = { body: { email: 'test@example.com', password: 'password123' } };
        res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

        findOneStub = sinon.stub(userModel, 'findOne');
        bcryptCompareStub = sinon.stub(bcrypt, 'compare');
    });

    afterEach(() => {
        findOneStub.restore();
        bcryptCompareStub.restore();
        delete process.env.JWT_SECRET;
    });

    it('should return error if user is not found', async () => {
        findOneStub.resolves(null);

        await loginUser(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ success: false, message: "Tài khoản không tồn tại" })).to.be.true;
    });

    it('should return error if password does not match', async () => {
        findOneStub.resolves({ email: 'test@example.com', password: 'hashedpassword123' });
        bcryptCompareStub.resolves(false);

        await loginUser(req, res);

        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWith({ success: false, message: "Bạn ơi hình như có gì đó sai sai!" })).to.be.true;
    });

    it('should return success and token if login is successful', async () => {
        const userData = { email: 'test@example.com', password: 'hashedpassword123' };
        findOneStub.resolves(userData);
        bcryptCompareStub.resolves(true);

        await loginUser(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({
            success: true,
            message: "Đăng nhập thành công",
            token: sinon.match.string 
        })).to.be.true;
    });
});
