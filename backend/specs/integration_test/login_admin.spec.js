import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import app from '../../server.js';
import jwt from 'jsonwebtoken';

describe('POST /admin/login', () => {

    it('should return error if the credentials are incorrect', async () => {
        const adminCredentials = {
            email: 'wrongadmin@example.com',
            password: 'wrongpassword'
        };

        const response = await request(app)
            .post('/api/user/admin')
            .send(adminCredentials);

        expect(response.status).to.equal(200);
        expect(response.body.success).to.be.false;
        expect(response.body.message).to.equal('Tài khoản hoặc mật khẩu không đúng');
    });

    it('should return success and a token if the credentials are correct', async () => {
        const adminCredentials = {
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD
        };

        // Giả lập jwt.sign để tạo token
        const jwtSignStub = sinon.stub(jwt, 'sign').returns('mocked-token');

        const response = await request(app)
            .post('/api/user/admin')
            .send(adminCredentials);

        expect(response.status).to.equal(200);
        expect(response.body.success).to.be.true;
        expect(response.body.token).to.equal('mocked-token');

        // Khôi phục lại hàm jwt.sign sau khi test
        jwtSignStub.restore();
    });

    it('should return error if the admin email or password is missing', async () => {
        const adminCredentials = {
            email: process.env.ADMIN_EMAIL, // only email
        };

        const response = await request(app)
            .post('/api/user/admin')
            .send(adminCredentials);

        expect(response.status).to.equal(200);
        expect(response.body.success).to.be.false;
        expect(response.body.message).to.equal('Tài khoản hoặc mật khẩu không đúng');
    });
});
