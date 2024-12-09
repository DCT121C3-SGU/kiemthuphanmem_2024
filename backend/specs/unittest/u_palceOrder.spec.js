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
        userId: 'mockUserId',
        items: [{ productId: 'mockProductId', quantity: 2 }],
        amount: 500,
        address: 'Mock Address',
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

  it('should successfully place an order and clear the user cart', async () => {
    await placeOrder(req, res);

    // Kiểm tra dữ liệu order được tạo chính xác
    const expectedOrderData = {
      userId: 'mockUserId',
      items: [{ productId: 'mockProductId', quantity: 2 }],
      address: 'Mock Address',
      amount: 500,
      paymentMethod: 'COD',
      payment: false,
      orderId: sinon.match.string,
      date: sinon.match.number,
    };

    // Kiểm tra save của orderModel được gọi đúng cách
    expect(orderSaveStub.calledOnce).to.be.true;
    const actualOrderData = orderSaveStub.firstCall.thisValue;
    expect(actualOrderData.userId).to.equal(expectedOrderData.userId);
    expect(actualOrderData.amount).to.equal(expectedOrderData.amount);
    expect(actualOrderData.paymentMethod).to.equal('COD');
    expect(actualOrderData.items).to.deep.equal(expectedOrderData.items);

    // Kiểm tra cartData của user được xóa
    expect(userUpdateStub.calledOnceWith('mockUserId', { cartData: {} })).to.be.true;

    // Kiểm tra phản hồi HTTP
    expect(res.status.calledOnceWith(200)).to.be.true;
    expect(res.json.calledOnceWith({
      success: true,
      message: 'Đặt hàng thành công',
    })).to.be.true;
  });

  it('should return an error if saving order fails', async () => {
    orderSaveStub.rejects(new Error('Database error'));

    await placeOrder(req, res);

    // Kiểm tra trạng thái phản hồi lỗi
    expect(res.status.calledOnceWith(500)).to.be.true;

    // Kiểm tra nội dung phản hồi lỗi
    expect(res.json.calledOnceWith({
      success: false,
      message: 'Database error',
    })).to.be.true;
  });

  it('should return an error if updating user cart fails', async () => {
    userUpdateStub.rejects(new Error('User update error'));

    await placeOrder(req, res);

    // Kiểm tra trạng thái phản hồi lỗi
    expect(res.status.calledOnceWith(500)).to.be.true;

    // Kiểm tra nội dung phản hồi lỗi
    expect(res.json.calledOnceWith({
      success: false,
      message: 'User update error',
    })).to.be.true;
  });
});
