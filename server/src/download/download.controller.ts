import { Controller, Get, Param } from "@nestjs/common";
import { DownloadService } from "./download.service";

@Controller("download")
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}

  @Get("history/:customer/:currency/:startDate/:endDate")
  downloadHistory(
    @Param("customer") customer: number,
    @Param("currency") currency: number,
    @Param("startDate") startDate: string,
    @Param("endDate") endDate: string
  ) {
    return this.downloadService.downloadHistory(
      customer,
      currency,
      startDate,
      endDate
    );
  }
  @Get("khata/:customer/:currency/:startDate/:endDate")
  downloadKhata(
    @Param("customer") customer: number,
    @Param("currency") currency: number,
    @Param("startDate") startDate: string,
    @Param("endDate") endDate: string
  ) {
    return this.downloadService.downloadKhata(
      customer,
      currency,
      startDate,
      endDate
    );
  }
}
