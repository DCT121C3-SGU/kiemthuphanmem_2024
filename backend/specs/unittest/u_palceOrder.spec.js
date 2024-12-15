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
        address: {firsName: 'mockFirstName', lastName: 'mockLastName', address: 'mockAddress', city: 'mockCity', district: 'mockDistrict', ward: 'mockWard', phone: 'mockPhone'},
        items: [{ productId: 'mockProductId', quantity: 2 }],
        amount: 500,
      },
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    orderSaveStub = sinon.stub(orderModel.prototype, 'save').callsFake(function() {
      this.userId = req.body.userId;
      this.items = req.body.items;
      this.address = req.body.address;
      this.amount = req.body.amount;
      return Promise.resolve(this);
    });;
    userUpdateStub = sinon.stub(userModel, 'findByIdAndUpdate').resolves({
      _id: 'mockUserId'
    });
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
    await placeOrder(req, res);

    expect(orderSaveStub.calledOnce).to.be.true;

    const savedOrder = orderSaveStub.firstCall.thisValue;

    expect(savedOrder.items).to.deep.equal(req.body.items);

    expect(savedOrder).to.include({
      userId: req.body.userId,
      address: req.body.address,
      amount: req.body.amount,
      paymentMethod: "COD",
      payment: false
    });

    expect(userUpdateStub.calledOnceWith(req.body.userId, { cartData: {} })).to.be.true;

    expect(res.status.calledOnceWith(200)).to.be.true;
    expect(res.json.calledOnceWith({
      success: true,
      message: "Đặt hàng thành công"
    })).to.be.true;
  });   
});
