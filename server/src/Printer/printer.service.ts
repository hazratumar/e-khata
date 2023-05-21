import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { Browser, chromium } from "playwright-chromium";
import { readdirSync, unlinkSync } from "fs";

@Injectable()
export class PrinterService implements OnModuleInit, OnModuleDestroy {
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

  async printCustomerReport() {
    const directory = join(__dirname, "..", "assets/customer");
    const filename = "customer_Report.pdf";
    const publicUrl = `http://localhost:3001/assets/customer/${filename}`;

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

    await page.goto("http://localhost:3000/report");
    await page.waitForLoadState("networkidle");
    await page.pdf({ path: filePath, format: "a4" });

    await browser.close();
    return publicUrl;
  }
}
