import { ImportProductsController } from "../../../application/controllers/Product/ImportProductsController";
import { ImportProductsUseCase } from "../../../domain/useCases/Product/ImportProducts/ImportProductsUseCase";
import { ProductCategoryRepository } from "../../repositories/in-prisma/ProductCategoryRepository";
import { ProductRepository } from "../../repositories/in-prisma/ProductRepository";

export const ImportProductsFactory = () => {
  const categoryRepo = new ProductCategoryRepository();
  const productRepo = new ProductRepository();
  
  const useCase = new ImportProductsUseCase(
    categoryRepo,
    productRepo
  );

  const controller = new ImportProductsController(useCase);

  return controller;
}