import { expect } from 'chai';
import sinon from 'sinon';
import userModel from '../../models/userModel.js';
import orderModel from '../../models/orderModel.js';
import { placeOrder } from '../../controllers/orderController.js';

describe('placeOrder', () => {
  let req, res, orderSaveStub, userUpdateStub;

  beforeEach(() => {
    req = {
      body: {
        address: [{firsName: 'mockFirstName', lastName: 'mockLastName', address: 'mockAddress', city: 'mockCity', district: 'mockDistrict', ward: 'mockWard', phone: 'mockPhone'}],
        items: [{ productId: 'mockProductId', quantity: 2 }],
        amount: 500,
      },
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    orderSaveStub = sinon.stub(orderModel.prototype, 'save').resolves();
    userUpdateStub = sinon.stub(userModel, 'findByIdAndUpdate').resolves();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return error if no items in the cart', async () => {
    req.body.items = [];

    await placeOrder(req, res);

    expect(res.status.calledOnceWith(400)).to.be.true;
    expect(res.json.calledOnceWith({
      success: false,
      message: 'Không có sản phẩm trong giỏ hàng',
    })).to.be.true;
  });

  it('should return error if name is empty', async () => {
    req.body.address.firstName = ''; // Empty name

    await placeOrder(req, res);

    expect(res.status.calledOnceWith(400)).to.be.true;
    expect(res.json.calledOnceWith({
      success: false,
      message: 'Họ và Tên không được để trống',
    })).to.be.true;
  });

  it('should return error if address is empty', async () => {
    req.body.address.address = ''; // Empty address object
  
    await placeOrder(req, res);
  
    expect(res.status.calledOnceWith(400)).to.be.true;
    expect(res.json.calledOnceWith({
      success: false,
      message: 'Địa chỉ không được để trống',
    })).to.be.true;
  });

  it('should return error if city or district is empty', async () => {
    req.body.address.city = '';

    await placeOrder(req, res);

    expect(res.status.calledOnceWith(400)).to.be.true;
    expect(res.json.calledOnceWith({
      success: false,
      message: 'Vui lòng chọn đầy đủ địa chỉ',
    })).to.be.true;
  });

  it('should return error if phone number is empty', async () => {
    req.body.address.phone = '';

    await placeOrder(req, res);

    expect(res.status.calledOnceWith(400)).to.be.true;
    expect(res.json.calledOnceWith({
      success: false,
      message: 'Số điện thoại không được để trống',
    })).to.be.true;
  });

  it('should successfully place an order with complete information', async () => {
    // Arrange: Prepare the expected order data
    const expectedOrderData = {
      userId: 'mockUserId',
      items: [{ productId: 'mockProductId', quantity: 2 }],
      address: 'Mock Address',
      amount: 500,
      paymentMethod: 'COD',
      payment: false,
      orderId: sinon.match.string, // Match any string value for orderId
      date: sinon.match.number, // Match any number value for date (timestamp)
    };
  
    // Act: Call the placeOrder function with the request and response
    await placeOrder(req, res);
  
    // Assert: Check if the order was saved correctly
    const actualOrderData = orderSaveStub.firstCall.thisValue;
    expect(orderSaveStub.calledOnce).to.be.true;
    
    // Validate that the order data matches the expected structure
    expect(actualOrderData.userId).to.equal(expectedOrderData.userId);
    expect(actualOrderData.items).to.deep.equal(expectedOrderData.items);
    expect(actualOrderData.address).to.equal(expectedOrderData.address);
    expect(actualOrderData.amount).to.equal(expectedOrderData.amount);
    expect(actualOrderData.paymentMethod).to.equal(expectedOrderData.paymentMethod);
    expect(actualOrderData.payment).to.equal(expectedOrderData.payment);
  
    // Assert: Check if the user's cart was cleared correctly
    expect(userUpdateStub.calledOnceWith('mockUserId', { cartData: {} })).to.be.true;
  
    // Assert: Verify the HTTP response status and message
    expect(res.status.calledOnceWith(200)).to.be.true;
    expect(res.json.calledOnceWith({
      success: true,
      message: 'Đặt hàng thành công',
    })).to.be.true;
  });
  
  
});
