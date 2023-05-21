import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ReportService } from "./report.service";
import { Public } from "../common/decorators";
import { Customer } from "src/customers/entities/customer.entity";
import { Currency } from "src/currency/entities/currency.entity";

@Controller("report")
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Public()
  @Get(":customer/:currency/:startDate/:endDate")
  customerReport(
    @Param("customer") customer: number,
    @Param("currency") currency: number,
    @Param("startDate") startDate: Date,
    @Param("endDate") endDate: Date
  ) {
    return this.reportService.customerReport(
      customer,
      currency,
      startDate,
      endDate
    );
  }
}
