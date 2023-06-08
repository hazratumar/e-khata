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

  async downloadHistory(
    customer: number,
    currency: number,
    startDate: string,
    endDate: string
  ): Promise<{ url: string }> {
    const clientUrl = this.configService.get<string>("app.clientUrl");
    const serverUrl = this.configService.get<string>("app.serverUrl");

    const directory = join(__dirname, "..", "assets", "history");
    const filename = `history_${startDate}_to_${endDate}.pdf`;
    const fileUrl = {
      url: `${serverUrl}/assets/history/${filename}`,
    };

    const filePath = join(directory, filename);

    // Create the directory if it doesn't exist
    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }

    // Unlink (delete) any existing files in the directory with the same prefix
    const files = readdirSync(directory);
    if (files) {
      await Promise.all(
        files.map(async (file) => {
          if (file.startsWith("history_")) {
            unlinkSync(join(directory, file));
          }
        })
      );
    }

    const browser = await chromium.launch();
    const page = await browser.newPage(); // 2
    await page.setViewportSize({ width: 1280, height: 800 }); // 3
    await page.goto(
      `${clientUrl}/history/${customer}/${currency}/${startDate}/${endDate}`
    );

    await page.pdf({ path: filePath });
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
    const filename = `khata_${startDate}_to_${endDate}.pdf`;
    const fileUrl = {
      url: `${serverUrl}/assets/khata/${filename}`,
    };

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    const filePath = join(directory, filename);

    try {
      // Create the directory if it doesn't exist
      if (!existsSync(directory)) {
        mkdirSync(directory, { recursive: true });
      }

      // Unlink (delete) any existing files in the directory with the same prefix
      const files = readdirSync(directory);
      if (files) {
        await Promise.all(
          files.map(async (file) => {
            if (file.startsWith("khata_")) {
              unlinkSync(join(directory, file));
            }
          })
        );
      }

      await page.goto(
        `${clientUrl}/khata/${customer}/${currency}/${startDate}/${endDate}`
      );
      await page.waitForLoadState("networkidle");

      await page.pdf({
        path: filePath,
        format: "a4",
      });
      await page.setViewportSize({ width: 1280, height: 720 });

      await browser.close();
      return fileUrl;
    } catch (error) {
      console.error("Error occurred while generating the PDF:", error);
      throw new Error("Failed to generate the PDF.");
    }
  }
}
