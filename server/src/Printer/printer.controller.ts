import { Controller, Get, Param } from "@nestjs/common";
import { PrinterService } from "./printer.service";
import { Public } from "../common/decorators";

@Controller("printer")
export class PrinterController {
  constructor(private readonly printerService: PrinterService) {}

  @Public()
  @Get(":customer/:currency/:startDate/:endDate")
  printCustomerReport(
    @Param("customer") customer: number,
    @Param("currency") currency: number,
    @Param("startDate") startDate: Date,
    @Param("endDate") endDate: Date
  ) {
    return this.printerService.printCustomerReport(
      customer,
      currency,
      startDate,
      endDate
    );
  }
}
