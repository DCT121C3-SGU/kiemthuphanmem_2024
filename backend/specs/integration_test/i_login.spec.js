import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcrypt';
import app from '../../server.js';
import userModel from '../../models/userModel.js';

describe('POST /login', () => {
    let findOneStub;
    let bcryptCompareStub;

    beforeEach(() => {
        findOneStub = sinon.stub(userModel, 'findOne');
        bcryptCompareStub = sinon.stub(bcrypt, 'compare');
    });

    afterEach(() => {
        findOneStub.restore();
        bcryptCompareStub.restore();
    });

    it('should return error if the email does not exist', async () => {
        const user = {
            email: 'nonexistentuser@example.com',
            password: 'password123'
        };

        findOneStub.resolves(null);

        const response = await request(app)
            .post('/api/user/login')
            .send(user);

        expect(response.status).to.equal(200);
        expect(response.body.success).to.be.false;
        expect(response.body.message).to.equal("Tài khoản không tồn tại");
    });

    it('should return error if the password is incorrect', async () => {
        const user = {
            email: 'existinguser@example.com',
            password: 'wrongpassword'
        };

        const existingUser = { email: 'existinguser@example.com', password: 'hashedpassword' }; 
        findOneStub.resolves(existingUser);

        bcryptCompareStub.resolves(false);

        const response = await request(app)
            .post('/api/user/login')
            .send(user);

        expect(response.body.success).to.be.false;
        expect(response.body.message).to.equal("Bạn ơi hình như có gì đó sai sai!");
    });

    it('should return success if the login is successful', async () => {
        const user = {
            email: 'trunggaming65@gmail.com',
            password: '123456789'
        };

        const existingUser = { email: 'trunggaming65@gmail.com', password: 'hashedpassword' };
        findOneStub.resolves(existingUser);

        bcryptCompareStub.resolves(true);

        const response = await request(app)
            .post('/api/user/login')
            .send(user);

        expect(response.status).to.equal(200);
        expect(response.body.success).to.be.true;
        expect(response.body.message).to.equal("Đăng nhập thành công");
    });
});
