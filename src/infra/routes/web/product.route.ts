import express from 'express';
import { route } from '../routenames';
import { ProductFactory } from '../../factories/WebView/ProductFactory';

// --prefix /fila
const productRouter = express.Router();

productRouter.get(route.products.home(), (req, res) => ProductFactory().handle(req, res))

export default productRouter;
