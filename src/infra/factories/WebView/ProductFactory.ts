import { ProductController } from "../../../application/controllers/WebView/ProductController";
import { ProductsInCategoriesUseCase } from "../../../domain/useCases/WebView/Product/ProductsInCategoriesUseCase";
import { ProductCategoryRepository } from "../../repositories/in-prisma/ProductCategoryRepository";
import { ProductRepository } from "../../repositories/in-prisma/ProductRepository";

export const ProductFactory = () => {
  const categoryRepo = new ProductCategoryRepository();
  const productRepo = new ProductRepository();
  const useCase = new ProductsInCategoriesUseCase(
    categoryRepo,
    productRepo
  );

  const controller = new ProductController(useCase);

  return controller;
}