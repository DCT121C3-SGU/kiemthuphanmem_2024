import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcrypt';
import userModel from '../../models/userModel.js';
import { registerUser } from '../../controllers/userController.js';
import jwt from 'jsonwebtoken';
import validator from 'validator';

process.env.JWT_SECRET = 'mocked-secret-key'; 

const createToken = sinon.stub(jwt, 'sign').returns('mocked-token');

describe('registerUser', () => {
    let req, res, findOneStub, bcryptGenSaltStub, bcryptHashStub, saveStub;

    beforeEach(() => {
        req = { body: { name: 'test', email: 'f@gmail.com', password: 'password123', phone: '123456789' } };
        res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

        findOneStub = sinon.stub(userModel, 'findOne');
        bcryptGenSaltStub = sinon.stub(bcrypt, 'genSalt');
        bcryptHashStub = sinon.stub(bcrypt, 'hash');
        saveStub = sinon.stub(userModel.prototype, 'save');

        saveStub.resolves({ _id: '123', email: 'f@gmail.com', name: 'test', phone: '123456789' });
    });

    afterEach(() => {
        // Make sure to restore the stubs after each test
        if (findOneStub.restore) findOneStub.restore();
        if (bcryptGenSaltStub.restore) bcryptGenSaltStub.restore();
        if (bcryptHashStub.restore) bcryptHashStub.restore();
        if (saveStub.restore) saveStub.restore();
        if (createToken.restore) createToken.restore();
    });

    it('should return error if email already exists', async () => {
        findOneStub.resolves({ _id: '123', email: 'f@gmail.com' });

        await registerUser(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ success: false, message: 'Tài khoản đã tồn tại' })).to.be.true;
    });

    it('should return error if email is invalid', async () => {
        req.body.email = 'invalidemail.com';

        await registerUser(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ success: false, message: 'Email không hợp lệ' })).to.be.true;
    });

    it('should return error if password is too short', async () => {
        req.body.password = '12345';

        await registerUser(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ success: false, message: 'Mật khẩu phải chứa hơn 8 kí tự' })).to.be.true;
    });

    it('should return success if user is registered successfully', async () => {
        findOneStub.resolves(null);
        bcryptGenSaltStub.resolves('salt');
        bcryptHashStub.resolves('hashedpassword');

        saveStub.resolves({ _id: '123', email: 'f@gmail.com', name: 'test', phone: '123456789' });
    
        await registerUser(req, res);
    
        expect(res.status.calledWith(201)).to.be.true;
    
        expect(res.json.calledOnce).to.be.true;
        
        const jsonArg = res.json.firstCall.args[0];
    
        expect(jsonArg).to.be.an('object');
        expect(jsonArg).to.have.property('success', true);
        expect(jsonArg).to.have.property('message', 'Đăng ký thành công');
        expect(jsonArg).to.have.property('token');
    });
    
});
