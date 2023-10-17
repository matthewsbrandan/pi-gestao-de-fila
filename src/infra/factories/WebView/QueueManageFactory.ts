import { QueueManageController } from "../../../application/controllers/WebView/QueueManageController";
import { ProductsInCategoriesUseCase } from "../../../domain/useCases/WebView/Product/ProductsInCategoriesUseCase";
import { ProductCategoryRepository } from "../../repositories/in-prisma/ProductCategoryRepository";
import { ProductRepository } from "../../repositories/in-prisma/ProductRepository";
import { FindStartedQueueFactory } from "../Queue/FindStartedQueueFactory";

export const QueueManageFactory = () => {  
  const findStartedQueue = FindStartedQueueFactory().useCase
  const categoryRepo = new ProductCategoryRepository();
  const productRepo = new ProductRepository();
  const productsUseCase = new ProductsInCategoriesUseCase(
    categoryRepo,
    productRepo
  );

  const controller = new QueueManageController(
    findStartedQueue,
    productsUseCase
  );

  return controller;
}