import express from 'express';
import { route } from '../routenames';

import { CreateDeviceFactory } from '../../factories/Device/CreateDeviceFactory';
import { DeviceFactory } from '../../factories/WebView/DeviceFactory';

// --prefix /device
const deviceRouter = express.Router();

deviceRouter.get(route.device.home(), (req, res) => DeviceFactory().handle(req, res))
deviceRouter.post(route.device.create(), (req, res) => CreateDeviceFactory().handle(req, res))

export default deviceRouter;
