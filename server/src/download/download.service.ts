import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { Browser, chromium } from "playwright-chromium";
import { readdirSync, unlinkSync } from "fs";

@Injectable()
export class DownloadService implements OnModuleInit, OnModuleDestroy {
  private browser: Browser;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.browser = await chromium.launch({
      args: ["--disable-dev-shm-usage"],
    });
  }

  async onModuleDestroy() {
    await this.browser.close();
  }

  async downloadHistory(
    customer: number,
    currency: number,
    startDate: Date,
    endDate: Date
  ): Promise<{ url: string }> {
    const clientUrl = this.configService.get<string>("app.clientUrl");
    const serverUrl = this.configService.get<string>("app.serverUrl");

    const directory = join(__dirname, "..", "assets/history");
    const filename = `Report-${startDate}-${endDate}.pdf`;
    const fileUrl = {
      url: `${serverUrl}/assets/history/${filename}`,
    };

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    const filePath = join(directory, filename);

    // Unlink (delete) all existing files in the directory
    const files = readdirSync(directory);
    if (files) {
      await files.forEach(async (file) => {
        const filePath = join(directory, file);
        await unlinkSync(filePath);
      });
    }

    await page.goto(
      `${clientUrl}/history/${customer}/${currency}/${startDate}/${endDate}`
    );
    await page.waitForLoadState("networkidle");
    await page.pdf({ path: filePath, format: "a4" });

    await browser.close();
    return fileUrl;
  }
  async downloadKhata(
    customer: number,
    currency: number,
    startDate: Date,
    endDate: Date
  ): Promise<{ url: string }> {
    const clientUrl = this.configService.get<string>("app.clientUrl");
    const serverUrl = this.configService.get<string>("app.serverUrl");

    const directory = join(__dirname, "..", "assets/khata");
    const filename = `Report-${startDate}-${endDate}.pdf`;
    const fileUrl = {
      url: `${serverUrl}/assets/khata/${filename}`,
    };

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    const filePath = join(directory, filename);

    // Unlink (delete) all existing files in the directory
    const files = readdirSync(directory);
    if (files) {
      await files.forEach(async (file) => {
        const filePath = join(directory, file);
        await unlinkSync(filePath);
      });
    }

    await page.goto(
      `${clientUrl}/khata/${customer}/${currency}/${startDate}/${endDate}`
    );
    await page.waitForLoadState("networkidle");
    await page.pdf({ path: filePath, format: "a4" });

    await browser.close();
    return fileUrl;
  }
}
