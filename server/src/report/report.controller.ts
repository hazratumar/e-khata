import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ReportService } from "./report.service";
import { Public } from "../common/decorators";

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
