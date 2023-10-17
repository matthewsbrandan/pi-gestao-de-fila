import { DashboardController } from "../../../application/controllers/WebView/DashboardController";
import { DashboardUseCase } from "../../../domain/useCases/WebView/Dashboard/DashboardUseCase";

export const DashboardFactory = () => {
  const useCase = new DashboardUseCase();

  const controller = new DashboardController(useCase);

  return controller;
}