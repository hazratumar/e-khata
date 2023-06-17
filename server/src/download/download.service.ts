import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { Browser, chromium } from "playwright-chromium";
import { existsSync, mkdirSync, readdirSync, unlinkSync } from "fs";

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

  private deleteFilesWithPrefix(directory: string, prefix: string): void {
    const files = readdirSync(directory);
    files.forEach((file) => {
      if (file.startsWith(prefix)) {
        unlinkSync(join(directory, file));
      }
    });
  }

  async downloadHistory(
    customer: number,
    currency: number,
    startDate: string,
    endDate: string
  ): Promise<{ url: string }> {
    const clientUrl = this.configService.get<string>("app.clientUrl");
    const serverUrl = this.configService.get<string>("app.serverUrl");

    const directory = join(__dirname, "..", "assets", "history");
    const prefix = "history_";
    const filename = `history_${startDate}_to_${endDate}.pdf`;
    const filePath = join(directory, filename);
    const fileUrl = {
      url: `${serverUrl}/assets/history/${filename}`,
    };

    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }

    this.deleteFilesWithPrefix(directory, prefix);

    const context = await this.browser.newContext();
    const page = await context.newPage();

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(
      `${clientUrl}/history/${customer}/${currency}/${startDate}/${endDate}`
    );
    await page.waitForLoadState("networkidle");
    await page.pdf({
      path: filePath,
      format: "a4",
    });
    await page.close();

    return fileUrl;
  }

  async downloadKhata(
    customer: number,
    currency: number,
    startDate: string,
    endDate: string
  ): Promise<{ url: string }> {
    const clientUrl = this.configService.get<string>("app.clientUrl");
    const serverUrl = this.configService.get<string>("app.serverUrl");

    const directory = join(__dirname, "..", "assets", "khata");
    const prefix = "khata_";
    const filename = `khata_${startDate}_to_${endDate}.pdf`;
    const fileUrl = {
      url: `${serverUrl}/assets/khata/${filename}`,
    };

    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }

    this.deleteFilesWithPrefix(directory, prefix);

    const context = await this.browser.newContext();
    const page = await context.newPage();

    await page.setViewportSize({ width: 1880, height: 720 });

    await page.goto(
      `${clientUrl}/khata/${customer}/${currency}/${startDate}/${endDate}`
    );
    await page.waitForLoadState("networkidle");

    await page.pdf({
      path: join(directory, filename),
      format: "a4",
    });

    await page.close();
    await context.close();

    return fileUrl;
  }
}
