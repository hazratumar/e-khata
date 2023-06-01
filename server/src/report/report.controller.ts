import { Controller, Get, Param } from "@nestjs/common";
import { ReportService } from "./report.service";

@Controller("report")
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get("history/:customer/:currency/:startDate/:endDate")
  customerHistory(
    @Param("customer") customer: number,
    @Param("currency") currency: number,
    @Param("startDate") startDate: Date,
    @Param("endDate") endDate: Date
  ) {
    return this.reportService.customerHistory(
      customer,
      currency,
      startDate,
      endDate
    );
  }
  @Get("khata/:customer/:currency/:startDate/:endDate")
  customerKhata(
    @Param("customer") customer: number,
    @Param("currency") currency: number,
    @Param("startDate") startDate: Date,
    @Param("endDate") endDate: Date
  ) {
    return this.reportService.customerKhata(
      customer,
      currency,
      startDate,
      endDate
    );
  }
}
