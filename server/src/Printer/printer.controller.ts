import { Controller, Get } from "@nestjs/common";
import { PrinterService } from "./printer.service";
import { Public } from "../common/decorators";

@Controller("printer")
export class PrinterController {
  constructor(private readonly printerService: PrinterService) {}

  @Public()
  @Get("/customer/report")
  customerReport() {
    return this.printerService.printCustomerReport();
  }
}
