import { Controller, Get, Param } from "@nestjs/common";
import { ReportService } from "./report.service";
import { Public } from "src/common/decorators";

@Controller("report")
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Public()
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

  @Public()
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
