import { expect } from 'chai';
import sinon from 'sinon';
import roomModel from '../../models/roomModel.js';
import userModel from '../../models/userModel.js';
import bookingModel from '../../models/bookingModel.js';
import { bookingRoom } from '../../controllers/roomController.js';

describe('bookingRoom', () => {
  let req, res, roomFindStub, userFindStub, bookingSaveStub, roomUpdateStub;

  beforeEach(() => {
    req = {
      body: {
        userId: 'mockUserId',
        roomId: 'mockRoomId',
        slotDate: '2024-12-20',
        slotTime: '10:00',
      },
    };

    res = {
      json: sinon.stub(),
    };

    roomFindStub = sinon.stub(roomModel, 'findById');
    userFindStub = sinon.stub(userModel, 'findById');
    bookingSaveStub = sinon.stub(bookingModel.prototype, 'save').resolves();
    roomUpdateStub = sinon.stub(roomModel, 'findByIdAndUpdate').resolves();
  });

  afterEach(() => {
    sinon.restore();
  });

//   it('should return error if room does not exist', async () => {
//     roomFindStub.resolves(null);

//     await bookingRoom(req, res);

//     expect(res.json.calledOnceWith({ success: false, message: 'Phòng không tồn tại' })).to.be.true;
//   });

  it('should return error if the room is already booked for the given slot', async () => {
    roomFindStub.resolves({
      room_status: true,
      room_booked: {
        '2024-12-20': ['10:00'],
      },
    });

    await bookingRoom(req, res);

    expect(res.json.calledOnceWith({ success: false, message: 'Phòng đã được đặt vào thời gian này' })).to.be.true;
  });

  it('should book a room successfully if the slot is available', async () => {
    roomFindStub.resolves({
      room_status: true,
      room_price: 500,
      room_booked: {},
    });
    userFindStub.resolves({ _id: 'mockUserId', name: 'Mock User' });

    await bookingRoom(req, res);

    expect(bookingSaveStub.calledOnce).to.be.true;
    expect(roomUpdateStub.calledOnceWith('mockRoomId', {
      room_booked: {
        '2024-12-20': ['10:00'],
      },
    })).to.be.true;
    expect(res.json.calledOnceWith({ success: true, message: 'Đặt phòng thành công' })).to.be.true;
  });

//   it('should handle errors gracefully', async () => {
//     roomFindStub.throws(new Error('Database error'));

//     await bookingRoom(req, res);

//     expect(res.json.calledOnceWith({ success: false, message: 'Database error' })).to.be.true;
//   });
});
