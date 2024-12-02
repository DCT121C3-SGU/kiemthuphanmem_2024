import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import app from '../../server.js';
import userModel from '../../models/userModel.js';
import bcrypt from 'bcrypt';

describe('POST /register', () => {
    let findOneStub, saveStub, bcryptSaltStub, bcryptHashStub;

    beforeEach(() => {
        // Mock các hàm cần thiết
        findOneStub = sinon.stub(userModel, 'findOne');
        saveStub = sinon.stub(userModel.prototype, 'save');
        bcryptSaltStub = sinon.stub(bcrypt, 'genSalt');
        bcryptHashStub = sinon.stub(bcrypt, 'hash');
    });

    afterEach(() => {
        // Khôi phục các hàm gốc
        findOneStub.restore();
        saveStub.restore();
        bcryptSaltStub.restore();
        bcryptHashStub.restore();
    });

    it('should return error if the email already exists', async () => {
        const user = {
            name: 'Test User',
            email: 'existinguser@example.com',
            password: 'password123',
            phone: '0987654321'
        };

        // Giả lập rằng email đã tồn tại trong cơ sở dữ liệu
        findOneStub.resolves({ email: 'existinguser@example.com' });

        const response = await request(app)
            .post('/api/user/register')
            .send(user);

        expect(response.status).to.equal(200);
        expect(response.body.success).to.be.false;
        expect(response.body.message).to.equal('Tài khoản đã tồn tại');
    });

    it('should return error if the email format is invalid', async () => {
        const user = {
            name: 'Test User',
            email: 'invalidemail',
            password: 'password123',
            phone: '0987654321'
        };

        const response = await request(app)
            .post('/api/user/register')
            .send(user);

        expect(response.status).to.equal(200);
        expect(response.body.success).to.be.false;
        expect(response.body.message).to.equal('Email không hợp lệ');
    });

    it('should return error if the password is too short', async () => {
        const user = {
            name: 'Test User',
            email: 'newuser@example.com',
            password: 'short',
            phone: '0987654321'
        };

        const response = await request(app)
            .post('/api/user/register')
            .send(user);

        expect(response.status).to.equal(200);
        expect(response.body.success).to.be.false;
        expect(response.body.message).to.equal('Mật khẩu phải chứa hơn 8 kí tự');
    });

    // it('should return error if the phone number is invalid', async () => {
    //     const user = {
    //         name: 'Test User',
    //         email: 'newuser@example.com',
    //         password: 'password123',
    //         phone: 'invalidphone'
    //     };

    //     const response = await request(app)
    //         .post('/api/user/register')
    //         .send(user);

    //     expect(response.status).to.equal(200);
    //     expect(response.body.success).to.be.false;
    //     expect(response.body.message).to.equal('Số điện thoại không hợp lệ');
    // });

    it('should return success if registration is successful', async () => {
        const user = {
            name: 'Test User',
            email: 'newuser@example.com',
            password: 'password123',
            phone: '0987654321'
        };

        // Giả lập rằng email chưa tồn tại
        findOneStub.resolves(null);

        // Giả lập việc tạo salt và mã hóa mật khẩu thành công
        bcryptSaltStub.resolves(10);
        bcryptHashStub.resolves('hashedpassword');

        // Giả lập việc lưu người dùng vào cơ sở dữ liệu
        saveStub.resolves({ _id: 'someUserId' });

        const response = await request(app)
            .post('/api/user/register')
            .send(user);

        expect(response.status).to.equal(200);
        expect(response.body.success).to.be.true;
        expect(response.body.message).to.equal('Đăng ký thành công');
    });
});
