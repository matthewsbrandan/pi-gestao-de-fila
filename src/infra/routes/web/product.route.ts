import express from 'express';
import { route } from '../routenames';
import { ProductFactory } from '../../factories/WebView/ProductFactory';
import { ImportProductsFactory } from '../../factories/Product/ImportProductsFactory';

// --prefix /fila
const productRouter = express.Router();

productRouter.get(route.products.home(), (req, res) => ProductFactory().handle(req, res))
productRouter.post(route.products.import(), (req, res) => ImportProductsFactory().handle(req, res))

// route.products.update

export default productRouter;
