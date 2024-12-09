import { expect } from 'chai';
import supertest from 'supertest';
import {app, server} from '../../server.js';
import sinon from 'sinon';
import mongoose from 'mongoose';
import userModel from '../../models/userModel.js';
import productModel from '../../models/productModel.js';
import bcrypt from 'bcrypt';
const request = supertest(app);

describe('Order Flow Integration Test with Mock Data', function () {
  let userToken;
  let mockUser;
  let mockProduct;

  before(async () => {
    const mockUserId = new mongoose.Types.ObjectId();
    mockUser = {
      _id: mockUserId,
      name: 'Test User',
      email: 'testuser1@example.com',
      phone: '123456789',
      address: '123 Main Street',
      password: 'password123',
      cartData: {},
    };

    mockProduct = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Test Product',
      description: 'This is a test product.',
      price: 100000,
      images: [{ url: 'http://example.com/image.jpg', public_id: 'image123' }],
      category: 'Test Category',
      bestseller: false,
      date: Date.now(),
    };

    sinon.stub(userModel, 'findOne').returns(Promise.resolve(mockUser));
    sinon.stub(bcrypt, 'compare').returns(Promise.resolve(true));
    sinon.stub(productModel, 'findById').returns(Promise.resolve(mockProduct));

  });

  it('should login user and return token', async () => {
    const res = await request.post('/api/user/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

      
      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.token).to.be.a('string');
      
      userToken = res.body.token;
  });

  it('should add product to cart', async () => {
    const res = await request.post('/api/cart/add')
      .set('token', userToken)
      .send({
        userId: mockUser._id,
        itemId: mockProduct._id,
      });

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.message).to.equal('Sản phẩm đã được thêm vào giỏ hàng');
  });

  it('should place an order', async () => {
    const res = await request.post('/api/order/place')
      .set('token', userToken)
      .send({
        userId: mockUser._id,
        items: [{ itemId: mockProduct._id, quantity: 1 }],
        amount: 100000,
        address: '123 Main Street',
      });

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.message).to.equal('Đặt hàng thành công');
  });

  after(async () => {
    sinon.restore();
    await mongoose.connection.close();
    server.close();
  });
});
