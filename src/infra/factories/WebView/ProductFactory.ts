import { ProductController } from "../../../application/controllers/WebView/ProductController";
import { ProductUseCase } from "../../../domain/useCases/WebView/Product/ProductUseCase";
import { FindStartedQueueFactory } from "../Queue/FindStartedQueueFactory";

export const ProductFactory = () => {
  const useCase = new ProductUseCase();

  const controller = new ProductController(useCase);

  return controller;
}