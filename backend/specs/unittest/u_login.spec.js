import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcrypt';
import userModel from '../../models/userModel.js';
import { loginUser } from '../../controllers/userController.js';

describe('loginUser', () => {
    let req, res, findOneStub, bcryptCompareStub;

    beforeEach(() => {
        process.env.JWT_SECRET = 'test_secret_key';

        req = { body: { email: '', password: '' } };
        res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

        findOneStub = sinon.stub(userModel, 'findOne');
        bcryptCompareStub = sinon.stub(bcrypt, 'compare');
    });

    afterEach(() => {
        findOneStub.restore();
        bcryptCompareStub.restore();
        delete process.env.JWT_SECRET;
    });

    it('should return success if email and password are correct', async () => {
        req.body = { email: 'test@example.com', password: 'password123' };
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

    it('should return error if email is correct but password is incorrect', async () => {
        req.body = { email: 'test@example.com', password: 'wrongpassword' };
        const userData = { email: 'test@example.com', password: 'hashedpassword123' };
        findOneStub.resolves(userData);
        bcryptCompareStub.resolves(false);

        await loginUser(req, res);

        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWith({ success: false, message: "Tài khoản hoặc mật khẩu không đúng" })).to.be.true;
    });

    it('should return error if password is correct but email is incorrect', async () => {
        req.body = { email: 'wrong@example.com', password: 'password123' };
        findOneStub.resolves(null); // Email không tồn tại

        await loginUser(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ success: false, message: "Tài khoản không tồn tại" })).to.be.true;
    });

    it('should return error if both email and password are incorrect', async () => {
        req.body = { email: 'wrong@example.com', password: 'wrongpassword' };
        findOneStub.resolves(null); // Email không tồn tại

        await loginUser(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ success: false, message: "Tài khoản không tồn tại" })).to.be.true;
    });

    it('should return error if email is empty', async () => {
        req.body = { email: '', password: 'password123' };

        await loginUser(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ success: false, message: "Email không được bỏ trống" })).to.be.true;
    });

    it('should return error if password is empty', async () => {
        req.body = { email: 'test@example.com', password: '' };

        await loginUser(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ success: false, message: "Mật khẩu không được bỏ trống" })).to.be.true;
    });
});
